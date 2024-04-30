//get the start and end timestamp from url
function get_start_and_end() {
  const url = new URLSearchParams(window.location.search);
  const start = parseInt(url.get('start'));
  const end = parseInt(url.get('end'));
  return {start, end};
}

const start_and_end = get_start_and_end();
let beginning_day = start_and_end.start;
let afternoon = beginning_day + 43200;
let time = beginning_day *1000;
let date = new Date(time);
let this_year = parseInt(date.getFullYear());
let this_month = parseInt(date.getMonth() + 1); 
let this_day = parseInt(date.getDate());
let this_hours = parseInt(date.getHours());
let this_minutes = parseInt(date.getMinutes());
let this_seconds = parseInt(date.getSeconds());

function generate_am_daily_view(){
    let am_daily_view= '<table>';
    am_daily_view += '<tbody>';
    
    for (let i = 0; i < 12; i++) {
        am_daily_view += '<tr>';

        if(this_hours + i <= 9){
          time_num = " " + this_hours + i
        }
        else{
          time_num = this_hours + i;
        }
        am_daily_view += '<td class="time_cell">' + (time_num + ":00") + '</td>';
        am_daily_view += '<td class="event_cell">' + (" ") + '</td>';
        am_daily_view += '</tr>';
      }
    am_daily_view += '</tbody>';
    am_daily_view += '</table>';
    document.getElementById('am_daily_view').innerHTML = am_daily_view;
}

function generate_pm_daily_view(){
    let pm_daily_view = '<table>';
    pm_daily_view += '<tbody>';

    for (let i = 0; i < 12; i++) {
        pm_daily_view += '<tr>';
        pm_daily_view += '<td class="time_cell">' + (this_hours +12 + i + ":00") + '</td>';
        pm_daily_view += '<td class="event_cell">' + (" ") + '</td>';
        pm_daily_view += '</tr>';
      }
    pm_daily_view += '</tbody>';
    pm_daily_view += '</table>';
    document.getElementById('pm_daily_view').innerHTML = pm_daily_view;
};

function year_month_day(month, year, day){
  let englishMonth = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  let year_month_day_header = englishMonth + '/' + day + '/' + year;
  document.getElementById('year_month_day_header').innerHTML = year_month_day_header;
};

//implement the button going back to previous month
document.getElementById('prev_day').addEventListener('click', function() {
  let day = this_day - 1;
  let start_timestamp  = new Date(this_year, this_month - 1, day, 0, 0, 0).getTime()/1000;
  let end_timestamp  = start_timestamp + (24*60*60);
  let daily_view_url = '/daily_calendar?start='+ start_timestamp + '&end=' + end_timestamp;
  window.location.href = daily_view_url;
  window.daily_view_url = daily_view_url;
});

//implement the button going forward to next month
document.getElementById('next_day').addEventListener('click', function() {
  let day = this_day + 1;
  let start_timestamp  = new Date(this_year, this_month - 1, day, 0, 0, 0).getTime()/1000;
  let end_timestamp  = start_timestamp + (24*60*60);
  let daily_view_url = '/daily_calendar?start='+ start_timestamp + '&end=' + end_timestamp;
  window.location.href = daily_view_url;
  window.daily_view_url = daily_view_url;
});

document.getElementById('today_button_daily').addEventListener('click', function() {
  let today = new Date();
  let today_year = today.getFullYear();
  let today_month = today.getMonth() + 1;
  let today_day = today.getDate();
  let start_timestamp  = new Date(today_year, today_month - 1, today_day, 0, 0, 0).getTime()/1000;
  let end_timestamp  = start_timestamp + (24*60*60);
  let daily_view_url = '/daily_calendar?start='+ start_timestamp + '&end=' + end_timestamp;
  window.location.href = daily_view_url;
  window.daily_view_url = daily_view_url;
});

generate_am_daily_view();
generate_pm_daily_view();
year_month_day(this_month, this_year, this_day);