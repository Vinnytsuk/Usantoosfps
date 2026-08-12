# USANTOOSFPS — Site final para teste

Versão final do site estático com:

- WhatsApp configurado com o número `+55 11 95142-2087`;
- Discord com o convite `https://discord.com/invite/e9F3AsGDqW`;
- formulário de setup antes do WhatsApp;
- passo a passo antes do Discord;
- feedbacks reais integrados ao site;
- imagens de feedback editadas com anonimização visual leve (borrado);
- chamada para o Instagram e redes sociais `@usantoosfps`.

## Arquivos principais

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `assets/feedbacks/`

## Como testar

Se quiser rodar localmente:

```bash
python -m http.server 8080
```

Depois abra:

```text
http://localhost:8080
```

## Observação sobre feedbacks

Os prints incluídos nesta versão foram preparados com borrado em áreas sensíveis
para reduzir exposição direta de nome/foto. Mesmo assim, se quiser, depois dá
para trocar qualquer imagem em `assets/feedbacks/` e atualizar o caminho no
`config.js`.

## Redes sociais

O site já indica:

- Instagram: `@usantoosfps`
- TikTok: `@usantoosfps`
- YouTube: `@usantoosfps`

E possui mensagem informando que mais feedbacks e stories estão nos destaques do Instagram.


## Ajustes V2
- fontes maiores na etapa de contato
- correções de sobreposição nos cards de feedback
- imagens sem blur; Instagram com tarja discreta para direcionar aos destaques
- novos feedbacks de WhatsApp adicionados

## Ajustes V3
- tarja do Instagram reposicionada exatamente sobre a área de nome/foto do story repostado
- remoção da notificação no print mobile do Discord

## Ajustes V4
- modal de contato com contraste mais forte e fontes maiores
- tarjas internas do Instagram posicionadas sobre nome+foto dos stories repostados

## Ajustes V5
- fotos do Instagram refeitas a partir dos originais
- removida a tarja do topo do story
- posicionamento manual individual do @usantoosfps sobre o nome/foto da conta repostada em cada feedback do Instagram

## Ajuste V6 — Instagram

Os feedbacks do Instagram foram refeitos individualmente a partir das imagens
originais. A tarja `@usantoosfps` agora é aplicada manualmente sobre a área de
foto + nome da conta que aparece dentro do Story/repost.

A barra superior do Story não recebe nenhuma tarja.

O arquivo `CONFERENCIA_INSTAGRAM.jpg` foi incluído para facilitar a conferência
visual antes da publicação.


## V8 — Galeria de feedbacks sob demanda

A página principal não exibe mais os prints durante a rolagem.

Agora:
- a home mostra apenas um bloco compacto de prova social;
- `VER FEEDBACKS SELECIONADOS` abre uma galeria em tela própria;
- a galeria mantém Destaques, Instagram, Discord e WhatsApp;
- o site informa claramente que os cards exibidos são apenas uma seleção;
- há chamadas para os mais de 3.000 feedbacks no Discord;
- o texto informa que o acervo do Discord inclui prints, vídeos e áudios enviados após os serviços;
- o Instagram `@usantoosfps` continua indicado para Stories e destaques.
