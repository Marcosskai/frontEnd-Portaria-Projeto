document.addEventListener("DOMContentLoaded", function() {
    const userListBody = document.getElementById('user-list-body');

    fetch('http://localhost:3333/view-all', {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjU4Y2MzZi0zY2E1LTQxYTctODIxMS1kYWVjMGY1MDMwMDIiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE5NDQwMDU2fQ.z1-duyTvjYfZeOqmCAMm7atZEU2IIrtij8Gl8-hGceg'
        }
    })
    .then(response => {
        console.log('Resposta recebida:', response);
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data);

        if (!Array.isArray(data)) {
            throw new Error('Formato de dados inválido');
        }

        data.forEach(user => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.style.display = 'flex';
            nameCell.style.alignItems = 'center';

            const icon = document.createElement('img');
            icon.src = 'style/Vector.png';
            icon.alt = 'Ícone do usuário';
            icon.style.padding = '10px';
            icon.style.width = '43px';
            icon.style.height = '42px';
            icon.style.marginRight = '20px';
            icon.style.backgroundColor = 'rgb(217, 217, 217)';
            icon.style.borderRadius = '50px';

            nameCell.appendChild(icon);
            nameCell.appendChild(document.createTextNode(user.name));
            row.appendChild(nameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            const phoneCell = document.createElement('td');
            phoneCell.textContent = user.call;
            row.appendChild(phoneCell);

            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';

            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'style/delete.png';
            deleteIcon.alt = 'Excluir usuário';
            deleteIcon.style.width = '16px';
            deleteIcon.style.height = '16px';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.marginLeft = '18px';

            deleteIcon.addEventListener('click', () => {

                if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {

                    fetch('http://localhost:3333/delete-user', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNTA4NWJlMy0wNzViLTRjNjAtYTM3Ni1jMGRkY2JjYWI3ZmMiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE4OTkyNTc0fQ.SvKqyRf3YZG8zTaItqSuXK0ljw5nNe6jXMf2RalyDfY'
                        },
                        body: JSON.stringify({ id: user.id })
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                console.log('Erro detalhado:', error);
                                throw new Error(error.message || 'Erro ao excluir o usuário');
                            });
                        }

                        row.remove();
                    })
                    .catch(error => {
                        console.error('Erro ao excluir o usuário:', error);
                        alert('Erro ao excluir o usuário');
                    });
                }
            });

            actionsCell.appendChild(deleteIcon);
            row.appendChild(actionsCell);

            userListBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
        userListBody.innerHTML = '<tr><td colspan="4">Erro ao carregar usuários.</td></tr>';
    });
});
    