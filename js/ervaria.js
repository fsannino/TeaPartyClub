// ============================================================
// ERVARIA SYNC MODULE — Supabase Integration
// ============================================================
const ervaria = {
  client: null,
  user: null,
  isOnline: false,
  isAdmin: false,

  async init() {
    try {
      this.client = window.supabase.createClient(
        'https://lwzrzztzpklzbmxbqcrx.supabase.co',
        'sb_publishable_bZGiaIhD7KqZ5QffyrHwRA_g7fmRT25'
      );
      this.client.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          this.user = session.user;
          this.isOnline = true;
          this.onLogin();
        } else if (event === 'SIGNED_OUT') {
          this.user = null;
          this.isOnline = false;
          this.onLogout();
        }
      });
      const { data: { session } } = await this.client.auth.getSession();
      if (session?.user) {
        this.user = session.user;
        this.isOnline = true;
        this.onLogin();
      } else {
        this.updateAuthUI(false);
      }
    } catch (e) {
      console.warn('Supabase offline:', e);
      this.updateAuthUI(false);
    }
  },

  // ── AUTH METHODS ─────────────────────────────────────────
  async loginEmail(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async signupEmail(email, password, name) {
    const { data, error } = await this.client.auth.signUp({
      email, password,
      options: { data: { full_name: name || email.split('@')[0] } }
    });
    if (error) throw error;
    return data;
  },
  async loginGoogle() {
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        scopes: 'openid email profile'
      }
    });
    if (error) this.showMsg(error.message, true);
  },
  async logout() {
    await this.client.auth.signOut();
    this.removeProfileMenu();
  },
  async resetPassword(email) {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });
    if (error) throw error;
  },

  // ── LOGIN/LOGOUT CALLBACKS ──────────────────────────────
  async onLogin() {
    this.updateAuthUI(true);
    this.hideAuthModal();
    // Check if profile is completed
    const { data: profile } = await this.client
      .from('user_profiles')
      .select('profile_completed, display_name, email, extra_emails, phone, city, state, country, role, main_interest, referral_source, newsletter_optin, is_admin')
      .eq('id', this.user.id)
      .maybeSingle();

    this.isAdmin = profile?.is_admin || false;

    if (!profile || !profile.profile_completed) {
      // Pre-fill from Google data
      const meta = this.user.user_metadata || {};
      document.getElementById('pcName').value = meta.full_name || meta.name || profile?.display_name || '';
      document.getElementById('pcEmail').value = this.user.email || '';
      document.getElementById('pcPhone').value = profile?.phone || '';
      document.getElementById('pcExtraEmails').value = profile?.extra_emails || '';
      // Populate geo selects
      populateCountries();
      const savedCountry = profile?.country || 'Brasil';
      document.getElementById('pcCountry').value = savedCountry;
      onCountryChange();
      if (profile?.state) {
        // Try to find UF by name for select
        const states = GEO.states[savedCountry];
        if (states) {
          const st = states.find(s => s.name === profile.state || s.uf === profile.state);
          if (st) { document.getElementById('pcState').value = st.uf; onStateChange(); }
          else { document.getElementById('pcStateText').value = profile.state; }
        } else { document.getElementById('pcStateText').value = profile.state; }
      }
      if (profile?.city) {
        const cityVal = document.getElementById('pcCity').querySelector(`option[value="${profile.city}"]`);
        if (cityVal) { document.getElementById('pcCity').value = profile.city; }
        else { document.getElementById('pcCityText').value = profile.city; document.getElementById('pcCityText').style.display = ''; }
      }
      if (profile?.newsletter_optin != null) document.getElementById('pcNewsletter').checked = profile.newsletter_optin;
      if (profile?.role) {
        selectedRole = profile.role;
        document.querySelectorAll('#pcRoles .pc-role').forEach(b => {
          b.classList.toggle('on', b.dataset.role === profile.role);
        });
        document.getElementById('pcOtherField').style.display = profile.role === 'outro' ? 'block' : 'none';
      }
      if (profile?.main_interest) {
        selectedInterest = profile.main_interest;
        document.querySelectorAll('#pcInterests .pc-role').forEach(b => {
          b.classList.toggle('on', b.dataset.interest === profile.main_interest);
        });
      }
      if (profile?.referral_source) {
        selectedReferral = profile.referral_source;
        document.querySelectorAll('#pcReferral .pc-role').forEach(b => {
          b.classList.toggle('on', b.dataset.ref === profile.referral_source);
        });
      }
      // Show profile completion
      document.getElementById('profileCompleteOverlay').classList.add('on');
      document.body.style.overflow = 'hidden';
    } else {
      this.syncFromCloud();
      enterAppAfterAuth();
      localStorage.setItem('erb_entered', '1');
      toast('Bem-vindo, ' + (profile.display_name || this.user.email.split('@')[0]) + '!');
    }
  },
  onLogout() {
    this.updateAuthUI(false);
    localStorage.removeItem('erb_entered');
    localStorage.removeItem('erb_auth');
    backToLanding();
    toast('Até logo!');
  },

  // ── SYNC: READ FROM CLOUD → localStorage ────────────────
  async syncFromCloud() {
    if (!this.isOnline) return;
    try {
      const [favRes, prefRes] = await Promise.all([
        this.client.from('user_favorites').select('tea_id').eq('user_id', this.user.id),
        this.client.from('user_preferences').select('*').eq('user_id', this.user.id).maybeSingle()
      ]);
      if (favRes.data) {
        const cloudFavs = favRes.data.map(r => parseInt(r.tea_id));
        // Merge: cloud + local
        const localFavs = JSON.parse(localStorage.getItem('erb_favs') || '[]');
        const merged = [...new Set([...cloudFavs, ...localFavs])];
        favorites = merged;
        localStorage.setItem('erb_favs', JSON.stringify(merged));
        // Push local-only favs to cloud
        const localOnly = localFavs.filter(id => !cloudFavs.includes(id));
        if (localOnly.length) {
          await this.client.from('user_favorites').insert(
            localOnly.map(id => ({ user_id: this.user.id, tea_id: String(id) }))
          );
        }
      }
      if (prefRes.data) {
        const p = prefRes.data;
        perfilState.saude = p.caffeine_pref ? [p.caffeine_pref] : perfilState.saude;
        perfilState.sabores = p.flavor_pref ? [p.flavor_pref] : perfilState.sabores;
        perfilState.momentos = p.moment_pref ? [p.moment_pref] : perfilState.momentos;
        localStorage.setItem('erb_perfil', JSON.stringify(perfilState));
      }
      // Re-render
      renderHerbs();
      renderFavs();
      renderPerfil();
      console.log('Ervaria: synced from cloud');
    } catch (e) {
      console.error('Sync error:', e);
    }
  },

  // ── SYNC: PUSH SINGLE ACTION TO CLOUD ───────────────────
  async pushFavorite(herbId, isFav) {
    if (!this.isOnline) return;
    try {
      if (isFav) {
        await this.client.from('user_favorites').insert({
          user_id: this.user.id, tea_id: String(herbId)
        });
      } else {
        await this.client.from('user_favorites')
          .delete()
          .eq('user_id', this.user.id)
          .eq('tea_id', String(herbId));
      }
    } catch (e) { console.error('Push fav error:', e); }
  },

  async pushPerfil(perfil) {
    if (!this.isOnline) return;
    try {
      await this.client.from('user_preferences').upsert({
        user_id: this.user.id,
        caffeine_pref: perfil.saude?.[0] || null,
        flavor_pref: perfil.sabores?.[0] || null,
        moment_pref: perfil.momentos?.[0] || null
      }, { onConflict: 'user_id' });
    } catch (e) { console.error('Push perfil error:', e); }
  },

  async pushRecipe(recipe) {
    // Recipes stay local for now (complex structure)
    // Future: sync to tasting_journal
  },

  // ── UI METHODS ──────────────────────────────────────────
  updateAuthUI(loggedIn) {
    const btn = document.getElementById('ervaria-auth-btn');
    if (!btn) return;
    if (loggedIn) {
      const name = this.user?.user_metadata?.full_name || this.user?.email?.split('@')[0] || 'Você';
      const avatar = this.user?.user_metadata?.avatar_url;
      btn.innerHTML = avatar
        ? `<img src="${esc(avatar)}" alt="${esc(name)}"> ${esc(name)}`
        : `<span class="auth-avatar">${esc(name[0].toUpperCase())}</span> ${esc(name)}`;
      btn.onclick = () => this.toggleProfileMenu();
    } else {
      btn.innerHTML = '⚷ Entrar';
      btn.onclick = () => this.showAuthModal();
    }
  },

  showAuthModal() {
    document.getElementById('authOverlay').classList.add('on');
    document.body.style.overflow = 'hidden';
  },
  hideAuthModal() {
    document.getElementById('authOverlay').classList.remove('on');
    document.body.style.overflow = '';
  },
  switchTab(tab) {
    document.getElementById('formLogin').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('formSignup').style.display = tab === 'signup' ? 'block' : 'none';
    document.getElementById('tabLogin').classList.toggle('on', tab === 'login');
    document.getElementById('tabSignup').classList.toggle('on', tab === 'signup');
    document.getElementById('authMsg').textContent = '';
  },
  showMsg(text, isErr) {
    const m = document.getElementById('authMsg');
    m.textContent = text;
    m.className = 'auth-msg ' + (isErr ? 'err' : 'ok');
  },

  async handleLogin() {
    const email = document.getElementById('authEmail').value.trim();
    const pass = document.getElementById('authPass').value;
    if (!email || !pass) { this.showMsg('Preencha email e senha', true); return; }
    try {
      this.showMsg('Entrando...', false);
      await this.loginEmail(email, pass);
    } catch (e) {
      this.showMsg(e.message === 'Invalid login credentials' ? 'Email ou senha incorretos' : e.message, true);
    }
  },
  async handleSignup() {
    const name = document.getElementById('authName').value.trim();
    const email = document.getElementById('authSignEmail').value.trim();
    const pass = document.getElementById('authSignPass').value;
    if (!email || !pass) { this.showMsg('Preencha email e senha', true); return; }
    if (pass.length < 6) { this.showMsg('Senha: mínimo 6 caracteres', true); return; }
    try {
      this.showMsg('Criando conta...', false);
      await this.signupEmail(email, pass, name);
      this.showMsg('Conta criada! Verifique seu email para confirmar.');
    } catch (e) { this.showMsg(e.message, true); }
  },
  async handleForgotPassword() {
    const email = document.getElementById('authEmail').value.trim();
    if (!email) { this.showMsg('Digite seu email acima primeiro', true); return; }
    try {
      await this.resetPassword(email);
      this.showMsg('Email de recuperação enviado!');
    } catch (e) { this.showMsg(e.message, true); }
  },

  toggleProfileMenu() {
    const existing = document.getElementById('profileMenu');
    if (existing) { existing.remove(); return; }
    const name = this.user?.user_metadata?.full_name || this.user?.email?.split('@')[0] || 'Usuário';
    const email = this.user?.email || '';
    const menu = document.createElement('div');
    menu.id = 'profileMenu';
    menu.className = 'profile-menu';
    menu.innerHTML = `
      <div class="profile-menu-header">
        <div class="profile-menu-name">${esc(name)}</div>
        <div class="profile-menu-email">${esc(email)}</div>
        <div class="profile-menu-sync">✓ Sincronizado</div>
      </div>
      <button onclick="ervaria.syncFromCloud();ervaria.removeProfileMenu()">↻ Sincronizar agora</button>
      ${this.isAdmin?'<button onclick="window.location=\'/admin.html\'" style="color:var(--gold2)">⚙ Painel Admin</button>':''}
      <button onclick="ervaria.logout()" class="logout">Sair da conta</button>
    `;
    document.body.appendChild(menu);
    setTimeout(() => {
      document.addEventListener('click', function close(e) {
        if (!menu.contains(e.target) && e.target.id !== 'ervaria-auth-btn') {
          menu.remove();
          document.removeEventListener('click', close);
        }
      });
    }, 50);
  },
  removeProfileMenu() {
    document.getElementById('profileMenu')?.remove();
  }
};

