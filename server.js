const express = require("express");
const db = require("./db");

const app = express();
const PORTA = 3000;

app.use(express.json());
app.use(express.static("public"));

// LER todos os registos (mais recentes primeiro)
app.get("/registos", function (pedido, resposta) {
  const registos = db
    .prepare("SELECT * FROM registos ORDER BY data DESC, id DESC")
    .all();
  resposta.json(registos);
});

// CRIAR ou ATUALIZAR o registo de um dia
app.post("/registos", function (pedido, resposta) {
  const { data, humor, nota } = pedido.body;

  if (!data || !humor) {
    return resposta.status(400).json({ erro: "Data e humor são obrigatórios" });
  }

  // Já existe registo para este dia?
  const existente = db
    .prepare("SELECT * FROM registos WHERE data = ?")
    .get(data);

  if (existente) {
    // Atualiza o registo do próprio dia em vez de criar outro
    db.prepare(
      "UPDATE registos SET humor = ?, nota = ? WHERE data = ?",
    ).run(humor, nota || "", data);

    const atualizado = db
      .prepare("SELECT * FROM registos WHERE data = ?")
      .get(data);
    return resposta.status(200).json(atualizado);
  }

  // Caso contrário, cria um novo
  const resultado = db
    .prepare("INSERT INTO registos (data, humor, nota) VALUES (?, ?, ?)")
    .run(data, humor, nota || "");

  const novoRegisto = db
    .prepare("SELECT * FROM registos WHERE id = ?")
    .get(resultado.lastInsertRowid);

  resposta.status(201).json(novoRegisto);
});

// ESTATÍSTICAS
app.get("/estatisticas", function (pedido, resposta) {
  const total = db.prepare("SELECT COUNT(*) AS n FROM registos").get().n;

  const maisFrequente = db
    .prepare(
      "SELECT humor, COUNT(*) AS n FROM registos GROUP BY humor ORDER BY n DESC LIMIT 1",
    )
    .get();

  resposta.json({
    total: total,
    humorMaisFrequente: maisFrequente ? maisFrequente.humor : null,
  });
});

// APAGAR um registo
app.delete("/registos/:id", function (pedido, resposta) {
  const id = Number(pedido.params.id);

  const resultado = db.prepare("DELETE FROM registos WHERE id = ?").run(id);

  if (resultado.changes === 0) {
    return resposta.status(404).json({ erro: "Registo não encontrado" });
  }

  resposta.status(204).send();
});

app.listen(PORTA, function () {
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});