document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const feedbackMessage = document.getElementById('feedback-message');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value.trim();

        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Pega a lista de usuários do localStorage ou cria uma lista vazia
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Verifica se o usuário já existe
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            showMessage('Este nome de usuário já está em uso. Tente outro.', 'error');
        } else {
            // Adiciona o novo usuário à lista
            users.push({ username, password });
            // Salva a lista atualizada no localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            showMessage('Usuário registrado com sucesso! Redirecionando para o login...', 'success');
            
            // Redireciona para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });

    function showMessage(message, type) {
        feedbackMessage.textContent = message;
        // Usa as classes de erro/sucesso que já criamos no style.css
        feedbackMessage.className = type === 'error' ? 'error-message' : 'success-message-inline';
        feedbackMessage.style.display = 'block';
    }
});