// ── HOOK: Override toggleFav to sync ──
const _origToggleFav = toggleFav;
toggleFav = function(e, id) {
  _origToggleFav(e, id);
  const isFav = favorites.includes(id);
  ervaria.pushFavorite(id, isFav);
};

// ── HOOK: Override savePerfil to sync ──
const _origSavePerfil = savePerfil;
savePerfil = function() {
  _origSavePerfil();
  ervaria.pushPerfil(perfilState);
};

// ── PROFILE COMPLETION ──
let selectedRole = '';
let selectedInterest = '';
let selectedReferral = '';

function selectRole(btn) {
  document.querySelectorAll('#pcRoles .pc-role').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selectedRole = btn.dataset.role;
  document.getElementById('pcOtherField').style.display = selectedRole === 'outro' ? 'block' : 'none';
}
function selectInterest(btn) {
  document.querySelectorAll('#pcInterests .pc-role').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selectedInterest = btn.dataset.interest;
}
function selectReferral(btn) {
  document.querySelectorAll('#pcReferral .pc-role').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selectedReferral = btn.dataset.ref;
}
function goStep2() {
  const name = document.getElementById('pcName').value.trim();
  const email = document.getElementById('pcEmail').value.trim();
  const geo = getGeoValues();
  const msg = document.getElementById('pcMsg1');
  if (!name) { msg.textContent = 'Preencha seu nome'; msg.style.color = '#e08080'; return; }
  if (!email) { msg.textContent = 'Preencha seu email'; msg.style.color = '#e08080'; return; }
  if (!geo.country) { msg.textContent = 'Selecione o país'; msg.style.color = '#e08080'; return; }
  if (!geo.state) { msg.textContent = 'Preencha o estado'; msg.style.color = '#e08080'; return; }
  if (!geo.city) { msg.textContent = 'Preencha a cidade'; msg.style.color = '#e08080'; return; }
  msg.textContent = '';
  document.getElementById('pcStep1').style.display = 'none';
  document.getElementById('pcStep2').style.display = 'block';
  document.querySelector('.profile-complete-overlay').scrollTop = 0;
}
function goStep1() {
  document.getElementById('pcStep2').style.display = 'none';
  document.getElementById('pcStep1').style.display = 'block';
  document.querySelector('.profile-complete-overlay').scrollTop = 0;
}
function skipProfile() {
  document.getElementById('profileCompleteOverlay').classList.remove('on');
  document.body.style.overflow = '';
  enterAppAfterAuth();
  toast('Você pode completar seu perfil depois. Acesso limitado à Busca.');
}

