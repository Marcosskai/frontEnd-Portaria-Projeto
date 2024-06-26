document.addEventListener("DOMContentLoaded", function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const passwordField = document.getElementById('password');
    const conciergeCheckbox = document.getElementById('concierge');

    // Remover o atributo required inicialmente
    passwordField.removeAttribute('required');

    conciergeCheckbox.addEventListener('change', function() {
        if (conciergeCheckbox.checked) {
            passwordField.classList.remove('hidden');
            passwordField.setAttribute('required', 'required');
        } else {
            passwordField.classList.add('hidden');
            passwordField.removeAttribute('required');
        }
    });

    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        let password = document.getElementById('password').value.trim();
        const concierge = conciergeCheckbox.checked;

        // Se concierge não estiver marcado, defina password como uma string vazia
        if (!concierge) {
            password = "";
        }

        if (!nome || !email || !telefone) {
            alert('Todos os campos são obrigatórios');
            return;
        }

        const userData = {
            name: nome,
            email: email,
            call: telefone,
            password: password,
            concierge: concierge,
            tipo: true,  
            apartamentosId: "000"
        };

        console.log('Dados do usuário a serem enviados:', userData);

        fetch('http://localhost:3333/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNTA4NWJlMy0wNzViLTRjNjAtYTM3Ni1jMGRkY2JjYWI3ZmMiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE4OTkyNTc0fQ.SvKqyRf3YZG8zTaItqSuXK0ljw5nNe6jXMf2RalyDfY' 
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

    const btncancelar = document.getElementById('btncancelar');
    btncancelar.addEventListener('click', function() {
        window.location.href = './index.html';
    });
});
