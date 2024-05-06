document.getElementById('mode_switch_button').addEventListener('click', function() {
    
    let body = document.body;
    let is_darkMode = body.classList.contains('dark_mode');
    
    if (is_darkMode) {
        body.classList.remove('dark_mode');
        body.classList.add('light_mode');
    } 
    else {
        body.classList.remove('light_mode');
        body.classList.add('dark_mode');
    }

    let black_buttons = document.querySelectorAll('.BlackButton');
    let black_buttons_text_color = is_darkMode ? '#FFFFFF' : '#000000';
    let black_buttons_color = is_darkMode ? '#000000' : '#FFFFFF';
    black_buttons.forEach(function(black_button){
        black_button.style.color = black_buttons_text_color;
        black_button.style.background = black_buttons_color;
    });

    let pagenation_buttons = document.querySelectorAll('#prev_month, #next_month');
    let pagenation_buttonss_text_color = is_darkMode ? '#000000' : '#FFFFFF';
    pagenation_buttons.forEach(function(pagenation_buttons){
        pagenation_buttons.style.color = pagenation_buttonss_text_color;
    });
    

    let white_buttons = document.querySelectorAll('.WhiteButton');
    let white_buttons_text_color = is_darkMode ? '#000000' : '#FFFFFF';
    let white_buttons_color = is_darkMode ? '#FFFFFF' : '#000000';
    white_buttons.forEach(function(white_button){
        white_button.style.color = white_buttons_text_color;
        white_button.style.background = white_buttons_color;
    });

    let cells = document.querySelectorAll('.monthly_view tbody th, .monthly_view tbody td');
    let borderColor = is_darkMode ? '#000000' : '#FFFFFF';
    cells.forEach(function(cell) {
        cell.style.border = '2px solid ' + borderColor;
    });

    let today = document.querySelectorAll('.today_cell');
    let today_text_color = is_darkMode ? '#FFFFFF' : '#000000';
    let today_color = is_darkMode ? '#000000' : '#FFFFFF';
    today.forEach(function(todays){
        todays.style.color = today_text_color;
        todays.style.background = today_color;
        todays.style.border = '4px solid ' + borderColor;

    });
});

    
