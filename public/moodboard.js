// ===== Selecionar elementos =====
const botoesHumor = document.querySelectorAll(".humor-btn");
const nota = document.querySelector("#nota");
const botaoGuardar = document.querySelector("#guardar");
const historico = document.querySelector("#historico");
const estatisticas = document.querySelector("#estatisticas");

let humorSelecionado = null;

// ===== Emojis por humor =====
const emojis = {
  feliz: "😄",
  bem: "🙂",
  neutro: "😐",
  triste: "😔",
  mal: "😢",
};

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
    carregarEstatisticas();
  } catch (erro) {
    alert("Não foi possível guardar o registo.");
  }
});

// ===== Carregar histórico =====
async function carregarHistorico() {
  const resposta = await fetch("/registos");
  const registos = await resposta.json();

  historico.innerHTML = "";

  if (registos.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Ainda não há registos. Guarda o teu primeiro!";
    historico.appendChild(vazio);
    return;
  }

  registos.forEach(function (registo) {
    const div = document.createElement("div");
    div.className = "registo";

    // Emoji
    const spanEmoji = document.createElement("span");
    spanEmoji.className = "emoji";
    spanEmoji.textContent = emojis[registo.humor] || "❓";

    // Info (data + nota) — usa textContent para evitar XSS
    const divInfo = document.createElement("div");
    divInfo.className = "info";

    const divData = document.createElement("div");
    divData.className = "data";
    divData.textContent = registo.data;

    const divTexto = document.createElement("div");
    divTexto.className = "texto";
    divTexto.textContent = registo.nota || "";

    divInfo.appendChild(divData);
    divInfo.appendChild(divTexto);

    // Botão apagar
    const botaoApagar = document.createElement("button");
    botaoApagar.className = "apagar";
    botaoApagar.dataset.id = registo.id;
    botaoApagar.textContent = "✕";

    div.appendChild(spanEmoji);
    div.appendChild(divInfo);
    div.appendChild(botaoApagar);

    historico.appendChild(div);
  });
}

// ===== Carregar estatísticas =====
async function carregarEstatisticas() {
  const resposta = await fetch("/estatisticas");
  const dados = await resposta.json();

  if (dados.total === 0) {
    estatisticas.textContent = "";
    return;
  }

  const emoji = dados.humorMaisFrequente
    ? emojis[dados.humorMaisFrequente]
    : "";

  const plural = dados.total === 1 ? "registo" : "registos";
  estatisticas.textContent = `${dados.total} ${plural} · humor mais frequente: ${emoji}`;
}

// ===== Apagar registo (delegação de eventos) =====
historico.addEventListener("click", async function (evento) {
  if (evento.target.classList.contains("apagar")) {
    const id = evento.target.dataset.id;
    await fetch(`/registos/${id}`, { method: "DELETE" });
    carregarHistorico();
    carregarEstatisticas();
  }
});

// ===== Ao abrir a página =====
carregarHistorico();
carregarEstatisticas();

// ===== TEMA (com memória) =====
const botaoTema = document.querySelector("#toggle-tema");
const body = document.body;

const temaGuardado = localStorage.getItem("tema");

if (temaGuardado === "claro") {
  body.classList.remove("dark");
  botaoTema.textContent = "🌙";
} else {
  body.classList.add("dark");
  botaoTema.textContent = "☀️";
}

botaoTema.addEventListener("click", function () {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    botaoTema.textContent = "☀️";
    localStorage.setItem("tema", "escuro");
  } else {
    botaoTema.textContent = "🌙";
    localStorage.setItem("tema", "claro");
  }
});