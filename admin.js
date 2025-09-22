// --- INÍCIO DA GUARDA DE AUTENTICAÇÃO ---
if (sessionStorage.getItem('isAuthenticated') !== 'true') {
    // Se não estiver, redireciona para a página de login
    window.location.href = 'login.html';
}
// --- FIM DA GUARDA de AUTENTICAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Referências principais da página
    const demandList = document.getElementById('demand-list');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.btn-filter');

    // Referências para os elementos do Modal de Edição
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditButton = document.getElementById('cancel-edit');
    const editDemandId = document.getElementById('edit-demand-id');
    const editName = document.getElementById('edit-name');
    const editCategory = document.getElementById('edit-category');
    const editPriority = document.getElementById('edit-priority');
    const editDescription = document.getElementById('edit-description');

    let currentStatusFilter = 'Todos';

    const renderDemands = () => {
        const allDemands = JSON.parse(localStorage.getItem('demands')) || [];
        const searchTerm = searchInput.value.toLowerCase();
        demandList.innerHTML = '';
        const statusFilteredDemands = allDemands.filter(demand => {
            if (currentStatusFilter === 'Todos') return true;
            return demand.status === currentStatusFilter;
        });
        const finalDemands = statusFilteredDemands.filter(demand => 
            demand.name.toLowerCase().includes(searchTerm) || 
            (demand.category && demand.category.toLowerCase().includes(searchTerm))
        );
        if (finalDemands.length === 0) {
            demandList.innerHTML = '<p class="card">Nenhuma demanda encontrada.</p>';
            return;
        }
        finalDemands.forEach(demand => {
            const card = document.createElement('div');
            const statusClass = `status-${demand.status.replace(/\s+/g, '.')}`;
            card.className = `demand-card ${statusClass}`;

            const commentsHtml = (demand.comments && demand.comments.length > 0)
                ? demand.comments.map(comment => `
                    <li class="comment-item">
                        <div class="comment-meta">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-date">${new Date(comment.date).toLocaleString('pt-BR')}</span>
                        </div>
                        <p class="comment-text">${comment.text}</p>
                    </li>
                `).join('')
                : '<p style="font-size: 0.8em; text-align: center; opacity: 0.7;">Nenhum comentário ainda.</p>';

            card.innerHTML = `
                <div class="demand-card-header">
                    <h3>${demand.category} ${demand.priority ? `<span class="priority-badge priority-${demand.priority}">${demand.priority}</span>` : ''}</h3>
                    <span class="status-badge ${statusClass}">${demand.status}</span>
                </div>
                <div class="demand-card-body">
                    <p><strong>Solicitante:</strong> ${demand.name}</p>
                    <p><strong>Departamento:</strong> ${demand.department}</p>
                    <p><strong>Descrição:</strong> ${demand.description}</p>
                    ${demand.resolvedBy ? `<p class="resolved-by"><strong>Resolvido por:</strong> ${demand.resolvedBy}</p>` : ''}
                </div>
                <div class="demand-card-comments">
                    <ul class="comments-list">${commentsHtml}</ul>
                    <div class="add-comment-form">
                        <input type="text" class="new-comment-input" data-id="${demand.id}" placeholder="Adicionar uma nota...">
                        <button class="btn-add-comment" data-id="${demand.id}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="demand-card-actions">
                    <label>Ações:</label>
                    <button class="btn-edit" data-id="${demand.id}" title="Editar Demanda">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-delete" data-id="${demand.id}" title="Excluir Demanda">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
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

    // Listener para MUDAR STATUS
    demandList.addEventListener('change', (event) => {
        if (event.target.classList.contains('status-select')) {
            const demandId = event.target.dataset.id;
            const newStatus = event.target.value;
            const operatorName = sessionStorage.getItem('loggedInUser');
            let allDemands = JSON.parse(localStorage.getItem('demands')) || [];
            const updatedDemands = allDemands.map(d => {
                if (d.id == demandId) {
                    if (newStatus === 'Resolvida') {
                        return { ...d, status: newStatus, resolvedBy: operatorName };
                    } else {
                        return { ...d, status: newStatus, resolvedBy: null };
                    }
                }
                return d;
            });
            localStorage.setItem('demands', JSON.stringify(updatedDemands));
            renderDemands();
        }
    });

    // Listener para AÇÕES DE CLIQUE (Deletar, Editar, Adicionar Comentário)
    demandList.addEventListener('click', (event) => {
        // Deletar
        const deleteButton = event.target.closest('.btn-delete');
        if (deleteButton) {
            const demandId = deleteButton.dataset.id;
            if (confirm('Tem certeza de que deseja excluir esta demanda? Esta ação não pode ser desfeita.')) {
                let allDemands = JSON.parse(localStorage.getItem('demands')) || [];
                const updatedDemands = allDemands.filter(d => d.id != demandId);
                localStorage.setItem('demands', JSON.stringify(updatedDemands));
                renderDemands();
            }
            return;
        }
        
        // Editar
        const editButton = event.target.closest('.btn-edit');
        if (editButton) {
            const demandId = editButton.dataset.id;
            const allDemands = JSON.parse(localStorage.getItem('demands')) || [];
            const demandToEdit = allDemands.find(d => d.id == demandId);
            if (demandToEdit) {
                editDemandId.value = demandToEdit.id;
                editName.value = demandToEdit.name;
                editCategory.value = demandToEdit.category;
                editPriority.value = demandToEdit.priority;
                editDescription.value = demandToEdit.description;
                editModal.style.display = 'flex';
            }
            return;
        }

        // Adicionar Comentário
        const addCommentButton = event.target.closest('.btn-add-comment');
        if (addCommentButton) {
            const demandId = addCommentButton.dataset.id;
            const commentInput = document.querySelector(`.new-comment-input[data-id="${demandId}"]`);
            const commentText = commentInput.value.trim();
            if (commentText) {
                const operatorName = sessionStorage.getItem('loggedInUser');
                let allDemands = JSON.parse(localStorage.getItem('demands')) || [];
                const newComment = { author: operatorName, text: commentText, date: new Date().toISOString() };
                const updatedDemands = allDemands.map(d => {
                    if (d.id == demandId) {
                        if (!d.comments) { d.comments = []; }
                        d.comments.push(newComment);
                    }
                    return d;
                });
                localStorage.setItem('demands', JSON.stringify(updatedDemands));
                renderDemands();
            }
        }
    });

    // Listener para SALVAR no Modal de Edição
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const demandId = editDemandId.value;
        let allDemands = JSON.parse(localStorage.getItem('demands')) || [];
        const updatedDemands = allDemands.map(d => {
            if (d.id == demandId) {
                return { ...d, name: editName.value, category: editCategory.value, priority: editPriority.value, description: editDescription.value };
            }
            return d;
        });
        localStorage.setItem('demands', JSON.stringify(updatedDemands));
        editModal.style.display = 'none';
        renderDemands();
    });

    // Listener para FECHAR o Modal
    cancelEditButton.addEventListener('click', () => { editModal.style.display = 'none'; });
    editModal.addEventListener('click', (event) => { if (event.target === editModal) { editModal.style.display = 'none'; } });

    // Listener para a BUSCA
    searchInput.addEventListener('input', renderDemands);
    
    // Listener para os BOTÕES DE FILTRO
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentStatusFilter = button.dataset.status;
            renderDemands();
        });
    });

    // Renderização inicial
    renderDemands();
});