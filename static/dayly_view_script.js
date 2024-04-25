let url = window.daily_view_url; //example(http://127.0.0.1:5000/daily_calendar?date=2024-4-1
let parts = url.split("-"); //sprit url with "/"
let year = parseInt(parts[0]); //
let month = parseInt(parts[1]); //
let day = parseInt(parts[2]); // 日はURLの7番目の要素

let midnight_timestamp = today.getTime(); // current_dayをtodayに修正
let beginning_day = Math.floor(midnight_timestamp / 1000);
let afternoon = beginning_day + 43200;

function generate_am_daily_view(beginning_day){
    let am_daily_view= '<table>';
    am_daily_view += '<tbody>';

    for (let i = 0; i < 12; i++) {
        am_daily_view += '<tr>';
        am_daily_view += '<td>' + (beginning_day + i * 3600) + '</td>';
        am_daily_view += '<td>' + (beginning_day) + '</td>';
        am_daily_view += '</tr>';
      }
    am_daily_view += '</tbody>';
    am_daily_view += '</table>';
    return am_daily_view;
}


function generate_pm_daily_view(afternoon){
    let pm_daily_view = '<table>';
    pm_daily_view += '<tbody>';

    for (let i = 0; i < 12; i++) {
        pm_daily_view += '<tr>';
        pm_daily_view += '<td>' + (afternoon + i * 3600) + '</td>';
        pm_daily_view += '<td>' + (afternoon) + '</td>';
        pm_daily_view += '</tr>';
      }
    pm_daily_view += '</tbody>';
    pm_daily_view += '</table>';
    return pm_daily_view;
};

let am_view = generate_am_daily_view(beginning_day);
let pm_view = generate_pm_daily_view(afternoon);