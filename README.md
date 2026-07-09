# MoodBoard — Diário de Humor

Aplicação fullstack para registar o humor de cada dia, com uma nota opcional, e consultar o histórico ao longo do tempo. Primeiro projeto fullstack, com backend próprio e base de dados persistente.

## Funcionalidades

- Registar o humor do dia (5 estados, representados por emojis)
- Adicionar uma nota opcional a cada registo
- Consultar o histórico de registos, ordenado do mais recente para o mais antigo
- Apagar registos
- Os dados ficam guardados numa base de dados (persistem entre reinícios do servidor)
- Modo escuro / claro com botão de alternância

## Tecnologias

- **Frontend:** HTML5, CSS3 (variáveis CSS), JavaScript (fetch, async/await)
- **Backend:** Node.js, Express
- **Base de dados:** SQLite (via better-sqlite3)

## Arquitetura

O mesmo servidor Express serve o frontend (pasta `public`) e expõe uma API REST que comunica com a base de dados SQLite. O frontend fala com essa API através de pedidos `fetch`.

## Endpoints da API

| Método   | Rota            | Descrição                                            |
| -------- | --------------- | ---------------------------------------------------- |
| `GET`    | `/registos`     | Devolve todos os registos (mais recentes primeiro)   |
| `POST`   | `/registos`     | Cria um novo registo (body: `{ data, humor, nota }`) |
| `DELETE` | `/registos/:id` | Apaga o registo com esse id                          |

## Estrutura da base de dados

Tabela `registos`:

| Coluna  | Tipo    | Descrição                              |
| ------- | ------- | -------------------------------------- |
| `id`    | INTEGER | Identificador único (auto-incremento)  |
| `data`  | TEXT    | Data do registo (formato `AAAA-MM-DD`) |
| `humor` | TEXT    | Humor escolhido                        |
| `nota`  | TEXT    | Nota opcional                          |

## Conceitos praticados

- Persistência de dados com SQLite e _prepared statements_ (proteção contra SQL injection)
- Comunicação entre frontend e um backend próprio via `fetch`
- Servir ficheiros estáticos com Express (`express.static`)
- Manipulação de datas em JavaScript
- Delegação de eventos e renderização dinâmica do DOM

## Como correr

```bash
npm install
node server.js
```

Depois abre `http://localhost:3000` no browser.

## Nota

Este projeto tem backend e base de dados, por isso não pode ser publicado no GitHub Pages (que serve apenas ficheiros estáticos). Para o publicar online seria necessário um serviço que corra Node.js, como o Render ou o Railway.

## Próximos passos

- [ ] Histórico visual em formato de calendário, colorido por humor
- [ ] Estatísticas (humor mais frequente, dias seguidos registados)
- [ ] Impedir mais do que um registo por dia (ou permitir editar o do próprio dia)
- [ ] Publicar online
