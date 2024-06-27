document.addEventListener("DOMContentLoaded", function() {
    const userListBody = document.getElementById('user-list-body');
    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const editUserForm = document.getElementById('editUserForm');
    const editUserId = document.getElementById('editUserId');
    const editUserName = document.getElementById('editUserName');
    const editUserEmail = document.getElementById('editUserEmail');
    const editUserPhone = document.getElementById('editUserPhone');

    function openEditModal(user) {
        editUserId.value = user.id;
        editUserName.value = user.name;
        editUserEmail.value = user.email;
        editUserPhone.value = user.call;
        editModal.style.display = "block";
    }

    function closeEditModal() {
        editModal.style.display = "none";
    }

    closeModal.addEventListener('click', closeEditModal);
    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            closeEditModal();
        }
    });

    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = editUserId.value;
        const updatedUser = {
            id: userId,
            name: editUserName.value,
            email: editUserEmail.value,
            call: editUserPhone.value
        };

        fetch('http://localhost:3333/edit-user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Zjg4ZDE1ZS01ZGUzLTQ5ZTQtYTgxYS1jNGMyMjYzZTY4ZjQiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE5NDg5NTk4fQ.B6psuMuYdElOGczd3u0AG5iWlxDjgj5vSVUgF23JgU8'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Erro ao editar o usuário');
                });
            }
            return response.json();
        })
        .then(updatedUser => {
            const userRow = document.querySelector(`tr[data-user-id='${updatedUser.id}']`);
            userRow.querySelector('.user-name').textContent = updatedUser.name;
            userRow.querySelector('.user-email').textContent = updatedUser.email;
            userRow.querySelector('.user-phone').textContent = updatedUser.call;
            closeEditModal();
        })
        .catch(error => {
            console.error('Erro ao editar o usuário:', error);
            alert('Erro ao editar o usuário');
        });
    });

    fetch('http://localhost:3333/view-all', {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Zjg4ZDE1ZS01ZGUzLTQ5ZTQtYTgxYS1jNGMyMjYzZTY4ZjQiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE5NDg5NTk4fQ.B6psuMuYdElOGczd3u0AG5iWlxDjgj5vSVUgF23JgU8'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            throw new Error('Formato de dados inválido');
        }

        data.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user.id;

            const nameCell = document.createElement('td');
            nameCell.className = 'user-name';   
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
            emailCell.className = 'user-email';
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            const phoneCell = document.createElement('td');
            phoneCell.className = 'user-phone';
            phoneCell.textContent = user.call;
            row.appendChild(phoneCell);

            const actionsCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => {
                openEditModal(user);
            });
            actionsCell.appendChild(editButton);

            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'style/delete.png';
            deleteIcon.alt = 'Excluir usuário';
            deleteIcon.style.width = '16px';
            deleteIcon.style.height = '16px';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.marginLeft = '50px';
            deleteIcon.style
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
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários');
    });
});
