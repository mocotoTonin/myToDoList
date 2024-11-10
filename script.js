// Elements
const todoContainer = document.querySelector(".todo-container");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const resetButton = document.getElementById("reset-button");
const confirmReset = document.getElementById("confirm-reset");
const confirmButton = document.getElementById("confirm-button");

let oldInputValue;

// Saving Todo
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("draggable", "true");

    todo.innerHTML = `
        <button class="finish-todo"><i class="bi bi-check2"></i></button>
        <h3 class="todo-title">${text}</h3>
        <button class="edit-todo"><i class="bi bi-pen"></i></button>
        <button class="remove-todo"><i class="bi bi-x-lg"></i></button>
    `;

    if (done) todo.classList.add("done");
    if (save) saveTodoLocalStorage({ text, done: 0 });

    todoList.appendChild(todo);
    todoInput.value = "";
    updateTaskCount();
};

const updateTodo = (text) => {
    document.querySelectorAll(".todo").forEach((todo) => {
        if (todo.querySelector("h3").innerText === oldInputValue) {
            todo.querySelector("h3").innerText = text;
            updateTodoLocalStorage(oldInputValue, text);
        }
    });
};

const getSearchedTodos = (search) => {
    document.querySelectorAll(".todo").forEach((todo) => {
        const title = todo.querySelector("h3").innerText.toLowerCase();
        todo.style.display = title.includes(search) ? "flex" : "none";
    });
};

// Events
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value;
    if (inputValue) {
        saveTodo(inputValue)
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateTodoStatusLocalStorage(parentEl.querySelector("h3").innerText);
        updateTaskCount();
    }

    if (targetEl.classList.contains("remove-todo")) {
        removeTodoLocalStorage(parentEl.querySelector("h3").innerText);
        parentEl.remove();
        updateTaskCount();
    }

    if (targetEl.classList.contains("edit-todo")) {
        editForm.style.display = 'flex';
        editInput.value = parentEl.querySelector("h3").innerText;
        oldInputValue = editInput.value;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editForm.style.display = 'none';
    todoContainer.style.overflowY = "auto";
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editInputValue = editInput.value;
    todoContainer.style.overflowY = "auto";
    if (editInputValue) {
        updateTodo(editInputValue);
    }
    editForm.style.display = 'none';
});

searchInput.addEventListener("keyup", (e) => getSearchedTodos(e.target.value));

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
});


// Local Storage
const getTodosLocalStorage = () => JSON.parse(localStorage.getItem("todos")) || [];

const loadTodos = () => getTodosLocalStorage().forEach((todo) => saveTodo(todo.text, todo.done, 0));

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage().filter((todo) => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => {
        if (todo.text === todoText) todo.done = !todo.done;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => {
        if (todo.text === todoOldText) todo.text = todoNewText;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
