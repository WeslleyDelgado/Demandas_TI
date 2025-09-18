document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('demand-form');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const newDemand = {
            id: Date.now(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            department: document.getElementById('department').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            status: 'Aberta'
        };

        // Salva a demanda no localStorage
        const demands = JSON.parse(localStorage.getItem('demands')) || [];
        demands.push(newDemand);
        localStorage.setItem('demands', JSON.stringify(demands));

        // Mostra a mensagem de sucesso
        successMessage.classList.add('show');

        // Esconde a mensagem após 3 segundos
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);

        form.reset();
    });
});