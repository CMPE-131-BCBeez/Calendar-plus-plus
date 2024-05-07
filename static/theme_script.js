// document.getElementById('mode_switch_button').addEventListener('click', function() {
// }
let is_dark_mode;


//get the is_dark_mode state from backend and chane the variable here
function get_theme_state() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/dark_mode', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const response = JSON.parse(xhr.responseText);
            is_dark_mode = response.is_dark_mode;
        }
    };
    xhr.send();
}

// document.addEventListener("DOMContentLoaded", function() {
//     change_theme(is_dark_mode)
// });

// document.getElementById('mode_switch_button').addEventListener('click', function() {
//     change_theme(is_dark_mode)
// });

function change_theme(is_dark_mode){
    let body = document.body;
    
    if (is_dark_mode) {
        body.classList.remove('dark_mode');
        body.classList.add('light_mode');

        let input_field  = document.querySelectorAll('.input-field ');
        let input_field_text_color = '#FFFFFF';
        let input_field_line_color = '#FFFFFF';
        input_field.forEach(function(element){
            element.style.color = input_field_text_color;
            element.style.borderBottom = '1px solid' + input_field_line_color;
            element.addEventListener('focus', function() {
                element.style.borderBottom = '2px solid' + input_field_line_color; 
            });
            element.addEventListener('blur', function() {
                element.style.borderBottom = '1px solid' + input_field_line_color; 
            });
        });

        let form_input  = document.querySelectorAll('form input[type="text"], form input[type="password"],form input[type="email"],form input[type="tel"],form textarea');
        let form_input_color_text_color = '#FFFFFF';
        form_input.forEach(function(element){
            element.style.color = form_input_color_text_color;
        });

        let label  = document.querySelectorAll('label');
        let label_text_color_text_color = '#FFFFFF';
        label.forEach(function(element){
            element.style.color = label_text_color_text_color;
        });
        
        let black_buttons = document.querySelectorAll('.BlackButton');
        let black_buttons_text_color = '#FFFFFF';
        let black_buttons_color = '#000000';
        black_buttons.forEach(function(element){
            element.style.color = black_buttons_text_color;
            element.style.backgroundColor  = black_buttons_color;
        });

        let pagenation_buttons = document.querySelectorAll('#prev_month, #next_month, #prev_day, #next_day');
        let pagenation_buttonss_text_color = '#000000';
        pagenation_buttons.forEach(function(element){
            element.style.color = pagenation_buttonss_text_color;
        });

        let white_buttons = document.querySelectorAll('.WhiteButton');
        let white_buttons_text_color = '#000000';
        let white_buttons_line_color = '#000000';
        white_buttons.forEach(function(element){
            element.style.color = white_buttons_text_color;
            element.style.borderBottom = '1px solid' + white_buttons_line_color;  
        }); 

        let cells = document.querySelectorAll('.monthly_view tbody th, .monthly_view tbody td');
        let borderColor = '#000000';
        cells.forEach(function(element) {
            element.style.border = '2px solid ' + borderColor;
        });

        let  calendar_basic = document.querySelectorAll('.calendar_basic');
        let calendar_basic_color = 'rgba(255, 255, 255, 0.5)';
        calendar_basic.forEach(function(element) {
            element.style.backgroundColor = calendar_basic_color;
        });

        let  today = document.querySelectorAll('.today');
        let today_color = 'rgba(255, 255, 255, 0.5)';
        today.forEach(function(element) {
            element.style.backgroundColor = today_color;
        });

        let today_cell = document.querySelectorAll('.today_cell');
        let today_celly_text_color = '#FFFFFF';
        let today_cell_color = '#000000';
        today_cell.forEach(function(element){
            element.style.color = today_celly_text_color;
            element.style.backgroundColor  = today_cell_color;
            element.style.border = '4px solid ' + borderColor;
        });

        let transparent = document.querySelectorAll('.transparent');
        let transparent_color = 'rgba(255, 255, 255, 0.5)';
        transparent.forEach(function(transparent){
            transparent.style.backgroundColor  = transparent_color;
        });

        let event_cell = document.querySelectorAll('.event_cell');
        let event_cell_color = 'rgba(255, 255, 255, 0.5)';
        let event_cell_borderline_color = 'rgba(0, 0, 0, 0.5)';
        event_cell.forEach(function(element){
            element.style.backgroundColor  = event_cell_color;
            element.style.border = '1px solid ' + event_cell_borderline_color;
        });

        let time_cell = document.querySelectorAll('.time_cell');
        let time_cell_color = 'rgba(0, 0, 0, 0.5)';
        let time_cell_borderline_color = 'rgba(255, 255, 255, 0.5)';
        time_cell.forEach(function(element){
            element.style.backgroundColor  = time_cell_color;
            element.style.border = '1px solid ' + time_cell_borderline_color;
        });

        let dropdown_content = document.querySelectorAll('.dropdown-content');
        let dropdown_content_color = 'rgba(255, 255, 255, 1)';
        dropdown_content.forEach(function(element){
            element.style.backgroundColor  = dropdown_content_color;
        });
    } 
    else {
        body.classList.remove('light_mode');
        body.classList.add('dark_mode');

        let input_field  = document.querySelectorAll('.input-field ');
        let input_field_text_color = '#FFFFFF';
        let input_field_line_color = '#FFFFFF';
        input_field.forEach(function(element){
            element.style.color = input_field_text_color;
            element.style.borderBottom = '1px solid' + input_field_line_color;
            element.addEventListener('focus', function() {
                element.style.borderBottom = '2px solid' + input_field_line_color; 
            });
            element.addEventListener('blur', function() {
                element.style.borderBottom = '1px solid' + input_field_line_color; 
            });
        });

        let form_input  = document.querySelectorAll('form input[type="text"], form input[type="password"],form input[type="email"],form input[type="tel"],form textarea');
        let form_input_color_text_color = '#FFFFFF';
        form_input.forEach(function(element){
            element.style.color = form_input_color_text_color;
        });

        let label  = document.querySelectorAll('label');
        let label_text_color_text_color = '#FFFFFF';
        label.forEach(function(element){
            element.style.color = label_text_color_text_color;
        });

        let form  = document.querySelectorAll('.form');
        let form_text_color_text_color = '#FFFFFF';
        form.forEach(function(element){
            element.style.color = form_text_color_text_color;
        });

        let black_buttons = document.querySelectorAll('.BlackButton');
        let black_buttons_text_color = '#000000';
        let black_buttons_color = '#FFFFFF';
        black_buttons.forEach(function(element){
        element.style.color = black_buttons_text_color;
        element.style.backgroundColor  = black_buttons_color;
        });

        let pagenation_buttons = document.querySelectorAll('#prev_month, #next_month, #prev_day, #next_day');
        let pagenation_buttonss_text_color = '#FFFFFF';
        pagenation_buttons.forEach(function(element){
        element.style.color = pagenation_buttonss_text_color;
        });

        let white_buttons = document.querySelectorAll('.WhiteButton');
        let white_buttons_text_color = '#FFFFFF';
        let white_buttons_line_color = '#FFFFFF';
        white_buttons.forEach(function(element){
            element.style.color = white_buttons_text_color;
            element.style.borderBottom = '1px solid' + white_buttons_line_color;  
        });  

        let cells = document.querySelectorAll('.monthly_view tbody th, .monthly_view tbody td');
        let borderColor = '#FFFFFF';
        cells.forEach(function(element) {
        element.style.border = '2px solid ' + borderColor;
        });

        let  calendar_basic = document.querySelectorAll('.calendar_basic');
        let calendar_basic_color = 'rgba(0, 0, 0, 0.5)';
        calendar_basic.forEach(function(element) {
            element.style.backgroundColor = calendar_basic_color;
        });

        let today = document.querySelectorAll('.today');
        let today_color = 'rgba(0, 0, 0, 0.5)';
        today.forEach(function(element) {
            element.style.backgroundColor = today_color;
        });

        let today_cell = document.querySelectorAll('.today_cell');
        let today_cell_text_color = '#000000';
        let today_cell_color = '#FFFFFF';
        today_cell.forEach(function(element){
            element.style.color = today_cell_text_color;
            element.style.backgroundColor  = today_cell_color;
            element.style.border = '4px solid ' + borderColor;
        });

        let transparent = document.querySelectorAll('.transparent');
        let transparent_color = 'rgba(0, 0, 0, 0.5)';
        transparent.forEach(function(element){
            element.style.backgroundColor  = transparent_color;
        });

        let event_cell = document.querySelectorAll('.event_cell');
        let event_cell_color = 'rgba(0, 0, 0, 0.5)';
        let event_cell_borderline_color = 'rgba(255, 255, 255, 0.5)';
        event_cell.forEach(function(element){
            element.style.backgroundColor  = event_cell_color;
            element.style.border = '1px solid ' + event_cell_borderline_color;
        });

        let time_cell = document.querySelectorAll('.time_cell');
        let time_cell_color = 'rgba(255, 255, 255, 0.5)';
        let time_cell_borderline_color = 'rgba(0, 0, 0, 0.5)';
        time_cell.forEach(function(element){
            element.style.backgroundColor  = time_cell_color;
            element.style.border = '1px solid ' + time_cell_borderline_color;
        });

        let dropdown_content = document.querySelectorAll('.dropdown-content');
        let dropdown_content_color = 'rgba(0, 0, 0, 1)';
        let dropdown_content_background_color = 'rgba(255, 255, 255, 1)';
        dropdown_content.forEach(function(element){
            element.style.backgroundColor  = dropdown_content_color;
            element.addEventListener('mouseenter', function() {
                element.style.color =  dropdown_content_color; 
            });
            element.addEventListener('mouseleave', function() {
                element.style.color = ''; 
            });
        });
    }
}
function send_theme_state(is_dark_mode) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/dark_mode', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const themeState = { is_dark_mode: is_dark_mode };
    xhr.send(JSON.stringify(themeState));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
        }
    };
}