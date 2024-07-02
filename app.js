document.addEventListener("DOMContentLoaded", function () {
    const editModal = document.getElementById('editModal');
    const closeModal = document.querySelector('.close');
    const editUserForm = document.getElementById('editUserForm');

    if (!editModal || !closeModal || !editUserForm) {
        console.error('Elementos não encontrados.');
        return;
    }

    const editUserId = document.getElementById('editUserId');
    const editUserName = document.getElementById('editUserName');
    const editUserEmail = document.getElementById('editUserEmail');
    const editUserPhone = document.getElementById('editUserPhone');
    const editUserApartments = document.getElementById('editUserApartments');
    const editUserType = document.getElementById('editUserType');

    closeModal.addEventListener('click', closeEditModal);

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    function openEditModal(user) {
        if (!editUserId || !editUserName || !editUserEmail || !editUserPhone || !editUserApartments || !editUserType) {
            console.error('Elemento(s) não encontrado(s) na função openEditModal.');
            return;
        }

        // Limpa os campos do formulário
        editUserId.value = '';
        editUserName.value = '';
        editUserEmail.value = '';
        editUserPhone.value = '';
        editUserApartments.value = '';
        editUserType.value = '';

        // Atualiza os campos com os dados do usuário atual
        editUserId.value = user.id;
        editUserName.value = user.name;
        editUserEmail.value = user.email;
        editUserPhone.value = user.call;
        editUserApartments.value = user.apartamentosId;
        editUserType.value = user.tipo ? 'morador' : 'visitante';

        editModal.style.display = "block";
    }

    function closeEditModal() {
        editModal.style.display = "none";
    }

    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = editUserId.value;
        const updatedUser = {
            id: userId,
            name: editUserName.value,
            email: editUserEmail.value,
            call: editUserPhone.value,
            apartamentosId: editUserApartments.value,
            tipo: editUserType.value === 'morador' ? true : false
        };

        fetch('http://localhost:3333/update-users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTc0NGRmMy1iMjM2LTRkZTAtODU5ZC05YjlhZjdiOGU0N2YiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE4MjE4NTgzfQ.EZHbJzS5y8g8aaNaKn32rI2qicheStHrRdi50UbOIig'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao editar o usuário' + response.status);
            }

            // Atualiza os dados na tabela após a edição bem-sucedida
            const userRow = document.querySelector(`tr[data-user-id='${userId}']`);
            userRow.querySelector('.user-name').textContent = updatedUser.name;
            userRow.querySelector('.user-email').textContent = updatedUser.email;
            userRow.querySelector('.user-phone').textContent = updatedUser.call;
            userRow.querySelector('.user-apartamentosId').textContent = updatedUser.apartamentosId;
            userRow.querySelector('.user-type').textContent = updatedUser.tipo ? 'MORADOR' : 'VISITANTE';

            closeEditModal();
            alert('Usuário atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao editar o usuário:', error);
            alert('Erro ao editar o usuário');
        });
    });

    fetch('http://localhost:3333/view-all', {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTc0NGRmMy1iMjM2LTRkZTAtODU5ZC05YjlhZjdiOGU0N2YiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE4MjE4NTgzfQ.EZHbJzS5y8g8aaNaKn32rI2qicheStHrRdi50UbOIig'
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

        const userListBody = document.getElementById('user-list-body');
        userListBody.innerHTML = '';

        data.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user.id;

            const nameCell = document.createElement('td');
            nameCell.className = 'user-name';
            nameCell.textContent = user.name;
            row.appendChild(nameCell);

            const emailCell = document.createElement('td');
            emailCell.className = 'user-email';
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            const phoneCell = document.createElement('td');
            phoneCell.className = 'user-phone';
            phoneCell.textContent = user.call;
            row.appendChild(phoneCell);

            const apartamentosIdCell = document.createElement('td');
            apartamentosIdCell.className = 'user-apartamentosId';
            apartamentosIdCell.textContent = user.apartamentosId;
            row.appendChild(apartamentosIdCell);

            const typeCell = document.createElement('td');
            typeCell.className = 'user-type';
            typeCell.textContent = user.tipo ? 'MORADOR' : 'VISITANTE';
            row.appendChild(typeCell);

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
            deleteIcon.style.marginLeft = '33px';
            deleteIcon.addEventListener('click', () => {
                if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
                    fetch('http://localhost:3333/delete-user', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTc0NGRmMy1iMjM2LTRkZTAtODU5ZC05YjlhZjdiOGU0N2YiLCJyb2xlcyI6dHJ1ZSwiaWF0IjoxNzE4MjE4NTgzfQ.EZHbJzS5y8g8aaNaKn32rI2qicheStHrRdi50UbOIig'
                        },
                        body: JSON.stringify({ id: user.id })
                    })
                    .then(response => {
                        if (response.status !== 204) {
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
        console.error('Erro ao buscar os usuários:', error);
        alert('Erro ao buscar os usuários');
    });
});
