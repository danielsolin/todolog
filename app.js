document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const logContainer = document.getElementById('log-container');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        logContainer.innerHTML = '';

        const openTodos = todos.filter(todo => !todo.completed);
        const completedTodos = todos.filter(todo => todo.completed);

        // Render open todos
        openTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${todo.text}</span>
                <button data-index="${index}">Complete</button>
            `;
            todoList.appendChild(li);
        });

        // Group and render completed todos
        const completedByDate = completedTodos.reduce((acc, todo) => {
            const date = new Date(todo.completed).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(todo);
            return acc;
        }, {});

        Object.keys(completedByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('log-group');
            
            const heading = document.createElement('h3');
            heading.textContent = date;
            groupDiv.appendChild(heading);

            completedByDate[date].forEach(todo => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('log-item');
                itemDiv.textContent = todo.text;
                groupDiv.appendChild(itemDiv);
            });

            logContainer.appendChild(groupDiv);
        });
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTodoText = todoInput.value.trim();
        if (newTodoText) {
            todos.push({ text: newTodoText, created: new Date(), completed: null });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            // Find the corresponding open todo
            const openTodos = todos.filter(todo => !todo.completed);
            const todoToComplete = openTodos[index];
            
            // Find the original todo in the main array to modify it
            const originalTodo = todos.find(t => t === todoToComplete);
            if (originalTodo) {
                originalTodo.completed = new Date();
                saveTodos();
                renderTodos();
            }
        }
    });

    renderTodos();
});
