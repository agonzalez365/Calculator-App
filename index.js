//on page load
$(document).ready(function () {
    //initialize state
    const currentInput = $('#current-input');
    const prevInputs = $('#prev-inputs');
    let equation = [];

    //clickable inputs
    $('.operation').on('click', function (event) {
        const id = $(this).attr('id');
        switch ($(this).attr('id')) {
            case '+':
                handleOperator(id);
                break;
            case '-':
                handleOperator(id);
                break;
            case '*':
                handleOperator(id);
                break;
            case '/':
                handleOperator(id);
                break;
            case '**':
                handleOperator(id);
                break;
            case '=':
                handleCalculation(equation.slice());
                break;
            case '.':
                handleDecimalPoint();
                break;
            case 'Clr':
                handleClear();
                break;
            case 'Del':
                handleDeletion();
                break;
            case 'p/n':
                togglePositive();
                break;
            default:
                break;
        }
    })
    $('.number').on('click', function () {
        handleNumber($(this).text());
    })
    $('.decimal-point').on('click', function () {
        handleDecimalPoint();
    })
    //keyboard inputs
    $(document).on('keypress', function (event) {
        //looks kinda funky but this will check if a number is pressed, or if an operator is pressed
        //it will then call the related function that handles the input
        //fun fact: apparently converting an empty string into a number returns 0 instead of NaN
        if (!isNaN(Number(event.key)) && event.key !== ' ') {
            handleNumber(event.key);
        }
        switch (event.key) {
            case '+':
                handleOperator(event.key);
                break;
            case '-':
                handleOperator(event.key);
                break;
            case '*':
                handleOperator(event.key);
                break;
            case '/':
                handleOperator(event.key);
                break;
            case '=':
                handleCalculation(equation.slice());
                break;
            case '.':
                handleDecimalPoint();
                break;
            case 'Enter':
                handleCalculation(equation.slice());
                break;
            case 'c':
                handleClear();
                break;
            case 'd':
                handleDeletion();
                break;
            default:
                break;
        }
    })

    function handleOperator(operator) {
        //if equation isn't empty, proceed
        if (equation.length > 0) {
            //if previous input is already an operator, replace the operator
            if (isNaN(Number(equation[equation.length - 1]))) {
                equation[equation.length - 1] = operator;
            }
            //else just add the operator to the array
            else {
                equation.push(operator);
            }
            updateScreen([]);
        }
    }

    function handleNumber(number) {
        //if equation is not empty, proceed
        if (equation.length > 0) {
            //if last element in array is an operator, add the number as a new element
            if (isNaN(Number(equation[equation.length - 1]))) {
                equation.push(number);
            }
            //else just append the number to the existing number
            else {
                equation[equation.length - 1] += number;
            }
        }
        //if equation is empty
        else {
            equation.push(number);
        }
        updateScreen([]);
    }

    function handleDecimalPoint() {
        if (equation.length > 0) {
            //if last element is check if it already has a
            if (!isNaN(Number(equation[equation.length - 1]))) {
                if (!equation[equation.length - 1].includes('.')) {
                    equation[equation.length - 1] += '.';
                    updateScreen([]);
                }
            }
            else {
                equation.push('0.');
                updateScreen([]);
            }
        }
        else {
            equation[0] = '0.';
            updateScreen([]);
        }
    }

    function handleDeletion() {
        //if equation isn't empty, proceed, otherwise do nothing
        if (equation.length > 0) {
            //if the last element is an operator remove it
            if (isNaN(Number(equation[equation.length - 1]))) {
                equation.pop();
            }
            //if the last element is a number, remove the last number
            else {
                equation[equation.length - 1] = equation[equation.length - 1].slice(0, -1);
                //if element ends up empty, remove it from the array
                if (equation[equation.length - 1] === '') {
                    equation.pop();
                }
            }
            updateScreen([]);
        }
    }

    function handleClear() {
        //reset equation
        prevInputs.text('');
        equation = [];
        updateScreen([]);
    }

    function togglePositive() {
        //make sure equation isnt empty
        if(equation.length > 0){
            //if last element is a number, toggle whether it is positive
            if(!isNaN(Number(equation[equation.length - 1]))){
                equation[equation.length - 1] = equation[equation.length - 1] * -1;
                updateScreen([]);
            }
        }
    }

    function handleCalculation(equationArray) {
        //probably a way to do this without multiple loops
        //but this is my scuffed solution to implement functioning order of operations

        //this function will do several passes of the copied equation array following order of operations
        //each pass will only calculate specific operators
        //parentheses (not implemented)
        //exponent pass
        //multiplication/division pass
        //addition/subtraction pass
        //all except parentheses will function about the same

        //uncomment the console logs in between passes to see what's happening to the array
        //console.log('Initial Array: ' + equationArray);

        //if equation is empty, do nothing
        if (equation.length > 0) {
            //if the last element is not a nummber, remove it from both arrays
            if (isNaN(Number(equationArray[equationArray.length - 1]))) {
                equationArray.pop();
                equation.pop();
            }
            console.log(equationArray);

            //exponent pass
            for (let i = 1; i < equationArray.length; i += 2) {
                if (i <= equationArray.length) {
                    if (equationArray[i] === '**') {
                        //operate on values next to operator and assign the result
                        //assign result to element on the right so the iterations can continue
                        equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                        //mark for removal
                        equationArray[i - 1] = 'd';
                        equationArray[i] = 'd';
                    }
                }
            }

            //console.log('Before filter: ' + equationArray);
            equationArray = filterArray(equationArray);
            //console.log('After filter: ' + equationArray);

            //multiplication/division pass
            for (let i = 1; i < equationArray.length; i += 2) {
                if (i <= equationArray.length) {
                    if (equationArray[i] === '*' || equationArray[i] === '/') {
                        //operate on values next to operator and assign the result
                        equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                        //mark for removal
                        equationArray[i - 1] = 'd';
                        equationArray[i] = 'd';
                    }
                }
            }

            //console.log('Before filter: ' + equationArray);
            equationArray = filterArray(equationArray);
            //console.log('After filter: ' + equationArray);

            //addition/subtraction pass
            for (let i = 1; i < equationArray.length; i += 2) {
                if (i <= equationArray.length) {
                    if (equationArray[i] === '+' || equationArray[i] === '-') {
                        //operate on values next to operator and assign the result
                        equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                        //mark for removal
                        equationArray[i - 1] = 'd';
                        equationArray[i] = 'd';
                    }
                }
            }

            //console.log('Before filter: ' + equationArray);
            equationArray = filterArray(equationArray);
            //console.log('After filter: ' + equationArray);

            updateScreen(equationArray);
        }

    }

    //remove elements that are marked for removal ('d') from arrays, so more passes can be done
    function filterArray(array) {
        array = array.filter(function (element) {
            if (element !== 'd') {
                return true;
            }
            else {
                return false;
            }
        });
        return array;
    }

    //use with handle calculation to evaluate parts of the expression
    function operationEvaluator(val1, val2, operation) {
        let result;
        switch (operation) {
            case '+':
                result = val1 + val2;
                break;
            case '-':
                result = val1 - val2;
                break;
            case '*':
                result = val1 * val2;
                break;
            case '/':
                result = val1 / val2;
                break;
            case '**':
                result = val1 ** val2;
                break;
            default:
                break;
        }
        return result.toString();
    }

    //TO DO: Limit input size
    //handle and update display
    //if an empty array is passed, overwrite currentInput text with the current equation
    //else log the current equation to the history box, and overwrite prevInputs text with equation and currentInputs with the equation result
    //then reset the equation to equal the result
    function updateScreen(array) {
        if (array.length === 0) {
            currentInput.text(equation.join(' '));
        }
        else {
            $('#log').append(`
            <p>${equation.join(' ')} = ${array[0]}</p>
            `)
            prevInputs.text(equation.join(' '));
            currentInput.text(array[0]);
            equation = array;
        }
    }
})