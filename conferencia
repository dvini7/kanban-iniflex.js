(function() {
    // Evita carregar duas vezes
    if (document.getElementById('stark-kanban-container')) return;

    // --- 1. CSS INJETADO (Estilo Dark Mode da sua imagem) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #stark-kanban-container {
            position: fixed; bottom: 20px; right: 20px; z-index: 999999;
            font-family: 'Inter', sans-serif, Arial; display: flex; flex-direction: column; align-items: flex-end;
        }
        #stark-kanban-btn {
            background: #0f172a; color: #00f0ff; border: 1px solid #00f0ff; box-shadow: 0 4px 12px rgba(0, 240, 255, 0.2);
            padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;
            text-transform: uppercase; font-size: 12px; display: flex; gap: 8px; align-items: center;
        }
        #stark-kanban-btn:hover { background: #00f0ff; color: #000; }
        
        #stark-kanban-panel {
            background: #0B1120; border: 1px solid #1e293b; border-radius: 12px; width: 280px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5); margin-bottom: 15px; display: none; flex-direction: column;
            overflow: hidden;
        }
        #stark-kanban-header {
            background: linear-gradient(180deg, rgba(0,240,255,0.15) 0%, rgba(0,0,0,0.2) 100%);
            border-bottom: 3px solid #00f0ff; padding: 12px; font-size: 11px; font-weight: 900;
            color: #00f0ff; text-transform: uppercase; display: flex; justify-content: space-between;
        }
        #stark-kanban-body { padding: 10px; max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        
        .stark-card {
            background: #1e293b; border-radius: 8px; padding: 10px; border-left: 3px solid #00f0ff;
            display: flex; flex-direction: column; gap: 6px; position: relative;
        }
        .stark-card-title { color: #00f0ff; font-weight: 900; font-size: 13px; }
        .stark-card-cli { color: #a0aec0; font-size: 11px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .stark-card-dates { display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 4px; }
        .stark-data-box { display: flex; flex-direction: column; font-size: 9px; }
        .stark-data-lbl { color: #fff; opacity: 0.6; font-weight: bold; }
        .stark-data-val { color: #fff; font-weight: bold; font-size: 10px; }
        
        #btn-add-pedido {
            background: rgba(0, 240, 255, 0.1); border: 1px dashed #00f0ff; color: #00f0ff;
            width: 100%; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 10px;
        }
        #btn-add-pedido:hover { background: #00f0ff; color: #000; }
        
        .bolinha-status {
            width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 10px; right: 10px;
        }
    `;
    document.head.appendChild(style);

    // --- 2. ESTRUTURA HTML ---
    const container = document.createElement('div');
    container.id = 'stark-kanban-container';
    
    container.innerHTML = `
        <div id="stark-kanban-panel">
            <div id="stark-kanban-header">
                <span>Em Conferência (<span id="stark-qtd">0</span>)</span>
                <span style="cursor:pointer; color:#fff;" id="stark-close">✖</span>
            </div>
            <div id="stark-kanban-body">
                <button id="btn-add-pedido">+ CAPTURAR PEDIDO DA TELA</button>
                <div id="stark-lista"></div>
            </div>
        </div>
        <button id="stark-kanban-btn">🚀 Fila Conferência</button>
    `;
    document.body.appendChild(container);

    // --- 3. LÓGICA DE CAPTURA E RENDERIZAÇÃO ---
    const btnToggle = document.getElementById('stark-kanban-btn');
    const panel = document.getElementById('stark-kanban-panel');
    const btnClose = document.getElementById('stark-close');
    const btnAdd = document.getElementById('btn-add-pedido');
    const divLista = document.getElementById('stark-lista');
    const spanQtd = document.getElementById('stark-qtd');

    let dbLocal = JSON.parse(localStorage.getItem('iniflex_conferencia') || '[]');

    function renderizarLista() {
        spanQtd.innerText = dbLocal.length;
        divLista.innerHTML = '';
        
        dbLocal.forEach(p => {
            // Bolinha verde se for de hoje, vermelha se for mais antigo
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
    }

    // Abre e fecha o painel
    btnToggle.onclick = () => panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    btnClose.onclick = () => panel.style.display = 'none';

    // Captura o pedido da tela ao clicar no botão "+"
    btnAdd.onclick = () => {
        // Tenta achar o número do pedido na tabela do Iniflex
        const els = Array.from(document.querySelectorAll('td, span')).map(e => e.innerText.trim());
        let idEncontrado = null;
        let cliEncontrado = "Cliente Desconhecido";

        for (let i = 0; i < els.length; i++) {
            if (/^\d{4,6}$/.test(els[i])) { // Acha um número de 4 a 6 dígitos (Padrão de Pedido)
                idEncontrado = els[i];
                if (els[i+2]) cliEncontrado = els[i+2]; // O Cliente costuma estar 2 colunas pro lado na PVEN002
                break;
            }
        }

        const idFinal = prompt("Confirme o número do pedido para Conferência:", idEncontrado || "");
        if (!idFinal) return;

        const dataAtual = new Date().toLocaleDateString('pt-BR');
        
        // Remove duplicidade
        dbLocal = dbLocal.filter(x => x.id !== idFinal);
        
        dbLocal.unshift({
            id: idFinal,
            cli: cliEncontrado,
            data: dataAtual,
            previsao: "30/06/2026"
        });

        localStorage.setItem('iniflex_conferencia', JSON.stringify(dbLocal));
        renderizarLista();
    };

    // Renderiza a primeira vez
    renderizarLista();

})();
