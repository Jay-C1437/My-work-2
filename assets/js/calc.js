let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points in a number
    if (value === '.') {
        let parts = currentInput.split(/[+\-*/]/);
        let lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            return;
        }
    }
    
    // Handle operator input
    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput === '' || ['+', '-', '*', '/'].includes(currentInput.slice(-1))) {
            if (currentInput !== '') {
                currentInput = currentInput.slice(0, -1);
            }
        }
    }
    
    currentInput += value;
    display.value = currentInput.replace(/\*/g, '×');
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
}

function clearEntry() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput.replace(/\*/g, '×');
    }
}

function calculate() {
    try {
        if (currentInput === '') {
            return;
        }
        
        // Replace display multiplication symbol with actual operator
        let expression = currentInput.replace(/×/g, '*');
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle division by zero and invalid results
        if (!isFinite(result)) {
            display.value = 'Error';
            currentInput = '';
            return;
        }
        
        // Format the result
        if (result.toString().length > 12) {
            result = parseFloat(result.toFixed(8));
        }
        
        display.value = result.toString();
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        clearEntry();
    }
});