<div align="center">

<img src="./assets/portfolio-banner.svg" width="100%" alt="Luiz Eduardo. Desenvolvimento web, projetos de estudo e referências pessoais.">

# Luiz Eduardo · Portfólio

**Cursando Aprendizagem Industrial de Assistente Administrativo • Jovem aprendiz nos Correios • Projetos pessoais de HTML, CSS e JavaScript**

Uma vitrine da minha evolução em projetos de programação. Meu curso atual é Aprendizagem Industrial de Assistente Administrativo (em andamento), e não concluí Desenvolvimento de Sistemas.

[![Ver portfólio](https://img.shields.io/badge/VER_PORTFÓLIO-BEB7FF?style=for-the-badge&logo=vercel&logoColor=10111a)](https://portifolio-projetos-git-main-pedro-luiz.vercel.app/)
[![Mente em Flor](https://img.shields.io/badge/MENTE_EM_FLOR-92BDA6?style=for-the-badge&logoColor=0d1d17)](https://xqrens-portifolio.vercel.app/)
[![Exercícios](https://img.shields.io/badge/24_PROJETOS-202938?style=for-the-badge&logoColor=white)](./docs/PROJETOS.md)

![HTML5](https://img.shields.io/badge/HTML5-em%20estudo-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-em%20estudo-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-praticando-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-versionamento-F05032?style=flat-square&logo=git&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deploy-111111?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## ✦ Sobre este repositório

Meu nome é **Luiz Eduardo**. Atualmente curso **Aprendizagem Industrial de Assistente Administrativo (em andamento)** e trabalho como **jovem aprendiz nos Correios**. Continuei cultivando o interesse por desenvolvimento web e uso este repositório para compartilhar meus projetos pessoais e acompanhar minha evolução. **Não concluí o curso de Desenvolvimento de Sistemas.**

O portfólio principal é um site estático criado com **HTML, CSS e JavaScript**, com interface escura, navegação direta e algumas imagens de anime que já faziam parte da minha coleção de referências.

A ideia é simples: mostrar **quem sou, meus projetos, o Mente em Flor e como entrar em contato comigo**, sem confundir projetos pessoais com experiência profissional como desenvolvedor.

### O que você encontra no site

| Seção | Conteúdo |
| --- | --- |
| **Sobre mim** | Minha apresentação, curso de Aprendizagem Industrial de Assistente Administrativo, trabalho nos Correios e projetos web pessoais |
| **Projetos** | **24 projetos:** 19 atividades de estudo e cinco miniapps interativos com JavaScript |
| **Atualmente** | Aprendizagem Industrial de Assistente Administrativo em andamento, jovem aprendiz nos Correios e atualizações públicas do GitHub |
| **Trajetória** | Da primeira página HTML à refatoração dos projetos |
| **Estudos de caso** | Mente em Flor, XQRENS Portfolio e Paleta Lab |
| **Antes e depois** | Comparação de trechos reais do código anterior e atual |
| **Área para oportunidades** | Resumo verdadeiro do meu perfil, currículo web e GitHub |
| **Referências visuais** | Seis imagens do meu arquivo pessoal: mangá, arte monocromática e memes |
| **Spotify** | Meu perfil público, três playlists com cards temáticos e players oficiais expansíveis |
| **Mente em Flor** | Apresentação e link para meu site educativo sobre saúde mental |
| **Contato** | GitHub, Instagram e canal para sugestões |

Os projetos têm **busca pelo nome, filtros HTML/CSS/Páginas/JavaScript e uma opção para expandir a lista completa**. Não é necessário instalar bibliotecas nem criar uma conta.

### Novidades do XQRENS Portfolio 2.0

- **24 prévias interativas:** cada projeto pode ser aberto num painel ao vivo; o iframe só é carregado ao clicar.
- **Estudos de caso:** páginas em `projetos/cases/` para explicar contexto, solução, implementação e aprendizados, sem métricas inventadas.
- **Antes e depois:** três comparações com trechos reais do histórico Git (commit antigo referenciado no site).
- **Linha do tempo:** etapas do aprendizado e situação atual no curso de Aprendizagem Industrial de Assistente Administrativo.
- **Painel Atualmente:** informações atuais e consulta aos últimos commits públicos do GitHub, com fallback.
- **Animações cinematográficas:** efeitos progressivos em CSS com respeito a movimento reduzido.
- **Área para oportunidades:** perfil real, currículo web e links de projetos, sem declarar conclusão de curso ou experiência profissional como desenvolvedor.
- **Easter egg de Punpun:** discreto e reservado apenas à home do portfólio.

Os módulos novos ficam em `projetos/portfolio-2026.css` e `projetos/portfolio-2026.js`, separados do player do Spotify e das demais interações já existentes.




## 🎧 Spotify e controle de animações

O portfólio inclui a seção **Minha frequência**, com acesso ao [meu perfil público do Spotify](https://open.spotify.com/user/31ydaudx7rf6gusyu7bned2tf65i) e três cards musicais interativos, um para cada playlist. O player é oficial do Spotify, aparece em um painel que se expande suavemente ao clicar em **Ouvir aqui** e não começa a tocar automaticamente. Fechar o painel encerra o player incorporado; apenas uma playlist pode ficar aberta por vez.

Para adicionar playlists reais, abra `projetos/portfolio-plus.js` e encontre `const PLAYLISTS = [ ... ];`. Adicione ou edite os dados das playlists públicas que quero recomendar, por exemplo:

```js
const PLAYLISTS = [
  {
    titulo: "Nome da playlist",
    descricao: "Uma descrição curta para quem vai escutar",
    url: "https://open.spotify.com/playlist/COLE_O_ID_REAL_AQUI"
  }
];
```

**Playlists reais adicionadas:** o portfólio já apresenta três playlists públicas compartilhadas pelo autor, usando seus URLs no `projetos/portfolio-plus.js`. As três recomendações estão identificadas como **Rock & Melancolia**, **Trabalho & Curso** e **Escola**. O exemplo de código acima é apenas um modelo para futuras alterações. Não é necessário token, login ou senha para incorporar uma playlist pública com o player do Spotify.

O botão flutuante **Efeitos ON/OFF** alterna as animações do próprio site e guarda minha escolha no navegador. O modo inicial respeita a preferência de movimento reduzido do dispositivo; ao mudar a opção, o site recarrega para reiniciar as animações. Os efeitos de entrada existentes, o disco de vinil animado e o brilho que segue o cursor usam CSS e JavaScript puro.

## ✳ Cinco miniapps JavaScript novos

Experimentos separados, feitos com **HTML, CSS e JavaScript puro**, sem bibliotecas, cadastros ou dependências de instalação.

| Projeto | O que faz | Testar |
| --- | --- | --- |
| **Paleta Lab** | Gera cinco cores, trava tons e copia códigos HEX | [Abrir](./projetos/lab-paletas/) |
| **Focus Room** | Timer de foco e pausas com controles funcionais | [Abrir](./projetos/lab-foco/) |
| **Quiz do Dev** | Perguntas sobre HTML, CSS e JS com respostas explicadas | [Abrir](./projetos/lab-quiz/) |
| **Memory.exe** | Jogo da memória de seis pares e contador de tentativas | [Abrir](./projetos/lab-memoria/) |
| **Notas no navegador** | Guarda até 30 notas usando localStorage | [Abrir](./projetos/lab-notas/) |

O site também ganhou uma **galeria com seis imagens enviadas por mim**, animações de entrada ao rolar, movimento sutil na capa, uma barra de progresso de leitura e efeitos nos cartões. Tudo respeita a opção do dispositivo de reduzir movimento.

## 🚀 Projetos em destaque

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>01 · Portfólio pessoal</h3>
      <p>Meu espaço na web. Interface responsiva, referências visuais de anime e cards para explorar os trabalhos do SENAI.</p>
      <p><b>HTML • CSS • JavaScript</b></p>
      <p><a href="https://portifolio-projetos-git-main-pedro-luiz.vercel.app/">Visitar site ↗</a> · <a href="./projetos/">Ver código ↗</a></p>
    </td>
    <td width="50%" valign="top">
      <h3>02 · Mente em Flor</h3>
      <p>Projeto educativo sobre saúde mental: conteúdo de acolhimento, pausas, reflexões e caminhos para buscar ajuda.</p>
      <p><b>HTML • CSS • JavaScript</b></p>
      <p><a href="https://xqrens-portifolio.vercel.app/">Visitar site ↗</a> · <a href="./mente-em-flor/">Ver código ↗</a></p>
    </td>
  </tr>
</table>

> **Importante:** o Mente em Flor é educativo. Não oferece diagnóstico nem substitui apoio profissional. O portfólio e o Mente em Flor são **dois projetos diferentes da Vercel**, embora o código esteja no mesmo repositório.

### Trabalhos do SENAI

São **19 exercícios** de várias fases dos meus estudos, incluindo currículo, álbum, semáforo, receita, páginas de perfil, seletores CSS e outros.

**[→ Acessar a lista completa dos 19 exercícios](./docs/PROJETOS.md)**

## 🧰 Tecnologias

| Ferramenta | Aplicação |
| --- | --- |
| **HTML5** | Estrutura de páginas, conteúdo semântico e links |
| **CSS3** | Layout, responsividade, tipografia e apresentação |
| **JavaScript** | Navegação em celular, busca e filtros dos projetos |
| **Git & GitHub** | Histórico de mudanças e organização do código |
| **Vercel** | Hospedagem dos dois sites |

Também estudo um pouco de **Python** e **banco de dados**, mas o foco deste repositório é a web.

## 🗂️ Estrutura do repositório

```text
Portifolio/
├── assets/
│   └── portfolio-banner.svg        # Banner do README
│
├── projetos/
│   ├── index.html                  # Site principal
│   ├── style.css                   # Estilos e responsividade
│   ├── script.js                   # Interações e filtros
│   ├── Img/                        # Fotos e referências visuais
│   ├── projeto_album/
│   ├── projeto_botao/
│   ├── projeto_curriculo/
│   └── ...                         # Demais exercícios e avaliações
│
├── mente-em-flor/
│   ├── index.html                  # Site de saúde mental
│   ├── style.css
│   ├── script.js
│   └── novidades.js
│
├── docs/
│   ├── PROJETOS.md                 # Catálogo com 19 trabalhos
│   └── DIVULGACAO.md               # Apresentações para compartilhar
│
├── CONTRIBUTING.md                 # Sugestões e bugs
└── README.md
```

## 💻 Rodar localmente

Você pode abrir os arquivos pelo **Live Server** do VS Code ou iniciar um servidor local usando Python 3:

```bash
git clone https://github.com/xqrens/Portifolio.git
cd Portifolio
python -m http.server 8000
```

Depois acesse:

- **Portfólio:** http://localhost:8000/projetos/
- **Mente em Flor:** http://localhost:8000/mente-em-flor/

Os dois projetos usam caminhos relativos, então execute o servidor a partir da raiz clonada.

## 🎨 Visual e referências

Escolhi uma estética escura e minimalista, inspirada em interfaces de editores de código e na atmosfera de obras como *Serial Experiments Lain* e *Neon Genesis Evangelion*. As imagens de anime utilizadas já estavam no diretório `projetos/Img/`. A nova galeria usa seis fotos fornecidas pelo autor e reunidas numa folha WebP compacta em `projetos/Img/xqrens-moods.webp`.

São **referências visuais de terceiros**, não artes criadas por mim nem material sob uma licença declarada neste repositório. Direitos das obras e imagens pertencem aos respectivos autores e titulares.

## 💬 Feedback

Se encontrar um erro de responsividade, um link quebrado ou tiver uma sugestão de melhoria, pode [abrir uma issue](https://github.com/xqrens/Portifolio/issues/new/choose). Há modelos para bugs e ideias de melhoria.

Consulte o [guia de contribuições](./CONTRIBUTING.md).

## 📫 Contatos

- **GitHub:** [@xqrens](https://github.com/xqrens)
- **Instagram:** [@lxqrens](https://www.instagram.com/lxqrens/)
- **Portfólio:** [portifolio-projetos-git-main-pedro-luiz.vercel.app](https://portifolio-projetos-git-main-pedro-luiz.vercel.app/)
- **Mente em Flor:** [xqrens-portifolio.vercel.app](https://xqrens-portifolio.vercel.app/)

---

<div align="center">

<sub>Feito por Luiz Eduardo · 2026</sub>

**Aprendendo, criando e melhorando um projeto de cada vez.**

</div>
