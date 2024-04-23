let mode_button = document.getElementById('mode_switch_button');

mode_button.addEventListener('click', function() {
    let body = document.body;
    let isDarkMode = body.classList.contains('dark_mode');
    let cells = document.querySelectorAll('.monthly_view tbody th, .monthly_view tbody td');
    let borderColor = isDarkMode ? '#000000' : '#FFFFFF';

    if (isDarkMode) {
        body.classList.remove('dark_mode');
        body.classList.add('light_mode');
    } 
    else {
        body.classList.remove('light_mode');
        body.classList.add('dark_mode');
    }

    cells.forEach(function(cell) {
        cell.style.border = '2px solid ' + borderColor;
    });
});

function changeBorderColors() {
    let bodyClassList = document.body.classList;
    let isDarkMode = bodyClassList.contains('dark_mode');

    // tbody要素のセルを取得
    
}