async function submitProfile() {
  const name = document.getElementById('pcName').value.trim();
  const email = document.getElementById('pcEmail').value.trim();
  const extraEmails = document.getElementById('pcExtraEmails').value.trim();
  const phone = document.getElementById('pcPhone').value.trim();
  const geo = getGeoValues();
  const otherRole = document.getElementById('pcOtherRole')?.value.trim();
  const newsletter = document.getElementById('pcNewsletter').checked;
  const lgpd = document.getElementById('pcLgpd').checked;
  const msg = document.getElementById('pcMsg');

  if (!name) { msg.textContent = 'Preencha seu nome'; msg.style.color = '#e08080'; return; }
  if (!email) { msg.textContent = 'Preencha seu email'; msg.style.color = '#e08080'; return; }
  if (!selectedRole) { msg.textContent = 'Selecione seu perfil'; msg.style.color = '#e08080'; return; }
  if (!geo.country) { msg.textContent = 'Selecione o país'; msg.style.color = '#e08080'; return; }
  if (!geo.state) { msg.textContent = 'Preencha o estado'; msg.style.color = '#e08080'; return; }
  if (!geo.city) { msg.textContent = 'Preencha a cidade'; msg.style.color = '#e08080'; return; }
  if (!lgpd) { msg.textContent = 'É necessário aceitar os termos da LGPD'; msg.style.color = '#e08080'; return; }

  msg.textContent = 'Salvando...'; msg.style.color = 'var(--gold)';
  document.getElementById('pcSubmit').disabled = true;

  try {
    const { error } = await ervaria.client
      .from('user_profiles')
      .update({
        display_name: name,
        email: email,
        extra_emails: extraEmails || null,
        phone: phone,
        city: geo.city,
        state: geo.state,
        country: geo.country,
        role: selectedRole,
        role_other: selectedRole === 'outro' ? otherRole : null,
        main_interest: selectedInterest || null,
        referral_source: selectedReferral || null,
        newsletter_optin: newsletter,
        lgpd_accepted: true,
        lgpd_accepted_at: new Date().toISOString(),
        profile_completed: true
      })
      .eq('id', ervaria.user.id);

    if (error) throw error;

    document.getElementById('profileCompleteOverlay').classList.remove('on');
    document.body.style.overflow = '';
    enterAppAfterAuth();
    localStorage.setItem('erb_entered', '1');
    ervaria.syncFromCloud();
    ervaria.updateAuthUI(true);
    toast('Bem-vindo ao Ervatório, ' + name + '!');
  } catch (e) {
    msg.textContent = 'Erro: ' + e.message; msg.style.color = '#e08080';
  }
  document.getElementById('pcSubmit').disabled = false;
}

