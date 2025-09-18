if (sessionStorage.getItem('isAuthenticated') !== 'true') {
    // Se não estiver, redireciona para a página de login
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const demandList = document.getElementById('demand-list');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.btn-filter');

    let currentStatusFilter = 'Todos';

    const renderDemands = () => {
        const allDemands = JSON.parse(localStorage.getItem('demands')) || [];
        const searchTerm = searchInput.value.toLowerCase();

        demandList.innerHTML = ''; // Limpa a lista antes de renderizar

        // 1. Filtra por status
        const statusFilteredDemands = allDemands.filter(demand => {
            if (currentStatusFilter === 'Todos') return true;
            return demand.status === currentStatusFilter;
        });
        
        // 2. Filtra por termo de busca
        const finalDemands = statusFilteredDemands.filter(demand => 
            demand.name.toLowerCase().includes(searchTerm) || 
            demand.category.toLowerCase().includes(searchTerm)
        );

        if (finalDemands.length === 0) {
            demandList.innerHTML = '<p class="card">Nenhuma demanda encontrada.</p>';
            return;
        }

        finalDemands.forEach(demand => {
            const card = document.createElement('div');
            card.className = 'demand-card';
            // Usa replace para o status "Em Progresso" ter uma classe CSS válida
            const statusClass = `status-${demand.status.replace(/\s+/g, '.')}`;

            card.innerHTML = `
                <div class="demand-card-header">
                    <h3>${demand.category}</h3>
                    <span class="status-badge ${statusClass}">${demand.status}</span>
                </div>
                <div class="demand-card-body">
                    <p><strong>Solicitante:</strong> ${demand.name}</p>
                    <p><strong>Departamento:</strong> ${demand.department}</p>
                    <p><strong>Descrição:</strong> ${demand.description}</p>
                </div>
                <div class="demand-card-actions">
                    <label for="status-${demand.id}">Alterar Status:</label>
                    <select id="status-${demand.id}" class="status-select" data-id="${demand.id}">
                        <option value="Aberta" ${demand.status === 'Aberta' ? 'selected' : ''}>Aberta</option>
                        <option value="Em Progresso" ${demand.status === 'Em Progresso' ? 'selected' : ''}>Em Progresso</option>
                        <option value="Resolvida" ${demand.status === 'Resolvida' ? 'selected' : ''}>Resolvida</option>
                    </select>
                </div>
            `;
            demandList.appendChild(card);
        });
    };

    // Atualiza o status quando o select é alterado
    demandList.addEventListener('change', (event) => {
        if (event.target.classList.contains('status-select')) {
            const demandId = event.target.dataset.id;
            const newStatus = event.target.value;
            
            const allDemands = JSON.parse(localStorage.getItem('demands')) || [];
            const updatedDemands = allDemands.map(d => {
                if (d.id == demandId) {
                    return { ...d, status: newStatus };
                }
                return d;
            });
            localStorage.setItem('demands', JSON.stringify(updatedDemands));
            renderDemands();
        }
    });

    // Listener para a busca
    searchInput.addEventListener('input', renderDemands);
    
    // Listeners para os botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');
            currentStatusFilter = button.dataset.status;
            renderDemands();
        });
    });

    // Renderização inicial
    renderDemands();
});