//get the start and end timestamp from url
function get_start_and_end() {
  const url = new URLSearchParams(window.location.search);
  const start = parseInt(url.get('start'));
  const end = parseInt(url.get('end'));
  return { start, end };
}

const start_and_end = get_start_and_end();
let beginning_day = start_and_end.start;
let afternoon = beginning_day + 43200;
let time = beginning_day *1000;

let date = new Date(unixTimestampMilliseconds);

let year = parseInt(date.getFullYear());
let month = parseInt(date.getMonth() + 1); 
let day = parseInt(date.getDate());
let hours = parseInt(date.getHours());
let minutes = parseInt(date.getMinutes());
let seconds = parseInt(date.getSeconds());

function generate_am_daily_view(beginning_day){
    let am_daily_view= '<table>';
    am_daily_view += '<tbody>';

    for (let i = 0; i < 12; i++) {
        am_daily_view += '<tr>';
        am_daily_view += '<td>' + (hours + i) + '</td>';
        am_daily_view += '<td>' + ("event") + '</td>';
        am_daily_view += '</tr>';
      }
    am_daily_view += '</tbody>';
    am_daily_view += '</table>';
    document.getElementById('am_daily_view').innerHTML = am_daily_view;
}


function generate_pm_daily_view(afternoon){
    let pm_daily_view = '<table>';
    pm_daily_view += '<tbody>';

    for (let i = 0; i < 12; i++) {
        pm_daily_view += '<tr>';
        pm_daily_view += '<td>' + (hours + i) + '</td>';
        pm_daily_view += '<td>' + ("event") + '</td>';
        pm_daily_view += '</tr>';
      }
    pm_daily_view += '</tbody>';
    pm_daily_view += '</table>';
    document.getElementById('pm_daily_view').innerHTML = pm_daily_view;
};

generate_am_daily_view(beginning_day);
generate_pm_daily_view(afternoon);