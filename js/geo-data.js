// ── GEO DATA — Países, Estados e Cidades ──
const GEO = {
  countries: [
    'Brasil','Portugal','Estados Unidos','Argentina','Uruguai','Paraguai',
    'Chile','Colômbia','México','Espanha','Itália','França','Alemanha',
    'Reino Unido','Japão','China','Índia','Canadá','Austrália','Outro'
  ],
  states: {
    'Brasil': [
      {uf:'AC',name:'Acre'},{uf:'AL',name:'Alagoas'},{uf:'AP',name:'Amapá'},
      {uf:'AM',name:'Amazonas'},{uf:'BA',name:'Bahia'},{uf:'CE',name:'Ceará'},
      {uf:'DF',name:'Distrito Federal'},{uf:'ES',name:'Espírito Santo'},
      {uf:'GO',name:'Goiás'},{uf:'MA',name:'Maranhão'},{uf:'MT',name:'Mato Grosso'},
      {uf:'MS',name:'Mato Grosso do Sul'},{uf:'MG',name:'Minas Gerais'},
      {uf:'PA',name:'Pará'},{uf:'PB',name:'Paraíba'},{uf:'PR',name:'Paraná'},
      {uf:'PE',name:'Pernambuco'},{uf:'PI',name:'Piauí'},{uf:'RJ',name:'Rio de Janeiro'},
      {uf:'RN',name:'Rio Grande do Norte'},{uf:'RS',name:'Rio Grande do Sul'},
      {uf:'RO',name:'Rondônia'},{uf:'RR',name:'Roraima'},{uf:'SC',name:'Santa Catarina'},
      {uf:'SP',name:'São Paulo'},{uf:'SE',name:'Sergipe'},{uf:'TO',name:'Tocantins'}
    ],
    'Portugal': [
      {uf:'PT-01',name:'Aveiro'},{uf:'PT-02',name:'Beja'},{uf:'PT-03',name:'Braga'},
      {uf:'PT-04',name:'Bragança'},{uf:'PT-05',name:'Castelo Branco'},
      {uf:'PT-06',name:'Coimbra'},{uf:'PT-07',name:'Évora'},{uf:'PT-08',name:'Faro'},
      {uf:'PT-09',name:'Guarda'},{uf:'PT-10',name:'Leiria'},{uf:'PT-11',name:'Lisboa'},
      {uf:'PT-12',name:'Portalegre'},{uf:'PT-13',name:'Porto'},{uf:'PT-14',name:'Santarém'},
      {uf:'PT-15',name:'Setúbal'},{uf:'PT-16',name:'Viana do Castelo'},
      {uf:'PT-17',name:'Vila Real'},{uf:'PT-18',name:'Viseu'},
      {uf:'PT-20',name:'Açores'},{uf:'PT-30',name:'Madeira'}
    ],
    'Argentina': [
      {uf:'AR-BA',name:'Buenos Aires'},{uf:'AR-CT',name:'Catamarca'},{uf:'AR-CC',name:'Chaco'},
      {uf:'AR-CB',name:'Córdoba'},{uf:'AR-CR',name:'Corrientes'},{uf:'AR-ER',name:'Entre Ríos'},
      {uf:'AR-MZ',name:'Mendoza'},{uf:'AR-MN',name:'Misiones'},{uf:'AR-SF',name:'Santa Fe'},
      {uf:'AR-TM',name:'Tucumán'},{uf:'AR-CF',name:'Ciudad de Buenos Aires'}
    ]
  },
  cities: {
    // ── BRASIL ──
    'AC':['Rio Branco','Cruzeiro do Sul','Sena Madureira','Tarauacá'],
    'AL':['Maceió','Arapiraca','Rio Largo','Palmeira dos Índios','Penedo'],
    'AP':['Macapá','Santana','Laranjal do Jari','Oiapoque'],
    'AM':['Manaus','Parintins','Itacoatiara','Manacapuru','Coari'],
    'BA':['Salvador','Feira de Santana','Vitória da Conquista','Camaçari','Ilhéus','Itabuna','Lauro de Freitas','Juazeiro','Barreiras'],
    'CE':['Fortaleza','Caucaia','Juazeiro do Norte','Maracanaú','Sobral','Crato'],
    'DF':['Brasília','Ceilândia','Taguatinga','Samambaia','Plano Piloto'],
    'ES':['Vitória','Vila Velha','Serra','Cariacica','Cachoeiro de Itapemirim','Linhares'],
    'GO':['Goiânia','Aparecida de Goiânia','Anápolis','Rio Verde','Luziânia','Águas Lindas de Goiás'],
    'MA':['São Luís','Imperatriz','Timon','Caxias','Codó','Paço do Lumiar'],
    'MT':['Cuiabá','Várzea Grande','Rondonópolis','Sinop','Tangará da Serra','Cáceres'],
    'MS':['Campo Grande','Dourados','Três Lagoas','Corumbá','Ponta Porã'],
    'MG':['Belo Horizonte','Uberlândia','Contagem','Juiz de Fora','Betim','Montes Claros','Ribeirão das Neves','Uberaba','Governador Valadares','Ipatinga','Poços de Caldas','Divinópolis','Sete Lagoas','Santa Luzia','Viçosa'],
    'PA':['Belém','Ananindeua','Santarém','Marabá','Castanhal','Parauapebas'],
    'PB':['João Pessoa','Campina Grande','Santa Rita','Patos','Bayeux'],
    'PR':['Curitiba','Londrina','Maringá','Ponta Grossa','Cascavel','São José dos Pinhais','Foz do Iguaçu','Colombo','Guarapuava'],
    'PE':['Recife','Jaboatão dos Guararapes','Olinda','Caruaru','Petrolina','Paulista','Cabo de Santo Agostinho'],
    'PI':['Teresina','Parnaíba','Picos','Piripiri','Floriano'],
    'RJ':['Rio de Janeiro','São Gonçalo','Duque de Caxias','Nova Iguaçu','Niterói','Belford Roxo','São João de Meriti','Campos dos Goytacazes','Petrópolis','Volta Redonda','Nova Friburgo','Teresópolis'],
    'RN':['Natal','Mossoró','Parnamirim','São Gonçalo do Amarante','Macaíba'],
    'RS':['Porto Alegre','Caxias do Sul','Pelotas','Canoas','Santa Maria','Gravataí','Viamão','Novo Hamburgo','São Leopoldo','Rio Grande','Passo Fundo','Bento Gonçalves'],
    'RO':['Porto Velho','Ji-Paraná','Ariquemes','Vilhena','Cacoal'],
    'RR':['Boa Vista','Rorainópolis','Caracaraí','Pacaraima'],
    'SC':['Florianópolis','Joinville','Blumenau','São José','Chapecó','Criciúma','Itajaí','Jaraguá do Sul','Lages','Balneário Camboriú'],
    'SP':['São Paulo','Guarulhos','Campinas','São Bernardo do Campo','Santo André','Osasco','São José dos Campos','Sorocaba','Ribeirão Preto','Santos','São José do Rio Preto','Piracicaba','Mauá','Bauru','Jundiaí','Franca','Registro','Taubaté','Limeira','Marília','Presidente Prudente','Araraquara'],
    'SE':['Aracaju','Nossa Senhora do Socorro','Lagarto','Itabaiana'],
    'TO':['Palmas','Araguaína','Gurupi','Porto Nacional'],
    // ── PORTUGAL ──
    'PT-11':['Lisboa','Sintra','Cascais','Loures','Amadora','Oeiras','Almada'],
    'PT-13':['Porto','Vila Nova de Gaia','Matosinhos','Maia','Gondomar'],
    'PT-03':['Braga','Guimarães','Barcelos','Vila Nova de Famalicão'],
    'PT-06':['Coimbra','Figueira da Foz','Leiria'],
    'PT-08':['Faro','Portimão','Loulé','Albufeira','Lagos','Tavira'],
    'PT-15':['Setúbal','Barreiro','Almada','Seixal','Montijo'],
    'PT-01':['Aveiro','Ílhavo','Águeda','Ovar'],
    'PT-10':['Leiria','Marinha Grande','Pombal','Caldas da Rainha'],
    // ── ARGENTINA ──
    'AR-CF':['Buenos Aires'],
    'AR-BA':['La Plata','Mar del Plata','Bahía Blanca','Quilmes','Lanús'],
    'AR-CB':['Córdoba','Villa María','Río Cuarto','San Francisco'],
    'AR-SF':['Rosario','Santa Fe','Rafaela','Venado Tuerto'],
    'AR-MZ':['Mendoza','San Rafael','Godoy Cruz','San Martín']
  }
};

