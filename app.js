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
        openTodos.forEach((todo, index) => {

            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <div class="todo-item-main">
                    <span>${todo.text}</span>
                </div>
                <button>Complete</button>
            `;

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
                    itemDiv.innerHTML = `
                        <div class="todo-item-main">
                            <span>${todo.text}</span>
                        </div>
                        <div class="log-item-buttons">
                            <button class="undo-button"
                                data-created="${todo.created}">Undo</button>
                            <button class="delete-button"
                                data-created="${todo.created}">Delete</button>
                        </div>
                    `;
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
            const index = li.dataset.index;
            const openTodos = todos.filter(todo => !todo.completed);
            const todoToComplete = openTodos[index];
            
            const originalTodo = todos.find(t => t === todoToComplete);
            if (originalTodo) {

                originalTodo.completed = new Date();
                saveTodos();
                renderTodos();

            }

        }

    });

    todoList.addEventListener('dblclick', (e) => {

        if (e.target.tagName === 'SPAN') {

            const li = e.target.closest('li');
            if (li.classList.contains('editing')) return;
            li.classList.add('editing');

            const index = li.dataset.index;
            const openTodos = todos.filter(todo => !todo.completed);
            const todoToEdit = openTodos[index];

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
                    span.textContent = newText;
                    saveTodos();
                }
                cleanup();
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

            const todoToUndo = todos.find(t => t.created === todoCreated);
            if (todoToUndo) {

                todoToUndo.completed = null;
                saveTodos();
                renderTodos();

            }

        } else if (target.classList.contains('delete-button')) {

            const prompt = 'Are you sure?';
            if (confirm(prompt)) {

                const todoIndex = todos.findIndex(t => t.created === todoCreated);
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