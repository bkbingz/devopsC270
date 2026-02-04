function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement('li');
    li.innerHTML = `
        ${taskText} 
        <span class="delete-btn" onclick="this.parentElement.remove()">X</span>
    `;

    document.getElementById('taskList').appendChild(li);
    input.value = ""; // Clear the input
}