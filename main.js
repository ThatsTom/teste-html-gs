const form = document.getElementById("cepForm");
const cepInput = document.getElementById("cep");
const buscarBtn = document.getElementById("buscarBtn");
const limparBtn = document.getElementById("limparBtn");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");

const campos = {
  cep: document.getElementById("resCep"),
  logradouro: document.getElementById("resLogradouro"),
  bairro: document.getElementById("resBairro"),
  cidade: document.getElementById("resCidade"),
  estado: document.getElementById("resEstado"),
  ddd: document.getElementById("resDdd"),
};

cepInput.addEventListener("input", () => {
  cepInput.value = formatarCep(cepInput.value);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cep = limparCep(cepInput.value);

  if (!cepValido(cep)) {
    mostrarMensagem("Digite um CEP válido com 8 números.", "erro");
    esconderResultado();
    return;
  }

  await buscarEndereco(cep);
});

limparBtn.addEventListener("click", () => {
  form.reset();
  mensagem.textContent = "";
  mensagem.className = "mensagem";
  esconderResultado();
  cepInput.focus();
});

async function buscarEndereco(cep) {
  try {
    buscarBtn.disabled = true;
    buscarBtn.textContent = "Buscando...";
    mostrarMensagem("Consultando CEP...", "");

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!resposta.ok) {
      throw new Error("Não foi possível consultar esse CEP.");
    }

    const dados = await resposta.json();

    if (dados.erro) {
      mostrarMensagem("CEP não encontrado.", "erro");
      esconderResultado();
      return;
    }

    preencherResultado(dados);
    mostrarMensagem("Endereço encontrado com sucesso!", "sucesso");
  } catch (erro) {
    mostrarMensagem("Erro ao buscar o CEP. Tente novamente.", "erro");
    esconderResultado();
  } finally {
    buscarBtn.disabled = false;
    buscarBtn.textContent = "Buscar";
  }
}

function preencherResultado(dados) {
  campos.cep.textContent = dados.cep || "-";
  campos.logradouro.textContent = dados.logradouro || "-";
  campos.bairro.textContent = dados.bairro || "-";
  campos.cidade.textContent = dados.localidade || "-";
  campos.estado.textContent = dados.uf || "-";
  campos.ddd.textContent = dados.ddd || "-";

  resultado.classList.remove("hidden");
}

function esconderResultado() {
  resultado.classList.add("hidden");
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem";

  if (tipo) {
    mensagem.classList.add(tipo);
  }
}

function limparCep(valor) {
  return valor.replace(/\D/g, "");
}

function cepValido(cep) {
  return /^[0-9]{8}$/.test(cep);
}

function formatarCep(valor) {
  const cep = limparCep(valor);

  if (cep.length <= 5) {
    return cep;
  }

  return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
}
