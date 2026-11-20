
const API_URL = '/transacoes';

let transacaoEmEdicao = null;

// Formata os valores no padrão monetário brasileiro
function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Busca os dados do backend
async function carregarTransacoes() {
    const lista = document.getElementById('listaTransacoes');

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar os dados.');
        }

        const dados = await resposta.json();

        // Atualiza as métricas recebidas da API
        document.getElementById('saldoTotal').textContent =
            formatarMoeda(dados.metricas.saldoTotal);

        document.getElementById('totalDespesas').textContent =
            formatarMoeda(dados.metricas.totalDespesas);

        document.getElementById('totalGastoImpulso').textContent =
            formatarMoeda(dados.metricas.totalGastoImpulso);

        // Exibe o histórico
        lista.innerHTML = '';

        if (dados.historico.length === 0) {
            lista.textContent = 'Nenhuma transação cadastrada.';
            return;
        }

        dados.historico.forEach(transacao => {
            const item = document.createElement('article');
            item.classList.add('transacao', transacao.tipo);

            const titulo = document.createElement('h3');
            titulo.textContent = transacao.descricao;

            const valor = document.createElement('p');
            valor.textContent = formatarMoeda(transacao.valor);

            const categoria = document.createElement('p');
            categoria.textContent = `Categoria: ${transacao.categoria}`;

            const tipo = document.createElement('p');
            tipo.textContent = `Tipo: ${transacao.tipo}`;

            const consumo = document.createElement('p');
            consumo.textContent = transacao.consumoConsciente
                ? 'Consumo consciente'
                : 'Gasto por impulso';

            // Botão para editar a transação
            const botaoEditar = document.createElement('button');
            botaoEditar.type = 'button';
            botaoEditar.textContent = 'Editar';

            botaoEditar.addEventListener('click', () => {
                editarTransacao(transacao);
            });

            item.append(
                titulo,
                valor,
                categoria,
                tipo,
                consumo,
                botaoEditar
            );

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error('Erro ao carregar transações:', erro);
        lista.textContent = 'Erro ao carregar as transações.';
    }
}

// Preenche o formulário com os dados da transação escolhida
function editarTransacao(transacao) {
    transacaoEmEdicao = transacao._id;

    document.getElementById('descricao').value = transacao.descricao;
    document.getElementById('valor').value = transacao.valor;
    document.getElementById('tipo').value = transacao.tipo;
    document.getElementById('categoria').value = transacao.categoria;
    document.getElementById('consumoConsciente').checked =
        transacao.consumoConsciente;

    document.getElementById('btnSalvar').textContent =
        'Atualizar transação';

    document.getElementById('cancelarEdicao').hidden = false;

    document.getElementById('formTransacao').scrollIntoView({
        behavior: 'smooth'
    });
}

// Cancela a edição e limpa o formulário
function cancelarEdicao() {
    transacaoEmEdicao = null;

    document.getElementById('formTransacao').reset();

    document.getElementById('btnSalvar').textContent =
        'Salvar transação';

    document.getElementById('cancelarEdicao').hidden = true;
}

// Carrega os dados ao abrir a página
carregarTransacoes();

// Envia uma nova transação ou atualiza uma existente
document.getElementById('formTransacao').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dadosTransacao = {
        descricao: document.getElementById('descricao').value,
        valor: Number(document.getElementById('valor').value),
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value,
        consumoConsciente: document.getElementById('consumoConsciente').checked
    };

    const estaEditando = transacaoEmEdicao !== null;

    const url = estaEditando
        ? `${API_URL}/${transacaoEmEdicao}`
        : API_URL;

    const metodo = estaEditando ? 'PATCH' : 'POST';

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosTransacao)
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível salvar a transação.');
        }

        alert(
            estaEditando
                ? 'Transação atualizada com sucesso!'
                : 'Transação cadastrada com sucesso!'
        );

        cancelarEdicao();

        // Atualiza o dashboard e o histórico com os dados do backend
        await carregarTransacoes();

    } catch (erro) {
        console.error('Erro ao salvar transação:', erro);
        alert('Erro ao salvar. Verifique a conexão com o servidor.');
    }
});

// Evento do botão de cancelar edição
document.getElementById('cancelarEdicao').addEventListener('click', cancelarEdicao);
