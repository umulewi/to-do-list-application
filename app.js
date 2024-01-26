document.addEventListener('DOMContentLoaded', function () {
    const tasks = getTasksFromStorage();
    renderTasks(tasks);
    renderCategories();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect.value;
    if (taskText !== '') {
        const tasks = getTasksFromStorage();
        tasks.unshift({ text: taskText, important: false, completed: false, category: selectedCategory });
        saveTasksToStorage(tasks);
        renderTasks(tasks);
        renderCategories();
        taskInput.value = '';
    }
}
function deleteTask(index) {
    const tasks = getTasksFromStorage();
    tasks.splice(index, 1);
    saveTasksToStorage(tasks);
    renderTasks(tasks);
    renderCategories();
}
function toggleImportant(index) {
    const tasks = getTasksFromStorage();
    tasks[index].important = !tasks[index].important;
    saveTasksToStorage(tasks);
    renderTasks(tasks);
}
function toggleCompleted(index) {
    const tasks = getTasksFromStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToStorage(tasks);
    renderTasks(tasks);
}
function handleTaskEdit(index, newText) {
    const tasks = getTasksFromStorage();
    tasks[index].text = newText;
    saveTasksToStorage(tasks);
}
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    // Sort tasks based on importance
    tasks.sort((a, b) => {
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;
        return 0;
    });

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompleted(${index})">
            <span class="${task.completed ? 'completed-task' : ''} ${task.important ? 'important-task' : ''}" contenteditable="true" onblur="handleTaskEdit(${index}, this.innerText)">${task.text}</span>
            <button onclick="deleteTask(${index})">Delete</button>
            <button onclick="toggleImportant(${index})">${task.important ? 'Unmark' : 'Mark Important'}</button>
        `;
        taskList.appendChild(listItem);
    });
}

function renderCategories() {
    const categorySelect = document.getElementById('categorySelect');
    const tasks = getTasksFromStorage();
    const categories = Array.from(new Set(tasks.map(task => task.category)));

    // Predefined categories
    const predefinedCategories = ["Category 1", "Category 2", "Category 3"];

    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    predefinedCategories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function filterTasksByCategory() {
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect.value;

    const tasks = getTasksFromStorage();
    const filteredTasks = (selectedCategory === 'all') ? tasks : tasks.filter(task => task.category === selectedCategory);

    renderTasks(filteredTasks);
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
