#!/bin/bash

echo "Starting Automated Tests..."

if [ -f "index.html" ]; then
    echo "✔ index.html exists."
else
    echo "✘ Error: index.html is missing!"
    exit 1
fi

if [ -f "homepage.html" ]; then
    echo "✔ homepage.html exists."
else
    echo "✘ Error: homepage.html is missing!"
    exit 1
fi

if [ -f "startpage.html" ]; then
    echo "✔ startpage.html exists."
else
    echo "✘ Error: startpage.html is missing!"
    exit 1
fi

if grep -q "<title>My To-Do List</title>" homepage.html; then
    echo "✔ Homepage title is correct."
else
    echo "✘ Error: Homepage title missing or incorrect!"
    exit 1
fi

# ---------- Homepage task input ----------
if grep -q 'id="taskInput"' homepage.html; then
    echo "✔ Task input field exists."
else
    echo "✘ Error: Task input field not found!"
    exit 1
fi

# ---------- Test: Homepage task list ----------
if grep -q 'id="taskList"' homepage.html; then
    echo "✔ Task list exists."
else
    echo "✘ Error: Task list not found!"
    exit 1
fi

# ---------- Test: Homepage addTask function ----------
if grep -q "function addTask" homepage.html; then
    echo "✔ addTask() function is present."
else
    echo "✘ Error: addTask() function not found!"
    exit 1
fi

# ---------- Test: Startpage title ----------
if grep -q "<title>My Tasks</title>" startpage.html; then
    echo "✔ Start page title is correct."
else
    echo "✘ Error: Start page title missing or incorrect!"
    exit 1
fi

# ---------- Test: Startpage auth form ----------
if grep -q 'id="auth-form"' startpage.html; then
    echo "✔ Authentication form exists."
else
    echo "✘ Error: Authentication form not found!"
    exit 1
fi

# ---------- Test: Email input ----------
if grep -q 'type="email"' startpage.html; then
    echo "✔ Email input field exists."
else
    echo "✘ Error: Email input field not found!"
    exit 1
fi

# ---------- Test: Password input ----------
if grep -q 'type="password"' startpage.html; then
    echo "✔ Password input field exists."
else
    echo "✘ Error: Password input field not found!"
    exit 1
fi

# ---------- Test: toggleForm JavaScript ----------
if grep -q "function toggleForm" startpage.html; then
    echo "✔ toggleForm() function exists."
else
    echo "✘ Error: toggleForm() function not found!"
    exit 1
fi

# ---------- Test: Redirect to homepage ----------
if grep -q 'window.location.href = "homepage.html"' startpage.html; then
    echo "✔ Successful login redirects to homepage."
else
    echo "✘ Error: Login redirect not found!"
    exit 1
fi

echo "All tests passed successfully!"
exit 0
