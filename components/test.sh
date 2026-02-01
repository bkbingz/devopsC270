    #!/bin/bash

    echo "Starting Automated Tests..."

    # Test 1: Check if index.html exists
    if [ -f "index.html" ]; then
        echo "✔ index.html exists."
    else
        echo "✘ Error: index.html is missing!"
        exit 1
    fi

    # Test 2: Check if script.js contains the addTask function
    if grep -q "function addTask" script.js; then
        echo "✔ JavaScript logic (addTask) is present."
    else
        echo "✘ Error: Required JavaScript function 'addTask' not found!"
        exit 1
    fi

    echo "All tests passed successfully!"
    exit 0