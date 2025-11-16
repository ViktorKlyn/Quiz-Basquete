// 10 perguntas de basquete
const perguntas = [
  { enunciado: "Quantos pontos vale uma cesta de três?", opcoes: ["2", "3", "1"], correta: 1 },
  { enunciado: "Qual posição normalmente arremessa de longa distância?", opcoes: ["Armador", "Ala", "Pivô"], correta: 1 },
  { enunciado: "Quantos jogadores de cada time estão em quadra?", opcoes: ["5", "6", "4"], correta: 0 },
  { enunciado: "Qual é a altura da tabela de basquete?", opcoes: ["3,05 m", "2,95 m", "3,10 m"], correta: 0 },
  { enunciado: "O que é um 'alley-oop'?", opcoes: ["Passe que resulta em enterrada", "Drible rápido", "Defesa bloqueada"], correta: 0 },
  { enunciado: "Qual jogador é famoso como 'King James'?", opcoes: ["Stephen Curry", "LeBron James", "Michael Jordan"], correta: 1 },
  { enunciado: "O que é um 'pick and roll'?", opcoes: ["Estratégia ofensiva", "Falta técnica", "Arremesso de 3"], correta: 0 },
  { enunciado: "Qual país venceu mais Copas do Mundo de Basquete?", opcoes: ["Estados Unidos", "Brasil", "Espanha"], correta: 0 },
  { enunciado: "Como é chamada a substituição rápida de jogadores?", opcoes: ["Timeout", "Substituição", "Rotação"], correta: 2 },
  { enunciado: "O que é 'double-double'?", opcoes: ["10+ pontos e 10+ assistências ou rebotes", "2 cestas seguidas", "Erro de arremesso"], correta: 0 }
];

let indice = 0;
let pontuacao = 0;
let perguntasJogo = [];
let tempoPergunta = 2000;
let pontosPorAcerto = 1;
let timerId = null;
let bloqueado = false;

// DOM
const form = document.getElementById("formJogo");
const formSection = document.getElementById("formSection");
const gameSection = document.getElementById("gameSection");
const textoPergunta = document.getElementById("textoPergunta");
const pontuacaoSpan = document.getElementById("pontuacao");
const cestas = document.querySelectorAll(".cesta");
const bola = document.getElementById("bola");
const resetBtn = document.getElementById("resetBtn");
const placarConteudo = document.getElementById("placarConteudo");
const quadra = document.getElementById("quadra");

// centraliza bola
function resetarBola() {
  bola.style.left = "50%";
  bola.style.top = "50%";
  bola.style.transform = "translate(-50%, -50%)";
}

// embaralhar array
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// mensagem temporária no placar
function atualizarPlacarTemporario(mensagem, cor) {
  placarConteudo.textContent = mensagem;
  placarConteudo.style.color = cor;

  setTimeout(() => {
    placarConteudo.innerHTML = `Pontos: <span id="pontuacao">${pontuacao}</span>`;
    placarConteudo.style.color = "#000";
  }, 1000);
}

// iniciar jogo
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomeJogador").value.trim();
  const nivel = document.getElementById("nivel").value;
  const estilo = document.querySelector("input[name='estilo']:checked");
  const habilidade = document.querySelector("input[name='habilidade']:checked");

  if (!nome || !nivel || !estilo || !habilidade) {
    alert("Preencha todos os campos para iniciar o jogo.");
    return;
  }

  // definir quantidade de perguntas por nível
  let quantidade = 3;
  switch(nivel) {
    case "medio": quantidade = 5; break;
    case "dificil": quantidade = 10; break;
  }
  perguntasJogo = embaralhar([...perguntas]).slice(0, quantidade);

  // definir tempo por estilo
  switch(estilo.value) {
    case "ofensivo": tempoPergunta = 3000; break;
    case "equilibrado": tempoPergunta = 5000; break;
    case "defensivo": tempoPergunta = 7000; break;
  }

  // definir pontos por acerto pelo usuário
  switch(habilidade.value) {
    case "ruim": pontosPorAcerto = 1; break;
    case "mediano": pontosPorAcerto = 2; break;
    case "bom": pontosPorAcerto = 3; break;
  }

  // reset
  indice = 0;
  pontuacao = 0;
  pontuacaoSpan.textContent = pontuacao;
  placarConteudo.style.color = "#000";
  placarConteudo.textContent = `Pontos: ${pontuacao}`;

  formSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  carregarPergunta();
  resetarBola();
});

// carregar pergunta
function carregarPergunta() {
  if (indice >= perguntasJogo.length) {
    placarConteudo.innerHTML = `🏁 Jogo finalizado! Pontos: ${pontuacao} / ${perguntasJogo.length * pontosPorAcerto}`;
    return;
  }

  const q = perguntasJogo[indice];
  textoPergunta.textContent = q.enunciado;

  let opcoes = q.opcoes.map((texto, idx) => ({ texto, idx }));
  opcoes = embaralhar(opcoes);

  cestas.forEach((cesta, i) => {
    cesta.querySelector(".opcaoText").textContent = opcoes[i].texto;
    cesta.dataset.opcaoIndex = opcoes[i].idx;
  });

  // inicia contador de tempo
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    atualizarPlacarTemporario("⏰ Tempo esgotado!", "#ff5252");
    indice++;
    setTimeout(() => {
      resetarBola();
      carregarPergunta();
    }, 1000);
  }, tempoPergunta);
}

// mover bola
function moverBolaParaCesta(cestaEl) {
  const quadraRect = quadra.getBoundingClientRect();
  const cestaRect = cestaEl.getBoundingClientRect();

  const centroX = cestaRect.left + cestaRect.width / 2 - quadraRect.left;
  const centroY = cestaRect.top + cestaRect.height / 2 - quadraRect.top;

  bola.style.left = `${centroX}px`;
  bola.style.top = `${centroY}px`;
  bola.style.transform = "translate(-50%, -50%)";
}

// verificar resposta
function verificarResposta(indiceOpcao) {
  clearTimeout(timerId);

  const q = perguntasJogo[indice];
  const correta = q.correta;

  if (indiceOpcao === correta) {
    pontuacao += pontosPorAcerto;
    atualizarPlacarTemporario(`✅ Acertou! +${pontosPorAcerto}`, "#4caf50");
  } else {
    atualizarPlacarTemporario("❌ Errou!", "#ff5252");
  }

  indice++;
  setTimeout(() => {
    resetarBola();
    carregarPergunta();
  }, 1000);
}

// clique nas cestas
cestas.forEach(cesta => {
  cesta.addEventListener("click", () => {
    if (bloqueado) return;
    bloqueado = true;

    const opcIndex = parseInt(cesta.dataset.opcaoIndex, 10);
    moverBolaParaCesta(cesta);

    setTimeout(() => {
      verificarResposta(opcIndex);
      bloqueado = false;
    }, 400);
  });
});

// reset
resetBtn.addEventListener("click", () => {
  clearTimeout(timerId);
  indice = 0;
  pontuacao = 0;
  bloqueado = false;

  gameSection.classList.add("hidden");
  formSection.classList.remove("hidden");
  form.reset();

  pontuacaoSpan.textContent = pontuacao;
  placarConteudo.style.color = "#000";
  placarConteudo.textContent = `Pontos: ${pontuacao}`;

  resetarBola();
});