function populateCountries(){
  const sel=document.getElementById('pcCountry');
  sel.innerHTML='<option value="">Selecione o país</option>'+
    GEO.countries.map(c=>`<option value="${c}">${c}</option>`).join('');
}

function onCountryChange(){
  const country=document.getElementById('pcCountry').value;
  const stateSel=document.getElementById('pcState');
  const citySel=document.getElementById('pcCity');
  const stateText=document.getElementById('pcStateText');
  const cityText=document.getElementById('pcCityText');

  citySel.innerHTML='<option value="">Selecione a cidade</option>';

  const states=GEO.states[country];
  if(states){
    stateSel.style.display='';
    stateText.style.display='none';
    stateSel.innerHTML='<option value="">Selecione o estado</option>'+
      states.map(s=>`<option value="${s.uf}">${s.name}</option>`).join('');
    citySel.style.display='';
    cityText.style.display='none';
  } else {
    // Free text for countries without data
    stateSel.style.display='none';
    stateText.style.display='';
    stateText.value='';
    citySel.style.display='none';
    cityText.style.display='';
    cityText.value='';
  }
}

function onStateChange(){
  const uf=document.getElementById('pcState').value;
  const citySel=document.getElementById('pcCity');
  const cityText=document.getElementById('pcCityText');

  const cities=GEO.cities[uf];
  if(cities){
    citySel.style.display='';
    cityText.style.display='none';
    citySel.innerHTML='<option value="">Selecione a cidade</option>'+
      cities.map(c=>`<option value="${c}">${c}</option>`).join('')+
      '<option value="__other">Outra cidade...</option>';
  } else {
    citySel.style.display='none';
    cityText.style.display='';
    cityText.value='';
  }
}

function onCityChange(){
  const val=document.getElementById('pcCity').value;
  const cityText=document.getElementById('pcCityText');
  if(val==='__other'){
    cityText.style.display='';
    cityText.value='';
    cityText.focus();
  } else {
    cityText.style.display='none';
  }
}

function getGeoValues(){
  const country=document.getElementById('pcCountry').value;
  const states=GEO.states[country];
  let state, city;
  if(states){
    const stateSel=document.getElementById('pcState');
    const st=states.find(s=>s.uf===stateSel.value);
    state=st?st.name:stateSel.value;
    const cityVal=document.getElementById('pcCity').value;
    city=cityVal==='__other'?document.getElementById('pcCityText').value:cityVal;
  } else {
    state=document.getElementById('pcStateText').value;
    city=document.getElementById('pcCityText').value;
  }
  return {country,state,city};
}
