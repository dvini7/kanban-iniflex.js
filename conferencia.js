// --- 3. LÓGICA DE CAPTURA E RENDERIZAÇÃO (VIA REDE) ---
// ⚠️ COLOQUE O SEU IPv4 NA LINHA ABAIXO
const URL_API = 'http://192.168.0.87:3000/pedidos';

const btnToggle = document.getElementById('stark-kanban-btn');
const panel = document.getElementById('stark-kanban-panel');
const btnClose = document.getElementById('stark-close');
const btnAdd = document.getElementById('btn-add-pedido');
const divLista = document.getElementById('stark-lista');
const spanQtd = document.getElementById('stark-qtd');

// Função para buscar e renderizar da rede
async function renderizarLista() {
    try {
        const resposta = await fetch(URL_API);
        let dbRede = await resposta.json();
        
        spanQtd.innerText = dbRede.length;
        divLista.innerHTML = '';
        
        dbRede.forEach(p => {
            const isHoje = p.data.includes(new Date().toLocaleDateString('pt-BR'));
            const corBolinha = isHoje ? '#22c55e' : '#ef4444';
            const sombra = isHoje ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)';

            divLista.innerHTML += `
                <div class="stark-card">
                    <div class="bolinha-status" style="background: ${corBolinha}; box-shadow: 0 0 8px ${sombra};"></div>
                    <div class="stark-card-title">#${p.id}</div>
                    <div class="stark-card-cli" title="${p.cli}">${p.cli}</div>
                    <div class="stark-card-dates">
                        <div class="stark-data-box"><span class="stark-data-lbl">INÍCIO</span><span class="stark-data-val">${p.data}</span></div>
                        <div class="stark-data-box" style="text-align:right;"><span class="stark-data-lbl">PREVISÃO</span><span class="stark-data-val" style="color:#ffd700;">${p.previsao}</span></div>
                    </div>
                </div>
            `;
        });
    } catch (erro) {
        console.error("Erro de conexão:", erro);
        divLista.innerHTML = '<span style="color:red; font-size: 11px; padding: 10px;">Erro ao conectar com o servidor da rede.</span>';
    }
}

// Abre e fecha o painel (e atualiza a lista ao abrir)
btnToggle.onclick = () => {
    if (panel.style.display === 'flex') {
        panel.style.display = 'none';
    } else {
        renderizarLista(); // Busca os dados mais novos na rede
        panel.style.display = 'flex';
    }
};
btnClose.onclick = () => panel.style.display = 'none';

// Captura e salva no servidor
btnAdd.onclick = async () => {
    const els = Array.from(document.querySelectorAll('td, span')).map(e => e.innerText.trim());
    let idEncontrado = null;
    let cliEncontrado = "Cliente Desconhecido";

    for (let i = 0; i < els.length; i++) {
        if (/^\d{4,6}$/.test(els[i])) { 
            idEncontrado = els[i];
            if (els[i+2]) cliEncontrado = els[i+2]; 
            break;
        }
    }

    const idFinal = prompt("Confirme o número do pedido para Conferência:", idEncontrado || "");
    if (!idFinal) return;

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    try {
        // 1. Busca a lista atual do servidor
        const res = await fetch(URL_API);
        let dbAtualizado = await res.json();
        
        // 2. Adiciona o novo pedido no topo
        dbAtualizado = dbAtualizado.filter(x => x.id !== idFinal);
        dbAtualizado.unshift({
            id: idFinal,
            cli: cliEncontrado,
            data: dataAtual,
            previsao: "30/06/2026"
        });

        // 3. Salva a nova lista no servidor
        await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbAtualizado)
        });

        // 4. Atualiza a tela
        renderizarLista();
    } catch (erro) {
        alert("Erro ao salvar! Verifique se o servidor no IntelliJ está rodando.");
    }
};

// Renderiza ao carregar a página
renderizarLista();

// Timer: Atualiza a lista automaticamente a cada 10 segundos se o painel estiver aberto
setInterval(() => {
    if (panel.style.display === 'flex') {
        renderizarLista();
    }
}, 10000);
