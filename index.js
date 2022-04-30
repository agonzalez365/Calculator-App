//on page load
$(document).ready(function () {
    //initialize state
    const currentInput = $('#current-input');
    const prevInputs = $('#prev-inputs');
    let equation = [];

    //clickable inputs
    $('.operation').on('click', function () {
        const id = $(this).attr('id');
        switch($(this).attr('id')){
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
            case '=':
                handleCalculation(equation.slice());
                break;
            case '.':
                handleDecimalPoint();
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
                handleCalculation(equation);
                break;
            case '.':
                handleDecimalPoint();
                break;
            case 'Enter':
                handleCalculation(equation);
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

    function handleOperator(operator){
        //if equation isn't empty, proceed
        if(equation.length > 0){
            //if previous input is already an operator, replace the operator
            if(isNaN(Number(equation[equation.length - 1]))) {
                equation[equation.length - 1] = operator;
            }
            //else just add the operator to the array
            else {
                equation.push(operator);
            }
            updateScreen([]);
        }
    }

    function handleNumber(number){
        //if equation is not empty, proceed
        if(equation.length > 0) {
            //if last element in array is an operator, add the number as a new element
            if(isNaN(Number(equation[equation.length - 1]))){
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
        if(equation.length > 0){
            //if last element is check if it already has a
            if(!isNaN(Number(equation[equation.length - 1]))){
                if(!equation[equation.length - 1].includes('.')){
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

    function handleDeletion(){
        //if equation isn't empty, proceed, otherwise do nothing
        if(equation.length > 0){
            //if the last element is an operator remove it
            if(isNaN(Number(equation[equation.length - 1]))){
                equation.pop();
            }
            //if the last element is a number, remove the last number
            else {
                equation[equation.length - 1] = equation[equation.length - 1].slice(0, -1);
                //if element ends up empty, remove it from the array
                if(equation[equation.length - 1] === ''){
                    equation.pop();
                }
            }
            updateScreen();
        }
    }

    function handleClear(){
        //reset equation
        equation = [];
        updateScreen([]);
    }

    function handleCalculation(equationArray) {
        //TO DO
        //this function will do several passes over the equation array
        //order of operations, fun.
        //multiplication pass
        //test all addition

        //probably a way to do this without multiple loops
        //but this is my scuffed solution to implement functioning order of operations
        //multiplication/division pass
        for(let i = 1; i < equationArray.length; i += 2){
            if(i <= equationArray.length) {
                if(equationArray[i] === '*' || equationArray[i] === '/'){
                    console.log(equationArray[i]);
                    //operate on values next to operator
                    //assign result to element on the right so the iterations can continue
                    equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                    //mark for removal
                    equationArray[i - 1] = 'd';
                    equationArray[i] =  'd';
                }
            }
        }
        
        //filter before next pass
        equationArray = filterArray(equationArray);
        console.log(equationArray);

        //addition/subtraction pass
        for(let i = 1; i < equationArray.length; i += 2){
            if(i <= equationArray.length) {
                if(equationArray[i] === '+' || equationArray[i] === '-'){
                    console.log(equationArray[i]);
                    equationArray[i + 1] = operationEvaluator(Number(equationArray[i - 1]), Number(equationArray[i + 1]), equationArray[i]);
                    //mark for removal
                    equationArray[i - 1] = 'd';
                    equationArray[i] =  'd';
                }
            }
        }

        equationArray = filterArray(equationArray);
        console.log(equationArray);

        updateScreen(equationArray);

    }

    function filterArray(array){
        array = array.filter(function (element) {
            if(element !== 'd'){
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
        if(typeof operation === 'string'){
            let result;
            switch(operation){
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
                default:
                    break;
            }
            return result.toString();
        }
        else {
            console.log('what happened');
        }
        
    }

    //TO DO: Limit input size
    //handle and update display
    function updateScreen(array) {
        if(array.length === 0){
            currentInput.text(equation.join(' '));
        }
        else {
            prevInputs.text(equation.join(' '));
            currentInput.text(array);
            equation = array;
        }
    }
})