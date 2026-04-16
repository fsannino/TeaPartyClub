# Prompt para Claude / ChatGPT com geração de imagens

## Contexto

Você vai gerar **13 imagens fotográficas** para o projeto **Ervatório** — um app PWA de chás e ervas medicinais. As imagens serão usadas como fotos de produto nos cards e como hero images na landing page.

## Estilo visual obrigatório (TODAS as imagens)

- **Fotografia editorial de produto**, fundo neutro (linho cru / mármore branco / superfície clara)
- **Iluminação**: luz natural difusa, suave, sem sombras duras — estilo "morning light"
- **Paleta**: tons terrosos, verdes naturais, cremes — nenhum fundo colorido artificial
- **Recipiente padrão**: tigela cerâmica artesanal (bege/creme com base marrom) — manter consistência visual entre todas as fotos de produto
- **Resolução**: 1024×1024px, formato PNG
- **Sem texto**, sem logos, sem marcas d'água

---

## IMAGENS DE PRODUTO (10 fotos)

Gere cada imagem separadamente. Salve com o nome exato indicado.

### 1. `camomila.png`
Tigela cerâmica artesanal cheia de **flores secas de camomila** (Matricaria chamomilla). Flores amarelas e brancas inteiras. Ao lado, um ramo fresco de camomila com flores abertas e algumas flores soltas espalhadas. Fundo de linho cru.

### 2. `hibisco.png`
Tigela cerâmica artesanal cheia de **flores secas de hibisco** (Hibiscus sabdariffa). Pétalas vermelho-escuro, intensas, secas. Algumas pétalas espalhadas ao redor da tigela. Fundo de mármore branco claro. Sem líquido.

### 3. `alecrim.png`
Tigela cerâmica artesanal cheia de **alecrim seco desidratado** (Rosmarinus officinalis). Ao lado, um ramo fresco de alecrim verde com agulhas. Fundo neutro claro. Contraste entre seco (na tigela) e fresco (ao lado).

### 4. `hortela-fresca.png`
**Macro de folhas frescas de hortelã** (Mentha piperita) — NÃO na tigela. Folhas verde-escuro vibrantes com textura de nervuras visível e gotas de água. Fundo claro (mármore branco). Foco central, profundidade de campo rasa.

### 5. `hortela-seca.png`
Tigela cerâmica artesanal cheia de **folhas secas de hortelã** desidratadas, verde-escuro. Ao lado, uma colher de madeira com erva seca e um ramo fresco de hortelã. Fundo linho cru.

### 6. `erva-doce.png`
Tigela cerâmica artesanal cheia de **sementes de erva-doce** (Pimpinella anisum) — sementes pequenas, verde-amareladas. Duas colheres de madeira ao lado. Sementes espalhadas sobre a superfície. Fundo linho cru.

### 7. `lavanda.png`
Tigela cerâmica artesanal cheia de **botões secos de lavanda** (Lavandula angustifolia) — roxo/lilás. Ao lado, um ramo fresco de lavanda com flores. Botões espalhados ao redor. Fundo linho cru.

### 8. `capim-limao.png`
Tigela cerâmica artesanal cheia de **capim-limão seco desidratado** misturado com ervas. Ao lado, hastes frescas de capim-limão (verde-amarelado) e um ramo de alecrim fresco. Fundo linho cru.

### 9. `funcho.png`
Tigela cerâmica artesanal cheia de **sementes de funcho** (Foeniculum vulgare) — sementes verde-claras, ligeiramente maiores que erva-doce. Ao lado, um ramo fresco de funcho com folhas finas. Fundo linho cru.

### 10. `matcha.png`
Tigela **preta fosca** (chawan) com montículo de **pó de matcha** verde vibrante. Ao lado, um **chasen** (batedor de bamboo tradicional). Pó de matcha levemente espalhado na superfície. Fundo mármore claro. Estilo minimalista japonês.

---

## IMAGENS HERO (3 fotos)

Fotos maiores, atmosféricas, para uso como banner/hero na landing page.

### 11. `hero-bule.png`
**Bule cerâmico artesanal** (bege com detalhes marrons) servindo chá dourado em uma xícara cerâmica com pires. Vapor visível subindo. Ao redor: flores secas de camomila espalhadas e um ramo de alecrim. Luz natural lateral quente, fundo desfocado com plantas verdes. Sensação acolhedora, editorial. Formato paisagem (mais largo que alto).

### 12. `hero-maos.png`
**Duas mãos femininas** segurando uma caneca cerâmica artesanal (bege) cheia de chá de ervas — flores de camomila flutuando na superfície. Vapor sutil. Pessoa usando suéter bege/creme (apenas as mãos e antebraço visíveis). Mesa com linho, ramo de alecrim e flores secas ao lado. Sensação hygge/aconchego. Close-up.

### 13. `ervas-colecao.png`
**Flatlay (vista de cima)** com 5 tigelas cerâmicas artesanais dispostas em padrão orgânico sobre linho cru. Conteúdo das tigelas:
- Tigela 1: flores de camomila (amarelo/branco)
- Tigela 2: pétalas de hibisco (vermelho escuro)
- Tigela 3: folhas de chá verde com flores de jasmim (verde)
- Tigela 4: blend misto (rosa/dourado)
- Tigela 5: chai/especiarias escuras (marrom escuro)

Ao redor: paus de canela amarrados, estrelas de anis, botões de rosa secos, ramo de alecrim, colher vintage de metal. Estilo editorial premium.

---

## Após gerar todas as imagens

Organize na seguinte estrutura de pastas e faça commit no repositório `fsannino/TeaPartyClub` na branch `claude/project-status-update-bw2jX`:

```
images/
├── hero/
│   ├── hero-bule.png
│   ├── hero-maos.png
│   └── ervas-colecao.png
└── produtos/
    ├── camomila.png
    ├── hibisco.png
    ├── alecrim.png
    ├── hortela-fresca.png
    ├── hortela-seca.png
    ├── erva-doce.png
    ├── lavanda.png
    ├── capim-limao.png
    ├── funcho.png
    └── matcha.png
```

**Comandos após salvar os arquivos:**
```bash
cd TeaPartyClub
git checkout claude/project-status-update-bw2jX
git pull origin claude/project-status-update-bw2jX

# Remover os .gitkeep agora que temos arquivos reais
rm -f images/hero/.gitkeep images/produtos/.gitkeep

git add images/
git commit -m "Adiciona 13 fotos de produto e hero — estilo editorial cerâmica artesanal"
git push origin claude/project-status-update-bw2jX
```

**Importante:**
- Os nomes dos arquivos devem ser **exatamente** os listados acima (minúsculo, com hífen)
- O código do app já referencia esses caminhos — quando as imagens estiverem no lugar, tudo funciona automaticamente
- O Service Worker (sw.js) já tem precache configurado para esses arquivos
