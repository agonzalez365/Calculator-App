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
                handleCalculation();
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
            updateScreen(false);
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
        updateScreen(false);
    }

    function handleDecimalPoint() {
        if(equation.length > 0){
            if(!equation[equation.length - 1].includes('.') && !isNaN(Number(equation[equation.length - 1]))){
                equation[equation.length - 1] += '.';
                updateScreen(false);
            }
        }
        else {
            equation[0] = '0.';
            updateScreen(false);
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
                if(equation[0] === ''){
                    equation = [];
                }
            }
            updateScreen();
        }
    }

    function handleClear(){
        //reset equation
        equation = [];
        updateScreen(false);
    }


    function handleCalculation(equationArray) {
        //TO DO
        console.log('calculate');
        //this function will do several passes over the equation array
        for(let i = 0; i < equationArray.length; i++){
            if(equationArray[i]){
            }
        }
    }

    //use with handle calculation to evaluate parts of the expression
    function operationEvaluator() {
        
    }


    //TO DO: Limit input size
    //handle and update display
    function updateScreen(calculate) {
        console.log(equation);
        if(!calculate){
            currentInput.text(equation.join(' '));
        }
        else {
            prevInputs.text(equation.join(' '));
            currentInput.text('something');
        }
    }
})