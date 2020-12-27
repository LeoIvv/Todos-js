const form = document.getElementById("form");
const input = document.getElementById("input");
const todos = document.getElementById("todos");
const deletedTodos = document.getElementById("deleted-todos");
const completedTodos = document.getElementById("completed-todos");

let deletedTodosArr = [];
let userLocation = "allTodos";

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = input.value;
    if (todoText) {
        createLiElement(todoText, false);
        getCompletedObjects();
        let todoObj = {
            value: todoText,
            completed: false
        };
        let todosArr = getListFromLocalStorage("todos");
        todosArr.push(todoObj);
        saveListToLocalStorage(todosArr, "todos");
    }
    input.value = "";
});

function getListFromLocalStorage(list) {
    return JSON.parse(localStorage.getItem(list));
}

function saveListToLocalStorage(list, objToSave) {
    localStorage.setItem(objToSave, JSON.stringify(list));
}

function createLiElement(todoText, completed) {
    const todoEl = document.createElement("li");
        // todoEl.setAttribute('data-id', uniqueId++);
        todoEl.innerText = todoText;
        if(completed) {
            todoEl.classList.add("completed");
        }
        todos.appendChild(todoEl);
        todoEl.addEventListener("click", () => {
            todoEl.classList.toggle("completed");
            const index = [...todoEl.parentElement.children].indexOf(todoEl);
            let list = getListFromLocalStorage("todos");
            list[index].completed = todoEl.classList.contains("completed");
            saveListToLocalStorage(list, "todos");
            
            })
        todoEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            if (userLocation === "allTodos") {
            let list = getListFromLocalStorage("todos");

            if (todoEl.classList.contains("completed"))
                todoEl.classList.remove("completed");
            
            
            deletedTodosArr.push(todoEl);

            removeElement(list, todoEl);
            saveListToLocalStorage(list, "todos");
            todos.removeChild(todoEl);
        }
        })
}

function initListToHTML() {
    let storedTodos = getListFromLocalStorage("todos");
    for(let el of storedTodos) {
        createLiElement(el.value, el.completed);
    }
}

function removeElement(arr, value) {
    const index = [...value.parentElement.children].indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

initListToHTML();

function getCompletedObjects() {
    let completedArr = [];
    for (let el of todos.children) {
        if (el.classList.contains("completed"))
            completedArr.push(el);
    }
    return completedArr;
}

function deleteAllTodos() { 
    todos.innerHTML = "";
}

const allTodosBtn = document.getElementById("all-todos");
const completedBtn = document.getElementById("completed");
const deletedBtn = document.getElementById("deleted");

completedBtn.addEventListener("click", (completedTodosSort));

allTodosBtn.addEventListener("click", (allTodosSort));

deletedBtn.addEventListener("click", (deletedTodosSort));

function allTodosSort() {
    if (!form.contains(input))
        form.insertBefore(input, form.firstChild);
    deleteAllTodos();
    initListToHTML();
    userLocation = "allTodos";
}

function completedTodosSort() {
    allTodosSort();
    let completedTodos = getCompletedObjects();
    deleteAllTodos();
    for (let el of completedTodos)
        todos.appendChild(el);
    form.removeChild(input);
    userLocation = "completedTodos";
}

function deletedTodosSort() {
    allTodosSort();
    deleteAllTodos();
    for (let el of deletedTodosArr)
        todos.appendChild(el);
    form.removeChild(input);
    userLocation = "deletedTodos";
}