// ── THEME TOGGLE ──
function toggleTheme(){
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('erb_theme', isLight ? 'light' : 'dark');
  document.getElementById('themeToggle').textContent = isLight ? '☽' : '☀';
}
// Restore saved theme (default: light)
(function(){
  const saved = localStorage.getItem('erb_theme');
  if(saved === 'dark'){
    // User explicitly chose dark
  } else {
    document.body.classList.add('light');
    document.getElementById('themeToggle').textContent = '☽';
  }
})();

// ── LANDING PAGE ──
function enterApp(){
  // Always show auth modal first — user must login/register
  ervaria.showAuthModal();
}
function enterAppAfterAuth(){
  document.getElementById('landingPage').style.display = 'none';
  document.getElementById('appContainer').style.display = 'block';
  localStorage.setItem('erb_entered', '1');
  localStorage.setItem('erb_auth', '1');
}
function backToLanding(){
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('landingPage').style.display = 'block';
}
// Skip landing if already logged in
(function(){
  if(localStorage.getItem('erb_entered')){
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
  }
})();

// ── PWA INSTALL ──
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if(btn) btn.style.display = 'inline-block';
});
function installPWA() {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(r => {
    if(r.outcome === 'accepted') toast('App instalado!');
    deferredPrompt = null;
    document.getElementById('installBtn').style.display = 'none';
  });
}
// Register service worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
}

// ── INIT SUPABASE ──
ervaria.init();
