document.addEventListener("DOMContentLoaded", function () {
    const cadastroForm = document.getElementById('cadastroForm');
    const passwordField = document.getElementById('password');
    const conciergeCheckbox = document.getElementById('concierge');
    const btncancelar = document.getElementById('btncancelar');

    if (cadastroForm && passwordField && conciergeCheckbox && btncancelar) {
        passwordField.setAttribute('autocomplete', 'current-password');
        passwordField.removeAttribute('required');

        conciergeCheckbox.addEventListener('change', function () {
            if (conciergeCheckbox.checked) {
                passwordField.classList.remove('hidden');
                passwordField.setAttribute('required', 'required');
            } else {
                passwordField.classList.add('hidden');
                passwordField.removeAttribute('required');
            }
        });

        cadastroForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const apartamento = document.getElementById('apartamento').value.trim();
            let password = document.getElementById('password').value.trim();
            const concierge = conciergeCheckbox.checked;

            // Captura o valor selecionado no select
            const tipoSelect = document.getElementById('tipo');
            const tipoSelecionado = tipoSelect.value;

            // Ajusta a variável password caso concierge não esteja marcado
            if (!concierge) {
                password = "";
            }

            // Validação dos campos
            if (!nome || !email || !telefone || !apartamento) {
                alert('Todos os campos são obrigatórios');
                return;
            }

            // Define o valor de tipo como true se for "morador" e false se for "visitante"
            let tipoValor = false;
            if (tipoSelecionado === "morador") {
                tipoValor = true;
            }

            const userData = {
                name: nome,
                email: email,
                call: telefone,
                apartamentosId: apartamento,
                password: password,
                concierge: concierge,
                tipo: tipoValor,
            };

            console.log('Dados do usuário a serem enviados:', userData);

            fetch('http://localhost:3333/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Zjg4ZDE1ZS01ZGUzLTQ5ZTQtYTgxYS1jNGMyMjYzZTY4ZjQiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE5NDg5NTk4fQ.B6psuMuYdElOGczd3u0AG5iWlxDjgj5vSVUgF23JgU8'
                },
                body: JSON.stringify(userData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            console.log('Erro detalhado:', error);
                            throw new Error(error.message || 'Erro ao cadastrar o usuário');
                        });
                    }
                    return response.text().then(text => text ? JSON.parse(text) : {});
                })
                .then(newUser => {
                    console.log('Usuário cadastrado com sucesso:', newUser);
                    alert('Usuário cadastrado com sucesso!');
                    window.location.href = './index.html';
                })
                .catch(error => {
                    console.error('Erro ao cadastrar o usuário:', error);
                    alert('Erro ao cadastrar o usuário: ' + error.message);
                });
        });

        btncancelar.addEventListener('click', function () {
            window.location.href = './index.html';
        });
    } else {
        console.error('Um ou mais elementos não foram encontrados na página.');
    }
});
