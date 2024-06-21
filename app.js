document.addEventListener("DOMContentLoaded", function() {
    const userListBody = document.getElementById('user-list-body');

    fetch('https://reqres.in/api/unknown')
        .then(response => {
            console.log('Resposta recebida:', response);
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Formato de dados inválido');
            }

            data.data.forEach(user => {
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
                emailCell.textContent = user.color;
                row.appendChild(emailCell);

                const phoneCell = document.createElement('td');
                phoneCell.textContent = user.pantone_value;
                row.appendChild(phoneCell);

                const actionsCell = document.createElement('td');
                actionsCell.className = 'actions-cell';

                const deleteIcon = document.createElement('img');
                deleteIcon.src = 'style/lixeira.png';
                deleteIcon.alt = 'Excluir usuário';
                deleteIcon.style.width = '16px';
                deleteIcon.style.height = '16px';
                deleteIcon.style.cursor = 'pointer';
                deleteIcon.style.marginLeft = '18px';

                deleteIcon.addEventListener('click', () => {

                    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {

                        fetch(`https://reqres.in/api/users/2/${user.id}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Erro ao excluir o usuário');
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
