let token = null;
let currentEditingTaskId = null;

// Register a new user
async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    alert(data.message);
}

// Login and get a JWT token
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('task-section').style.display = 'block';
        fetchTasks();
    } else {
        alert('Invalid credentials');
    }
}

// Fetch all tasks
async function fetchTasks() {
    const response = await fetch('/tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.setAttribute('data-title', task.title);
        li.setAttribute('data-description', task.description || '');
        
        li.textContent = task.title;
        if (task.completed) {
            li.classList.add('completed');
        }

        const buttons = document.createElement('div');
        buttons.innerHTML = `
            <button onclick="markTaskCompleted(${task.id})">Complete</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="confirmDelete(${task.id})">Delete</button>
        `;
        li.appendChild(buttons);

        taskList.appendChild(li);
    });
}

// Create a new task
async function createTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    if (currentEditingTaskId) {
        // If we're editing, update the task instead
        await updateTask(currentEditingTaskId, title, description);
        return;
    }

    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
        fetchTasks();
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
    }
}

// Function to update an existing task
async function updateTask(taskId, title, description) {
    const response = await fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
        // Reset the editing state
        currentEditingTaskId = null;
        document.getElementById('task-submit').textContent = 'Add Task';
        document.getElementById('cancel-edit').style.display = 'none';
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        
        fetchTasks();
    }
}

// Function to populate the form with task data for editing
function editTask(taskId) {
    const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
    const title = taskElement.getAttribute('data-title');
    const description = taskElement.getAttribute('data-description');

    // Fill the form with task data
    document.getElementById('task-title').value = title;
    document.getElementById('task-description').value = description;
    
    // Change the button text to indicate editing
    document.getElementById('task-submit').textContent = 'Update Task';
    
    // Show the cancel button if it exists
    const cancelButton = document.getElementById('cancel-edit');
    if (!cancelButton) {
        // Create cancel button if it doesn't exist
        const form = document.querySelector('form');
        const newCancelButton = document.createElement('button');
        newCancelButton.id = 'cancel-edit';
        newCancelButton.type = 'button';
        newCancelButton.textContent = 'Cancel';
        newCancelButton.onclick = cancelEditing;
        form.appendChild(newCancelButton);
    } else {
        cancelButton.style.display = 'inline-block';
    }
    
    // Set the current editing task ID
    currentEditingTaskId = taskId;
}

// Function to cancel the editing process
function cancelEditing() {
    currentEditingTaskId = null;
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-submit').textContent = 'Add Task';
    document.getElementById('cancel-edit').style.display = 'none';
}

// Mark a task as completed
async function markTaskCompleted(taskId) {
    await fetch(`/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    fetchTasks();
}

// New function to handle delete confirmation
function confirmDelete(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTask(taskId);
    }
}

// Keep the original deleteTask function, but now it's only called after confirmation
async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    fetchTasks();
}