//on page load
$(document).ready(function () {
    //initialize state
    const currentInput = $('#current-input');
    const prevInputs = $('#prev-inputs');
    let equation = [];
    let equationHistory = [];

    //clickable inputs
    $('.operation').on('click', function (event) {
        const id = $(this).attr('id');
        switch (id) {
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
            case '%':
                handlePercent();
                break;
            case '(':
                handleParentheses(id);
                break;
            case ')':
                handleParentheses(id);
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
    $('#equation-log').on('click', 'button.eq', function () {
        setEquation($(this).attr('id'));
    })
    $('#clear-log').on('click', function () {
        equationHistory = [];
        $('#equation-log').empty();
    });
    //keyboard inputs
    $(document).on('keydown', function (event) {
        //check for numbers and backspace
        //fun fact: apparently converting an empty string into a number returns 0 instead of NaN
        if (!isNaN(Number(event.key)) && event.key !== ' ') {
            handleNumber(event.key);
        }
        switch (event.key) {
            case 'Backspace':
                handleDeletion();
                break;
            default:
                break;
        }
    })
    $(document).on('keyup', function (event) {
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
            case '%':
                handlePercent();
                break;
            case '(':
                handleParentheses(event.key);
                break;
            case ')':
                handleParentheses(event.key);
                break;
            case 'Enter':
                handleCalculation(equation.slice());
                break;
            default:
                break;
        }
    })


    function handleOperator(operator) {
        //if equation isn't empty, proceed
        if (equation.length > 0) {
            //if last element is already an operator or parenthesis, proceed
            if (isNaN(Number(equation[equation.length - 1]))) {
                //if last element is not an opening parenthesis, reassign it
                if(equation[equation.length - 1] !== '(' && equation[equation.length - 1] !== ')') {
                    equation[equation.length - 1] = operator;
                }
                //if last element is a closing parenthesis, push the operator
                else if (equation[equation.length -1] === ')') {
                    equation.push(operator);
                }
            }
            //else just add the operator to the array
            else {
                equation.push(operator);
            }

            //operator handled, update screen
            updateScreen([]);
        }
    }

    function handleNumber(number) {
        //if equation is not empty, proceed
        if (equation.length > 0) {
            //if last element in array is an operator or parenthesis, proceed
            if (isNaN(Number(equation[equation.length - 1]))){
                //if last element is not a closing parenthesis, add number to end of array
                if(equation[equation.length - 1] !== ')') {
                    equation.push(number);
                }
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

        //number handled, update screen
        updateScreen([]);
    }

    function handleDecimalPoint() {
        if (equation.length > 0) {
            //if last element is a number, check if it already has a decimal point
            if (!isNaN(Number(equation[equation.length - 1]))) {
                if (!equation[equation.length - 1].includes('.')) {
                    equation[equation.length - 1] += '.';
                }
            }
            else {
                equation.push('0.');
            }
        }
        else {
            equation[0] = '0.';
        }

        //decimal point handled, update screen
        updateScreen([]);
    }

    function handlePercent() {
        // functionally just a divide by 100 button with current implementation
        if (equation.length > 0) {
            if (!isNaN(Number(equation[equation.length - 1]))) {
                equation.push('/');
                equation.push('100');
                updateScreen([]);
            }
        }
    }

    function handleParentheses(input) {
        //opening parentheses can be added without additonal checks, any unclosed parentheses will be closed on calculation if user did not close them
        if (input === '(') {
            equation.push('(');
        }
        //closing parentheses will only be added if the amount of closing parentheses is less than the amount of opening parentheses
        else {
            const openCount = equation.filter((element) => element === '(');
            const closeCount = equation.filter((element) => element === ')');
            if (openCount.length > closeCount.length) {
                equation.push(')');
            }
        }
        
        //parentheses handled, update screen
        updateScreen([]);
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

            //deletion handled, update screen
            updateScreen([]);
        }
    }

    function handleClear() {
        //reset equation state and display
        prevInputs.text('');
        equation = [];

        //clear handled, update screen
        updateScreen([]);
    }

    function togglePositive() {
        //make sure equation isnt empty
        if (equation.length > 0) {
            //if last element is a number, toggle whether it is positive
            if (!isNaN(Number(equation[equation.length - 1]))) {
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
                    if (equationArray[i] === '*') {
                        //operate on values next to operator and assign the result
                        equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                        //mark for removal
                        equationArray[i - 1] = 'd';
                        equationArray[i] = 'd';
                    }
                    else if (equationArray[i] === '/') {
                        if (equationArray[i + 1] === '0') {
                            //if dividing by 0, cancel out of equation
                            handleClear();
                            alert('Cannot divide by 0');
                            return;
                        }
                        else {
                            //same operation that happens on multiplication
                            equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                            equationArray[i - 1] = 'd';
                            equationArray[i] = 'd';
                        }

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

            //pass the solved equation to updateScreen
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

    //sets prevInputs to previous equation and sets currentInput and equation array to result of previous equation
    function setEquation(id) {
        equation = [equationHistory[id].result];
        currentInput.text(equation);
        prevInputs.text(equationHistory[id].equation.join(' '));
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
            equationHistory.push({
                result: array[0],
                equation: equation
            });
            //append equation to log
            //append a button with an id equal to corresponding index in equation history
            $('#equation-log').append(`
            <div>
                <span>${equation.join(' ')} = ${array[0]}</span>
                <button id="${$('#equation-log').find('div').length}" class="eq">Get</button>
            </div>
            `)
            prevInputs.text(equation.join(' '));
            currentInput.text(array[0]);
            equation = array;
        }
    }
})