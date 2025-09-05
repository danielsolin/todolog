document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const logContainer = document.getElementById('log-container');

    // Load todos from localStorage or initialize empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Save todos to localStorage
    const saveTodos = () => {

        localStorage.setItem('todos', JSON.stringify(todos));

    };

    // Render todos
    const renderTodos = () => {

        todoList.innerHTML = '';
        logContainer.innerHTML = '';

        const openTodos = todos.filter(todo => !todo.completed);
        const completedTodos = todos.filter(todo => todo.completed);

        // Render open todos
        openTodos.forEach(todo => {

            const li = document.createElement('li');
            li.setAttribute('data-created', todo.created);

            const mainDiv = document.createElement('div');
            mainDiv.className = 'todo-item-main';

            const span = document.createElement('span');
            span.textContent = todo.text;
            mainDiv.appendChild(span);

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';

            li.appendChild(mainDiv);
            li.appendChild(completeButton);
            todoList.appendChild(li);

        });

        // Group and render completed todos
        const completedByDate = completedTodos.reduce((acc, todo) => {

            const d = new Date(todo.completed);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(todo);

            return acc;

        }, {});

        // Sort dates in descending order and render
        Object.keys(completedByDate)
            .sort((a, b) => new Date(b) - new Date(a))
            .forEach(date => {

                const groupDiv = document.createElement('div');
                groupDiv.classList.add('log-group');

                const heading = document.createElement('h3');
                heading.textContent = date;
                groupDiv.appendChild(heading);

                completedByDate[date].forEach(todo => {

                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('log-item');

                    const mainDiv = document.createElement('div');
                    mainDiv.className = 'todo-item-main';

                    const span = document.createElement('span');
                    span.textContent = todo.text;
                    mainDiv.appendChild(span);

                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'log-item-buttons';

                    const undoButton = document.createElement('button');
                    undoButton.className = 'undo-button';
                    undoButton.textContent = 'Undo';
                    undoButton.dataset.created = todo.created;

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.textContent = 'Delete';
                    deleteButton.dataset.created = todo.created;

                    buttonsDiv.appendChild(undoButton);
                    buttonsDiv.appendChild(deleteButton);

                    itemDiv.appendChild(mainDiv);
                    itemDiv.appendChild(buttonsDiv);
                    groupDiv.appendChild(itemDiv);

                });

                logContainer.appendChild(groupDiv);

            });
    };

    // Handle adding new todos
    todoForm.addEventListener('submit', (e) => {

        e.preventDefault();
        
        const newTodoText = todoInput.value.trim();
        if (newTodoText) {

            todos.push({
                text: newTodoText,
                created: new Date().toISOString(),
                completed: null
            });
            todoInput.value = '';
            
            saveTodos();
            renderTodos();

        }

    });

    // Handle completing todos
    todoList.addEventListener('click', (e) => {

        if (e.target.tagName === 'BUTTON') {

            const li = e.target.closest('li');
            const todoCreated = li.dataset.created;
            const todoToComplete = todos.find(t => t.created === todoCreated);

            if (todoToComplete) {
                todoToComplete.completed = new Date();
                saveTodos();
                renderTodos();
            }
        }

    });

    todoList.addEventListener('dblclick', (e) => {

        if (e.target.tagName === 'SPAN') {

            const li = e.target.closest('li');
            if (li.classList.contains('editing')) return;

            const todoCreated = li.dataset.created;
            const todoToEdit = todos.find(t => t.created === todoCreated);
            if (!todoToEdit) return;

            li.classList.add('editing');

            const span = e.target;
            const button = li.querySelector('button');
            span.style.display = 'none';
            button.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = todoToEdit.text;
            input.classList.add('edit-input');
            li.prepend(input);
            input.focus();

            const cleanup = () => {
                input.remove();
                span.style.display = '';
                button.style.display = '';
                li.classList.remove('editing');
            };

            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    todoToEdit.text = newText;
                    saveTodos();
                    renderTodos(); // Re-render for consistency
                } else {
                    cleanup(); // Or just cleanup if the new text is empty
                }
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                } else if (e.key === 'Escape') {
                    cleanup();
                }
            });

        }

    });

    // Handle undoing and deleting todos
    logContainer.addEventListener('click', (e) => {

        const target = e.target;
        const todoCreated = target.dataset.created;

        if (target.classList.contains('undo-button')) {

            const todoToUndo = todos.find(
                t => t.created === todoCreated
            );
            if (todoToUndo) {

                todoToUndo.completed = null;
                saveTodos();
                renderTodos();

            }

        } else if (target.classList.contains('delete-button')) {

            const prompt = 'Are you sure?';
            if (confirm(prompt)) {

                const todoIndex = todos.findIndex(
                    t => t.created === todoCreated
                );

                if (todoIndex > -1) {

                    todos.splice(todoIndex, 1);
                    saveTodos();
                    
                    renderTodos();

                }
            }

        }
    });

    renderTodos();

});