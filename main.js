// Arquivo: main.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('demand-form');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        setTimeout(() => {
            const priority = document.getElementById('priority').value;

            const newDemand = {
                id: Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                status: 'Aberta',
                resolvedBy: null,
                priority: priority,

                // --- ALTERAÇÃO ADICIONADA AQUI ---
                comments: [] // Array para guardar o histórico de comentários
            };

            const demands = JSON.parse(localStorage.getItem('demands')) || [];
            demands.push(newDemand);
            localStorage.setItem('demands', JSON.stringify(demands));

            successMessage.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);

            form.reset();

            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Demanda';

        }, 1000);
    });
});