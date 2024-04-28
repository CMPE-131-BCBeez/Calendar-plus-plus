let today = new Date();
let current_day = today.getDate();
let current_month = today.getMonth() + 1;
let current_year = today.getFullYear();
const this_day = current_day;
const this_month = current_month;
const this_year = current_year;
let first_date_on_calendar = 0;
let last_date_on_calendar = 0;


function generate_calendar(year, month) {
  let first_date = new Date(year, month - 1, 1);
  current_day = first_date;
  let last_day = new Date(year, month, 0);
  let prev_month_last_day = new Date(year, month - 1, 0);
  let next_month_mergin = 6 - last_day.getDay();
  let count_colmn = 0;

  if(first_date.getDay() === 0){  
    first_date_on_calendar = first_date;
  }
  else{
    first_date_on_calendar = prev_month_last_day;
  }

    last_date_on_calendar = next_month_mergin;

  //Header of the calendar
let monthly_calendar = '<table>';
  monthly_calendar += '<thead>';
  monthly_calendar += '<tr class="calendar_day">';
  monthly_calendar += '<th class="calendar_day">Sun</th>';
  monthly_calendar += '<th class="calendar_day">Mon</th>';
  monthly_calendar += '<th class="calendar_day">Tue</th>';
  monthly_calendar += '<th class="calendar_day">Wed</th>';
  monthly_calendar += '<th class="calendar_day">Thu</th>';
  monthly_calendar += '<th class="calendar_day">Fri</th>';
  monthly_calendar += '<th class="calendar_day">Sat</th>';
  monthly_calendar += '</tr>';
  monthly_calendar += '</thead>';

  //body of the calendar
  monthly_calendar += '<tbody>';
  let day_of_Week = first_date.getDay();
  let prev_next_day_class = 'calendar_basic';

  //day block start
  monthly_calendar += '<tr>';
  count_colmn++;
  current_day = prev_month_last_day.getDate() - day_of_Week + 1;
  //fill the blank before the 1st date 
  for (let i = 0; i < day_of_Week; i++) {
    monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (prev_month_last_day.getDate() - day_of_Week + 1 + i) + '</td>';
    current_day++;
    if(first_date.getDay() !== 0){
      first_date_on_calendar--;
    }
  }
  
  current_day = 1;
  //fill the date and change the color of today's cell
  for (let day = 1; day <= last_day.getDate(); day++) {
    let cell_class = 'calendar_basic';
    if (year === this_year && month === this_month && day === this_day) {
      cell_class = 'today';
    }
    else{
      cell_class = 'calendar_basic';
    }

    monthly_calendar += '<td class="' + cell_class + '">' + day + '</td>';
    if (first_date.getDay() === 6) {
      monthly_calendar += '</tr><tr>';
      count_colmn++;
    }
    first_date.setDate(first_date.getDate() + 1);
    current_day++;
  }
  
  current_day = 1;
  //fill the blank after the last day
  if (last_day.getDay() !== 6 || next_month_mergin > 0) {
    for (let i = 0; i < next_month_mergin; i++) {
      monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1) + '</td>';
      current_day++;
    }
    monthly_calendar += '</tr>';
  }

    if(count_colmn < 6){
      monthly_calendar += '<tr>'
      for(let i = next_month_mergin; i < next_month_mergin + 7; i++){
        monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1) + '</td>';
        current_day++;
      }
      monthly_calendar += '</tr>';
    }

    if(last_day.getDay === 6){
      last_date_on_calendar = last_day;
    }

    else{
      last_date_on_calendar--;
    }

  monthly_calendar += '</tbody>';
  monthly_calendar += '</table>';

  document.getElementById('monthly_calendar').innerHTML = monthly_calendar;
  
  let todayCell = document.querySelector('.today');
    if (todayCell) {
      let todayCellNumber = todayCell.innerText;
        todayCell.innerHTML = '<span class="today_cell">' + todayCellNumber + '</span>';
}
}

//implement the button going back to previous month
document.getElementById('prev_month').addEventListener('click', function() {
  current_month--;
  if (current_month === 0) {
    current_year--;
    current_month = 12;
  }
  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
});

//implement the button going forward to next month
document.getElementById('next_month').addEventListener('click', function() {
  current_month++;
  if (current_month === 13) {
    current_year++;
    current_month = 1;
  }
  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
});

function year_month(month, year){
  let englishMonth = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  let year_month_header = englishMonth + '/' + year;
  document.getElementById('year_month_header').innerHTML = year_month_header;
};

//go to the month that have today
document.getElementById('today_button').addEventListener('click', function() {
  current_month = today.getMonth() + 1;
  current_year = today.getFullYear();
  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
});

year_month(current_month, current_year);
generate_calendar(current_year, current_month);

//get timestamp for first date and last date of the calendar
function get_timestamp_monthly(year,month,timestamp_start_day, timestamp_last_day){
  let first_date,last_date;
  if(timestamp_start_day > 1){
    first_date = new Date(year, month - 2, timestamp_start_day);
  }
  else{
    first_date = new Date(year, month - 1, timestamp_start_day);
  }

  if(timestamp_last_day >= 28){
    last_date = new Date(year, month - 1, timestamp_last_day);
  }
  else{
    last_date = new Date(year, month, timestamp_last_day);
  }
  let start_timestamp = first_date.getTime() / 1000; 
  let end_timestamp = last_date.getTime() / 1000;

  return {
    start: start_timestamp,
    end: end_timestamp
  };
}

//make the cell to button
document.querySelectorAll('.calendar_basic').forEach(cell => {
  cell.addEventListener('click', function() {
    let day = this.innerText;
    let start_timestamp  = new Date(current_year, current_month - 1, day).getTime()/100;
    let end_timestamp  = start_timestamp + (24*60*60);
    let daily_view_url = '/daily_calendar?start='+ start_timestamp + '&end=' + end_timestamp;
    window.location.href = daily_view_url;
    window.daily_view_url = daily_view_url;
  });
});

//function for lendering event(get data from api)
function event_render(year,month,timestamp_start_day, timestamp_last_day){
  let time_stamp = get_timestamp_monthly(year, month, timestamp_start_day, timestamp_last_day);

  fetch('/api/events?start_time=' + time_stamp.start + '&end_time=' + time_stamp.end) //insert start time and end time to url for end point
  .then(response => response.json()) 
  .then(data => {
    addEventsToCalendarCells(data);
  })
  .catch(error => {
    console.error('Error occured during getting data:', error);
  });

  function addEventsToCalendarCells(data) {
    for (const date in data) {
      if (data.hasOwnProperty(current_day)) {
        const event = data[date];
        const startTime = event.start_time;
        const title = event.title;
        const cell = document.getElementById(current_day); 
        const cell_class ='';
        if (cell === current_day) {
          cell_class = 'events';
          cell.innerHTML += '<br>${startTime}: ${title}'; 
        }
      }
    }
  }
};

//load the get_location_and_send() when it finished loading page

document.addEventListener('DOMContentLoaded', function() {
  get_location_and_send();
  event_render(current_year, current_month,first_date_on_calendar, last_date_on_calendar); 
});
