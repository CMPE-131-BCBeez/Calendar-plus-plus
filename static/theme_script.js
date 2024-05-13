function change_theme_by_cookie(){
    // document.cookie = "dark_mode=" + is_dark_mode + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=strict";
    let is_darkmode_by_cookie = document.cookie.split("; ");
    for(let i = 0; i < is_darkmode_by_cookie.length; i++){
        let cookie_parameter = is_darkmode_by_cookie[i].split("=");
        if (cookie_parameter[0] === "dark_mode"){
            if(cookie_parameter[1].trim() === "true"){
                let its_dark_mode = true;
                change_theme(its_dark_mode);
            }
            else{
                let its_dark_mode = false;
                change_theme(its_dark_mode);
            }
            break;
        }
    }
}

    function dark_mode(){
    if (window.location.pathname === "/style_settings") {
        let dark_mode_switch = document.getElementById('mode_switch_button');
        
        let is_darkmode_by_cookie = document.cookie.split("; ");
        for(let i = 0; i < is_darkmode_by_cookie.length; i++){
            let cookie_parameter = is_darkmode_by_cookie[i].split("=");
            if (cookie_parameter[0] === "dark_mode"){
                if(cookie_parameter[1].trim() === "true"){
                    if(!dark_mode_switch.checked){
                        dark_mode_switch.checked =! dark_mode_switch.checked;
                    }
                    let its_dark_mode = true;
                    change_theme(its_dark_mode);
                }
                else{
                    let its_dark_mode = false;
                    change_theme(its_dark_mode);
                }
                break;
            }
        }
        
        dark_mode_switch.addEventListener('change', function(){
            let is_dark_mode = dark_mode_switch.checked;
            change_theme(is_dark_mode);
        
            document.cookie = "dark_mode=" + is_dark_mode + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=Strict";
        });
    }
    else{
        change_theme_by_cookie();
    }
}

let black    = '#000000';
let half_black = 'rgba(0, 0, 0, 0.5)'
let white = '#FFFFFF';
let half_white = 'rgba(255, 255, 255, 0.5)'

let input_field  = document.querySelectorAll('.input-field ');

let form_input  = document.querySelectorAll('form input[type="text"], form input[type="password"],form input[type="email"],form input[type="tel"],form textarea');

let label  = document.querySelectorAll('label');

let paragraph  = document.querySelectorAll('p');

let form  = document.querySelectorAll('.form');

let black_buttons = document.querySelectorAll('.BlackButton');

let pagenation_buttons = document.querySelectorAll('#prev_month, #next_month, #prev_month, #next_month,#prev_week, #next_week,#prev_day, #next_day');

let white_buttons = document.querySelectorAll('.WhiteButton');

let cells = document.querySelectorAll('.monthly_view tbody th, .monthly_view tbody td');

let calendar_basic = document.querySelectorAll('.calendar_basic');

let calendar_basic_today = document.querySelectorAll('.today'); 

let today_cell = document.querySelectorAll('.today_cell');

let transparent = document.querySelectorAll('.transparent');

let event_cell = document.querySelectorAll('.event_cell');

let time_cell = document.querySelectorAll('.time_cell');

let dropdown_content = document.querySelectorAll('.dropdown-content');

let setting_content = document.querySelectorAll('.setting_content');

let flashes = document.querySelectorAll('flashes');

let time_col_body = document.querySelectorAll('time_col_body');

let day_col = document.querySelectorAll('day_col');

let event_select = document.querySelectorAll('event_select');


