document.addEventListener("DOMContentLoaded", function () {
    const responseToken = localStorage.getItem('responseToken');
    const editModal = document.getElementById('editModal');
    const closeModal = document.querySelector('.close');
    const editUserForm = document.getElementById('editUserForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (!editModal || !closeModal || !editUserForm || !searchInput || !searchButton) {
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
                'Authorization': `Bearer ${responseToken}`
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao editar o usuário' + response.status);
            }

            const userRow = document.querySelector(`tr[data-user-id='${userId}']`);
            userRow.querySelector('.user-name span').textContent = updatedUser.name;
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
            'Authorization': `Bearer ${responseToken}`
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

        displayUsers(data);
    })
    .catch(error => {
        console.error('Erro ao buscar os usuários:', error);
        alert('Erro ao buscar os usuários');
    });

    const searchUsers = async (query) => {
        try {
            let searchParams = {};

            if (query.length <= 4 && !isNaN(query) && !isNaN(parseFloat(query))) {
                searchParams = { apartamentosId: query };
            } else if (query.length === 11 && !isNaN(query) && !isNaN(parseFloat(query))) {
                searchParams = { call: query };
            } else if (query.indexOf("@") !== -1) {
                searchParams = { email: query };
            } else {
                searchParams = { name: query };
            }

            const response = await fetch('http://localhost:3333/searchuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${responseToken}`
                },
                body: JSON.stringify(searchParams)
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar usuários');
            }

            const users = await response.json();
            displayUsers(users);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao buscar usuários');
        }
    };

    const displayUsers = (users) => {
        const userListBody = document.getElementById('user-list-body');
        userListBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user.id;

            const nameCell = document.createElement('td');
            nameCell.className = 'user-name';
            
            const icon = document.createElement('img');
            icon.src = 'style/vector.png';
            icon.alt = 'User Icon';
            icon.className = 'icon-style';
            
            nameCell.appendChild(icon);
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = ` ${user.name}`;
            nameCell.appendChild(nameSpan);
            
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
                            'Authorization': `Bearer ${responseToken}`
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
    };

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            searchUsers(query);
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                searchUsers(query);
            }
        }
    });
});
