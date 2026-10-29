# XQRENS · Refatoração de projetos (2026)

> Revisão do código legado, com foco em semântica, legibilidade, responsividade e manutenção.
> Os projetos originais permanecem no histórico de commits do Git.

## Estrutura

```text
projetos/
├── index.html                  # Home do portfólio; único easter egg de Punpun
├── shared/
│   └── project-base.css        # Design system dos exercícios estáticos
├── projeto_erro/               # ... 19 páginas HTML/CSS ...
├── ...
├── labs/
│   ├── shared.css              # Interface dos cinco projetos JavaScript
│   └── shared.js               # Aplicações independentes e funções utilitárias
├── lab-paletas/
├── lab-foco/
├── lab-quiz/
├── lab-memoria/
└── lab-notas/
```

## Projetos HTML/CSS (19)

| Projeto | Foco preservado | Refatoração |
| --- | --- | --- |
| 9 Erros Among Us | Comparação das imagens | Layout fluido, marcações em coordenadas proporcionais |
| Meme Cup | Álbum de nove imagens | `figure`, `figcaption`, galeria responsiva |
| Botões CSS | Variações de interface | 10 estados visuais e componentes de demonstração |
| Currículo | Apresentação de formação | HTML semântico, perfil e conteúdo estruturado |
| Diário de Ranqueada | Cinco registros | Linha do tempo e hierarquia de leitura |
| Festival de Criadoras | Evento e horários | Tabela acessível e foto contextualizada |
| Background Image | Cinco modos de fundo | Demonstrações corrigidas e responsivas |
| Margin e Padding | Modelo de caixas | Comparação visual com espaçamentos reais |
| Meu Site | Página pessoal | Estrutura única e conteúdo atualizado |
| Passatempo | Vitrine de tênis | Composição em Grid e imagem de produto |
| Perfil | Índice de projetos | Links relativos corrigidos e navegação real |
| Planejador | Inventário gamer | Listas, glossário `dl` e seções organizadas |
| Receita | Bolo de chocolate | Ingredientes, etapas e dados rápidos |
| Seletor | Cartões CSS | Reutilização de componentes sem JavaScript |
| Semáforo | Sinalização visual | Cor + texto, Grid adaptativo |
| Vídeo | Conteúdo incorporado | Player 16:9, título e descrição autoral |
| Cartão de visita | Identidade digital | Apresentação responsiva |
| Prova | Catálogo gamer | Nove cartões, valores identificados como demonstração |
| Revisão da Prova | Landing page temática | Seções, galeria de marcas e grid responsivo |

Os antigos CSS que não eram mais usados foram retirados do projeto. A identidade visual
agora parte de variáveis CSS no arquivo `shared/project-base.css`, com temas e componentes
específicos quando apropriado. As páginas HTML/CSS **não ganharam lógica JavaScript**.

## Projetos JavaScript (5)

- **Paleta Lab:** validação das cores salvas, trava/destrava e cópia com fallback.
- **Focus Room:** relógio baseado em horário real, pausa, reinício e atualização ao voltar à aba.
- **Quiz do Dev:** fluxo explícito de perguntas, feedback e reinício.
- **Memory.exe:** controle de pares, travamento temporário, reinício e acessibilidade nas cartas.
- **Notas no navegador:** armazenamento local protegido, conteúdo limitado, exclusão e mensagens quando salvar falha.

O código das cinco aplicações foi organizado em funções independentes dentro de
`labs/shared.js`. O CSS compartilhado inclui variantes por aplicação e suporte a
`prefers-reduced-motion`.

## Projeto de destaque: Mente em Flor

Mantido com identidade visual própria. Foi reforçado o comportamento da tela de
introdução em navegadores que restringem `sessionStorage`, sem remover funcionalidades.

## Regra de Punpun

O botão e a reflexão **ficam somente em `projetos/index.html`**, no rodapé da home.
Não há easter eggs de Punpun nos projetos individuais.

## Executar localmente

O site é estático. Abra a pasta do repositório num servidor local de desenvolvimento
(por exemplo, Live Server no VS Code) e acesse `/projetos/`. Cada exercício também
pode ser aberto por `/projetos/<nome-da-pasta>/`.

## Checklist de validação

- [x] 24 páginas de projetos atualizadas
- [x] Preservação dos caminhos dos projetos no catálogo
- [x] Um `h1`, `main` e `footer` em cada página (verificação estática)
- [x] Easter egg apenas na home (verificação estática nos 24 projetos)
- [x] JavaScript de todos os cinco laboratórios revisado e verificado sintaticamente
- [x] Imagens principais e fundos amostrados nos caminhos originais
- [ ] Teste visual em navegador nos tamanhos mobile/tablet/desktop
- [ ] Testes manuais de fluxo completo dos cinco laboratórios
- [ ] Auditoria Lighthouse/axe e revisão do deploy da Vercel

**Observação:** a verificação estática não equivale a uma validação visual ou funcional
num navegador real. Os itens pendentes não foram apresentados como concluídos.
