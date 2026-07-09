const express = require("express");
const db = require("./db");

const app = express();
const PORTA = 3000;

app.use(express.json());
app.use(express.static("public"));

// LER todos os registos (mais recentes primeiro)
app.get("/registos", function (pedido, resposta) {
  const registos = db
    .prepare("SELECT * FROM registos ORDER BY data DESC")
    .all();
  resposta.json(registos);
});

// CRIAR um novo registo
app.post("/registos", function (pedido, resposta) {
  const { data, humor, nota } = pedido.body;

  if (!data || !humor) {
    return resposta.status(400).json({ erro: "Data e humor são obrigatórios" });
  }

  const query = db.prepare(
    "INSERT INTO registos (data, humor, nota) VALUES (?, ?, ?)",
  );
  const resultado = query.run(data, humor, nota || "");

  const novoRegisto = db
    .prepare("SELECT * FROM registos WHERE id = ?")
    .get(resultado.lastInsertRowid);
  resposta.status(201).json(novoRegisto);
});

// APAGAR um registo
app.delete("/registos/:id", function (pedido, resposta) {
  const id = Number(pedido.params.id);
  db.prepare("DELETE FROM registos WHERE id = ?").run(id);
  resposta.status(204).send();
});

app.listen(PORTA, function () {
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
