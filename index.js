//on page load
$(document).ready(function () {
    //initialize state
    const currentInput = $('#current-input');
    const prevInputs = $('#prev-inputs');
    let equation = [''];


    //inputs
    $('.operation').on('click', function () {
        updateInputDisplay($(this).text());
    })
    $('.number').on('click', function () {
        updateInputDisplay($(this).text());
    })
    $(document).on('keypress', function (event) {
        //fun fact: apparently converting an empty string into a number returns 0 instead of NaN
        if (!isNaN(Number(event.key)) && event.key !== ' ') {
            updateInputDisplay(event.key);
        }
        switch (event.key) {
            case '=':
                calculateEquation();
                break;
            case '+':
                console.log('add');
                break;
            case '-':
                console.log('subtract');
                break;
            case '*':
                console.log('multiply');
                break;
            case '/':
                console.log('divide');
                break;
            case 'Enter':
                calculateEquation();
                break;
            default:
                break;
        }
    })

    //handle and update display
    function updateInputDisplay(input) {
        switch (input) {
            case 'Del':
                equation[equation.length - 1] = equation[equation.length - 1].slice(0, -1);
                currentInput.text(equation);
                break;
            case 'Clr':
                //reset state and clear display
                equation = [''];
                currentInput.html('&nbsp;');
                break;
            default:
                //update the display normally
                equation[equation.length - 1] += input;
                currentInput.text(equation);
                break;

        }
    }
    function calculateEquation() {
        console.log('calculate');
    }
})