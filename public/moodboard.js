// ===== Selecionar elementos =====
const botoesHumor = document.querySelectorAll(".humor-btn");
const nota = document.querySelector("#nota");
const botaoGuardar = document.querySelector("#guardar");
const historico = document.querySelector("#historico");

let humorSelecionado = null;
// ===== Escolher um humor =====
botoesHumor.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesHumor.forEach((b) => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
    humorSelecionado = botao.dataset.humor;
  });
});
// ===== Guardar registo =====
botaoGuardar.addEventListener("click", async function () {
  if (!humorSelecionado) {
    alert("Escolhe primeiro um humor!");
    return;
  }

  const hoje = new Date().toISOString().split("T")[0];

  const novoRegisto = {
    data: hoje,
    humor: humorSelecionado,
    nota: nota.value.trim(),
  };

  try {
    const resposta = await fetch("/registos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoRegisto),
    });

    if (!resposta.ok) throw new Error("Erro ao guardar");

    nota.value = "";
    humorSelecionado = null;
    botoesHumor.forEach((b) => b.classList.remove("selecionado"));

    carregarHistorico();
  } catch (erro) {
    alert("Não foi possível guardar o registo.");
  }
});
// ===== Emojis por humor =====
const emojis = {
  feliz: "😄",
  bem: "🙂",
  neutro: "😐",
  triste: "😔",
  mal: "😢",
};

// ===== Carregar histórico =====
async function carregarHistorico() {
  const resposta = await fetch("/registos");
  const registos = await resposta.json();

  historico.innerHTML = "";

  registos.forEach(function (registo) {
    const div = document.createElement("div");
    div.className = "registo";
    div.innerHTML = `
      <span class="emoji">${emojis[registo.humor]}</span>
      <div class="info">
        <div class="data">${registo.data}</div>
        <div class="texto">${registo.nota || ""}</div>
      </div>
      <button class="apagar" data-id="${registo.id}">✕</button>
    `;
    historico.appendChild(div);
  });
}

// ===== Apagar registo (delegação de eventos) =====
historico.addEventListener("click", async function (evento) {
  if (evento.target.classList.contains("apagar")) {
    const id = evento.target.dataset.id;
    await fetch(`/registos/${id}`, { method: "DELETE" });
    carregarHistorico();
  }
});

// ===== Ao abrir a página =====
carregarHistorico();
// ===== Dark Mode =====
const botaoTema = document.querySelector("#toggle-tema");
const body = document.body;

botaoTema.addEventListener("click", function () {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    botaoTema.textContent = "☀️";
  } else {
    botaoTema.textContent = "🌙";
  }
});
