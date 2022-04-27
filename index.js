//on page load
$(document).ready(function () {
    //initialize state
    const currentInput = $('#current-input');
    const prevInputs = $('#prev-inputs');
    let equation = [];


    //inputs
    $('.operation').on('click', function () {
        updateInputDisplay($(this).text());
    })
    $('.number').on('click', function () {
        updateInputDisplay($(this).text());
    })
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
                handleCalculation();
                break;
            case 'Enter':
                handleCalculation();
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
        console.log('number');
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


    function handleCalculation() {
        console.log('calculate');
    }


    //TO DO: check if previous element is operation before pushing to array
    //TO DO: Limit input size
    //handle and update display
    function updateScreen(calculate) {
        console.log(equation);
        if(!calculate){+
            currentInput.text(equation.join(' '));
        }
        else {
            prevInputs.text(equation.join(' '));
            currentInput.text('something');
        }
    }
})