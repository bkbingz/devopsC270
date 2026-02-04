let tasks = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentUser = null;

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = {
        id: parseInt(userId),
        name: userName
    };
    
    // Display user name
    document.getElementById('userName').textContent = userName;
    
    // Load user's tasks (PERSISTED - will remember all past inputs!)
    loadTasks();
    renderTasks();
    updateStats();
    
    // Add Enter key support
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});

// Add task
function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('prioritySelect').value;
    const category = document.getElementById('categorySelect').value;
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        userId: currentUser.id,
        text: escapeHtml(text),
        priority: priority,
        category: category,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks(); // SAVE TO PERSIST HISTORY
    renderTasks();
    updateStats();
    input.value = '';
    input.focus();
    
    showSyncStatus('Saved ✅');
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
        showSyncStatus('Updated ✅');
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
        showSyncStatus('Deleted ✅');
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTasks();
}

// Filter by category
function filterByCategory(category) {
    currentCategory = category;
    renderTasks();
}

// Search tasks
function searchTasks() {
    renderTasks();
}

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter by user
    let filteredTasks = tasks.filter(t => t.userId === currentUser.id);
    
    // Apply status filter
    if (currentFilter === 'active') {
        filteredTasks = filteredTasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.completed);
    }
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.category === currentCategory);
    }
    
    // Apply search
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(t => 
            t.text.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort: incomplete first, then by priority, then by date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Render
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li style="text-align:center;padding:20px;color:#999;">No tasks found</li>';
        return;
    }
    
    const categoryEmojis = {
        work: '💼',
        personal: '🏠',
        shopping: '🛒',
        health: '💪',
        other: '📌'
    };
    //
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        
        const date = new Date(task.createdAt).toLocaleDateString();
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="category-badge">${categoryEmojis[task.category]} ${task.category}</span>
            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            <span style="font-size:0.8rem;color:#999;">${date}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">✖</button>
        `;
        taskList.appendChild(li);
    });
}

// Update statistics
function updateStats() {
    const userTasks = tasks.filter(t => t.userId === currentUser.id);
    const total = userTasks.length;
    const completed = userTasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('completionRate').textContent = completionRate + '%';
}

// Save tasks to localStorage (PERSISTS HISTORY!)
function saveTasks() {
    localStorage.setItem('tasks_v2', JSON.stringify(tasks));
}

// Load tasks from localStorage (REMEMBERS ALL PAST INPUTS!)
function loadTasks() {
    const saved = localStorage.getItem('tasks_v2');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// Export tasks
function exportTasks() {
    const userTasks = tasks.filter(t => t.userId === currentUser.id);
    
    if (userTasks.length === 0) {
        alert('No tasks to export!');
        return;
    }
    
    const dataStr = JSON.stringify(userTasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${currentUser.name}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Tasks exported successfully!');
}

// Import tasks
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedTasks = JSON.parse(e.target.result);
            
            // Add imported tasks with new IDs and current user
            importedTasks.forEach(task => {
                tasks.push({
                    ...task,
                    id: Date.now() + Math.random(), // New unique ID
                    userId: currentUser.id // Assign to current user
                });
            });
            
            saveTasks();
            renderTasks();
            updateStats();
            alert(`Imported ${importedTasks.length} tasks successfully!`);
        } catch (error) {
            alert('Error importing file. Please check the format.');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Only remove auth token, keep tasks saved!
        localStorage.removeItem('authToken');
        localStorage.removeItem('keepSignedIn');
        // Tasks remain saved in tasks_v2 for when user logs back in!
        window.location.href = 'login.html';
    }
}

// Show sync status
function showSyncStatus(message) {
    const status = document.getElementById('syncStatus');
    status.textContent = message;
    setTimeout(() => {
        status.textContent = '✅ Synced';
    }, 2000);
}

// Prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function logout() {

    // optional: clear login state later
    // localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}

/* ===============================
   SIMPLE IN-CODE TEST SUITE
   =============================== */

function assert(condition, message) {
    if (!condition) {
        console.error("❌ FAIL:", message);
        return false;
    }
    console.log("✅ PASS:", message);
    return true;
}

function resetStorage() {
    localStorage.clear();
    sessionStorage.clear();
    tasks = [];
}

/* ===============================
   TC-TASK-02: Empty task blocked
   =============================== */
function test_empty_task_blocked() {
    console.log("Running TC-TASK-02");

    resetStorage();
    setAuthData(1, "TestUser", true);
    currentUser = { id: 1, name: "TestUser" };

    document.getElementById("taskInput").value = "   ";
    addTask();

    return assert(tasks.length === 0, "Empty task should not be added");
}

/* ==================================
   TC-PERSIST-01: Task persists refresh
   ================================== */
function test_task_persistence() {
    console.log("Running TC-PERSIST-01");

    resetStorage();
    setAuthData(1, "PersistUser", true);
    currentUser = { id: 1, name: "PersistUser" };

    tasks = [];
    tasks.push({
        id: 123,
        userId: 1,
        text: "Persistent Task",
        completed: false,
        createdAt: new Date().toISOString()
    });

    saveTasks();
    tasks = [];
    loadTasks();

    return assert(
        tasks.some(t => t.text === "Persistent Task"),
        "Task should persist after reload"
    );
}

/* =====================================
   TC-PERSIST-02: User task isolation
   ===================================== */
function test_user_isolation() {
    console.log("Running TC-PERSIST-02");

    resetStorage();

    tasks = [
        { id: 1, userId: 1, text: "User A Task", completed: false },
        { id: 2, userId: 2, text: "User B Task", completed: false }
    ];

    saveTasks();
    loadTasks();

    currentUser = { id: 2, name: "UserB" };
    const visibleTasks = tasks.filter(t => t.userId === currentUser.id);

    return assert(
        visibleTasks.length === 1 && visibleTasks[0].text === "User B Task",
        "User should only see their own tasks"
    );
}

/* ==================================
   TC-SEARCH-01: Search filters tasks
   ================================== */
function test_search_filter() {
    console.log("Running TC-SEARCH-01");

    resetStorage();
    setAuthData(1, "SearchUser", true);
    currentUser = { id: 1, name: "SearchUser" };

    tasks = [
        { id: 1, userId: 1, text: "Buy milk", completed: false },
        { id: 2, userId: 1, text: "Do homework", completed: false }
    ];

    document.getElementById("searchInput").value = "milk";
    renderTasks();

    const displayedTasks = document.querySelectorAll(".task-text");

    return assert(
        displayedTasks.length === 1 &&
        displayedTasks[0].textContent.includes("milk"),
        "Search should filter tasks correctly"
    );
}

/* ===============================
   Run all tests
   =============================== */
function runAllTests() {
    console.log("===== RUNNING IN-CODE TESTS =====");
    test_empty_task_blocked();
    test_task_persistence();
    test_user_isolation();
    test_search_filter();
    console.log("===== TESTING COMPLETE =====");
}

