document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Removemos os dados fixos daqui

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Carrega a lista de usuários registrados do localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Procura por um usuário que corresponda ao nome de usuário E à senha
        const foundUser = users.find(user => user.username === username && user.password === password);

        if (foundUser) {
            // Se encontrou o usuário, o login é bem-sucedido
            sessionStorage.setItem('isAuthenticated', 'true');
            window.location.href = 'admin.html';
        } else {
            // Se não encontrou, mostra a mensagem de erro
            errorMessage.style.display = 'block';
        }
    });
});