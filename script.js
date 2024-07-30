const buttons = [
    '(', ')', '%', 'C',
    '7', '8', '9', '÷',
    '4', '5', '6', 'x',
    '1', '2', '3', '−',
    '0', '.', '=', '+'
];
const displayScreen = document.querySelector('.display');
let sequence = [];
let lastInput = null;

const buttonsContainer = document.querySelector('.buttons');

buttons.forEach(button => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = button;
    if (button === '=') {
        buttonElement.style.backgroundColor = 'rgb(39, 66, 145)';
    }

    buttonElement.addEventListener('click', () => handleButtonClick(button));
    buttonElement.addEventListener('mouseenter', actionOnHover);
    buttonElement.addEventListener('mouseleave', actionOnLeave);
    buttonsContainer.appendChild(buttonElement);
});

function actionOnHover(event) {
    if (event.target.textContent === '=') {
        event.target.style.backgroundColor = 'rgb(35, 54, 111)';
    } else {
        event.target.style.backgroundColor = '#1c232a';
    }
}

function actionOnLeave(event) {
    if (event.target.textContent === '=') {
        event.target.style.backgroundColor = 'rgb(39, 66, 145)';
    } else {
        event.target.style.backgroundColor = '#222b33';
    }
}

let decimalExist = false;
let left = false;

function handleButtonClick(button) {
    //clears the leading 0 
    if (displayScreen.textContent === '0') { 
        displayScreen.textContent = '';
        lastInput = null;
    }
    //checks for . in answer 
    if (displayScreen.textContent !== null) {
        if (displayScreen.textContent.indexOf('.') === -1) {
            decimalExist = false;
        } else {
            decimalExist = true;
        }
    }
    //allows for negative numbers
    if ((lastInput === null || lastInput === '(') && button === '−') { 
        displayScreen.textContent += '-';
        lastInput = button;
        return;
    } 
    //checks for first operator
    if ((lastInput === null || lastInput === '(') && isNaN(Number(button)) && button !== '(') {
        displayScreen.textContent = '0';
        return;
    }
    //special operators
    if (button === 'C') {
        displayScreen.textContent = '0';
        lastInput = null;
        decimalExist = false;
        last = false;
        return;
    } else if (button === '=') {
        para();
        let displayVal = operations(sequence);;
        if (displayVal || displayVal === 0) {
            displayScreen.textContent = displayVal;
        }
    } else if (isNaN(Number(button)) && button !== '.') { //operators
        if (button === '(' || button === ')') {
            if (button === lastInput) {
                return;
            } else if (lastInput === '(') {
                if (isNaN(button)) {
                    return;
                }
            }
            if (button === '(') {
                displayScreen.textContent += ' ';
                displayScreen.textContent += button;
                displayScreen.textContent += ' ';
                left = true;
            }
            if (left && button === ')') {
                displayScreen.textContent += ' ';
                displayScreen.textContent += button;
                displayScreen.textContent += ' ';
                left = false;
            }
        } else if (isNaN(Number(lastInput)) && lastInput !== '(' && lastInput !== ')') {
            if (button === lastInput) { //duplicate operator
                return;
            } else { //operator change
                const index = displayScreen.textContent.lastIndexOf(lastInput);
                let newA = displayScreen.textContent.slice(0, index) + button + ' ';
                displayScreen.textContent = newA;
            }
        } else { //new operator
            displayScreen.textContent += ' ';
            displayScreen.textContent += button;
            displayScreen.textContent += ' ';
        }
    } else { //numbers
        if (!decimalExist && button === '.') {
            displayScreen.textContent += button;
        } 
        if (button !== '.') {
            displayScreen.textContent += button;
        }
    }
    sequence = displayScreen.textContent.split(' ').filter( element => element !== '');
    if (button !== '=' && button !== 'C' && button !== '.') {
        lastInput = button;
    }
}

function operations(numbers) {
    if (numbers.length <= 1) {
        return numbers;
    }
    let sum = null;
    const op = numOperation();
    for (let i = 0; i < op; i++) {
        if (isNaN(Number(numbers[1]))) {
            if (numbers[1] === '÷') {
                sum = Number(numbers[0]) / Number(numbers[2]);
            } else if (numbers[1] === 'x') {
                sum = Number(numbers[0]) * Number(numbers[2]);
            } else if (numbers[1] === '−') {
                sum = Number(numbers[0]) - Number(numbers[2]);
            } else if (numbers[1] === '+') {
                sum = Number(numbers[0]) + Number(numbers[2]);
            } else if (numbers[1] === '%') {
                sum = Number(numbers[0]) % Number(numbers[2]);
            }
            numbers.splice(0, 2);
            numbers[0] = sum;
        }
    }
    return sum;
}

function para() {
    while (sequence.indexOf('(') !== -1) {
        const startParen = sequence.indexOf('(');
        const endParen = sequence.indexOf(')');

        const insideParen = sequence.slice(startParen+1, endParen);
        let replacement = operations(insideParen);
        
        sequence.splice(startParen, endParen-startParen);
        sequence[startParen] = replacement;
    }
}

function numOperation() {
    let numOp = 0;
    sequence.forEach( number => {if (isNaN(Number(number))) ++numOp});
    return numOp;
}