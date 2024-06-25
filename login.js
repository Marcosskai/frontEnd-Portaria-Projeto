document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    console.log('Tentativa de login com email:', email);

    fetch('http://localhost:3333/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                console.log('Erro detalhado:', error);
                throw new Error(error.message || 'E-mail ou senha inválidos.');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Login bem-sucedido:', data);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.message || 'E-mail ou senha inválidos.';
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        errorMessage.textContent = 'An error occurred. Please try again later.';
    });
});