function change_theme(is_dark_mode){
    let body = document.body;
    if (is_dark_mode) {
        body.classList.remove('light_mode');
        body.classList.add('dark_mode');

        input_field.forEach(function(element){
            element.style.color = white;
            element.style.borderBottom = '1px solid' + white;
            element.addEventListener('focus', function() {
                element.style.borderBottom = '2px solid' + white; 
            });
            element.addEventListener('blur', function() {
                element.style.borderBottom = '1px solid' + white; 
            });
        });

        form_input.forEach(function(element){
            element.style.color = white;
        });

        label.forEach(function(element){
            element.style.color = white;
        });

        paragraph.forEach(function(element){
            element.style.color = white;
        });

        form.forEach(function(element){
            element.style.color = white;
        });

        black_buttons.forEach(function(element){
        element.style.color = black;
        element.style.backgroundColor  = white;
        });

        pagenation_buttons.forEach(function(element){
        element.style.color = white;
        });

        white_buttons.forEach(function(element){
            element.style.color = white;
            element.style.borderBottom = '1px solid' + white;  
        });  

        cells.forEach(function(element) {
        element.style.border = '2px solid ' + white;
        });

        calendar_basic.forEach(function(element) {
            element.style.backgroundColor = half_black;
            element.style.border = '1px solid' + white; 
            console.log("changing color!")
        });

        calendar_basic_today.forEach(function(element) {
            element.style.backgroundColor = half_black;
            element.style.border = '1px solid' + white; 
            console.log("changing color!")
        });

        today_cell.forEach(function(element){
            element.style.color = black;
            element.style.backgroundColor  = white;
            element.style.border = '4px solid ' + white;
        });

        transparent.forEach(function(element){
            element.style.backgroundColor  = half_black;
        });

        event_cell.forEach(function(element){
            element.style.backgroundColor  = half_black;
            element.style.border = '1px solid ' + half_white;
        });

        time_cell.forEach(function(element){
            element.style.color  = black;
            element.style.backgroundColor  = half_white;
            element.style.border = '1px solid ' + half_black;
        });

        dropdown_content.forEach(function(element){
            element.style.backgroundColor  = black;
            element.addEventListener('a', function() {
                element.style.color = white; 
            });
            element.addEventListener('a:hover ', function() {
                element.style.color =  'rgba(255, 255, 255, 0.2)'; 
            });
        });

        setting_content.forEach(function(element){
            element.style.color  = white;
            element.style.borderBottom = '1px solid ' + white;
        });

        flashes.forEach(function(element){
            element.style.color = black;
        });

        time_col_body.forEach(function(element){
            element.style.color = black;
            element.style.backgroundColor = half_white;
            element.style.border = '2px solid' + black;
        });

        day_col.forEach(function(element){
            element.style.color = white;
            element.style.backgroundColor = half_black;
            element.style.border = '2px solid' + white;
        });

        event_select.forEach(function(element){
            element.style.color = white;
            element.style.backgroundColor = half_black;
            element.style.border = '2px solid' + white;
        });
    } 
    else {
        body.classList.remove('dark_mode');
        body.classList.add('light_mode');

        input_field.forEach(function(element){
            element.style.color = black;
            element.style.borderBottom = '1px solid' + black;
            element.addEventListener('focus', function() {
                element.style.borderBottom = '2px solid' + black; 
            });
            element.addEventListener('blur', function() {
                element.style.borderBottom = '1px solid' + black; 
            });
        });

        form_input.forEach(function(element){
            element.style.color = black;
        });

        label.forEach(function(element){
            element.style.color = black;
        });

        paragraph.forEach(function(element){
            element.style.color = black;
        });

        black_buttons.forEach(function(element){
            element.style.color = white;
            element.style.backgroundColor  = black;
        });

        pagenation_buttons.forEach(function(element){
            element.style.color = black;
        });

        white_buttons.forEach(function(element){
            element.style.color = black;
            element.style.borderBottom = '1px solid' + black;  
        }); 

        cells.forEach(function(element) {
            element.style.border = '2px solid ' + black;
        });

        calendar_basic.forEach(function(element) {
            element.style.backgroundColor = half_white;
            element.style.border = '1px solid' + black; 
            console.log("changing color!")
        });

        calendar_basic_today.forEach(function(element) {
            element.style.backgroundColor = half_white;
            element.style.border = '1px solid' + black; 
             console.log("changing color!")
        });

        today_cell.forEach(function(element){
            element.style.color = white;
            element.style.backgroundColor  = black;
            element.style.border = '4px solid ' + black;
        });

        transparent.forEach(function(transparent){
            transparent.style.backgroundColor  = half_white;
        });

        event_cell.forEach(function(element){
            element.style.backgroundColor  = half_white;
            element.style.border = '1px solid ' + half_black;
        });

        time_cell.forEach(function(element){
            element.style.color  = white;
            element.style.backgroundColor  = half_black;
            element.style.border = '1px solid ' + half_white;
        });

        dropdown_content.forEach(function(element){
            element.style.backgroundColor  = white;
        });

        setting_content.forEach(function(element){
            element.style.color  = black;
            element.style.borderBottom = '1px solid ' + black;
        });

        flashes.forEach(function(element){
            element.style.color = white;
        });
        
        time_col_body.forEach(function(element){
            element.style.color = white;
            element.style.backgroundColor = half_black;
            element.style.border = '2px solid' + white;
        });

        day_col.forEach(function(element){
            element.style.color = black;
            element.style.backgroundColor = half_white
            element.style.border = '2px solid' + black;
        });

        event_select.forEach(function(element){
            element.style.color = black;
            element.style.backgroundColor = half_white;
            element.style.border = '2px solid' + black;
        });
    }
}



//monitor the dom on the html and change the style as the dom changes
document.addEventListener('DOMContentLoaded', function() {
    dark_mode();
});
