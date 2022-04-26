//on page load
$(document).ready(function () {
    const currentInput = $('#current-input');
    currentInput.text(1);
    
    //inputs
    $('.operation').on('click', function () {
        console.log($(this).text());
    })
    $('.number').on('click', function () {
        console.log(JSON.parse($(this).text()));
    })
    $(document).on('keypress', function (event) {
        //fun fact: apparently converting an empty string into a number returns 0 instead of NaN
        if(!isNaN(Number(event.key)) && event.key !== ' ') {
            console.log('is a number');
        }
    })

    //handler
    function buttonHandler () {

    }
})