let today = new Date();
let event_day_cell = today.getDate();
let current_month = today.getMonth() + 1;
let current_year = today.getFullYear();
const this_day = event_day_cell;
const this_month = current_month;
const this_year = current_year;
let first_date_on_calendar = 0;
let last_date_on_calendar = 0;
let monthly_events = {};

//get timestamp for first date and last date of the calendar
function get_timestamp_monthly(year,month,timestamp_start_day, timestamp_last_day){
  let first_date,last_date;
  if(timestamp_start_day > 1){
    first_date = new Date(Date.UTC(year, month - 2, timestamp_start_day)).getTime();
  }
  else{
    first_date = new Date(Date.UTC(year, month - 1, timestamp_start_day)).getTime();
  }

    last_date = new Date(Date.UTC(year, month, timestamp_last_day)).getTime();
  
  let utc_start_timestamp = first_date / 1000;
  let utc_end_timestamp = last_date / 1000;

  return {
    start: utc_start_timestamp,
    end: utc_end_timestamp
  };
}

function get_timestamp_for_event(current_year, current_month, event_day_cell) {
  let localDate = new Date(Date.UTC(current_year, current_month - 1, event_day_cell)).getTime();
  let = UTC_timestamp_for_event = localDate / 1000;
  return UTC_timestamp_for_event;
}

let timestamp_for_event = get_timestamp_for_event(current_year, current_month, event_day_cell);

const timestamp = get_timestamp_monthly(current_year, current_month, first_date_on_calendar, last_date_on_calendar);
const timestamp_for_first_date_on_calendar = timestamp.start;
const timestamp_for_last_date_on_calendar = timestamp.end;

query_events(timestamp_for_first_date_on_calendar, timestamp_for_last_date_on_calendar)
  .then(data => {
    monthly_events = data;
  })
  .catch(error => {
    console.error("Failed to get event data:", error);
    throw error; 
});

let event_for_this_day = monthly_events[get_timestamp_for_event(current_year, current_month, event_day_cell)];

function generate_calendar(year, month) {
  let first_date = new Date(year, month - 1, 1);
  let last_day = new Date(year, month, 0);
  let prev_month_last_day = new Date(year, month - 1, 0);
  let next_month_mergin = 6 - last_day.getDay();
  let count_colmn = 0;
  let day_of_Week = first_date.getDay();
  let prev_next_day_class = 'calendar_basic';
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

  //day block start
  monthly_calendar += '<tr>';
  count_colmn++;

  //fill the blank before the 1st date 
  for (let i = 0; i < day_of_Week; i++) {
    
    monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (prev_month_last_day.getDate() - day_of_Week + 1 + i);
    monthly_calendar += '<div>';
    monthly_calendar += '<ul>';
    if (event_for_this_day) {
    for (envents of event_for_this_day){
        monthly_calendar += '<li>' + envents[start_time] + envents[title] + '</li>';
      }
    }
    monthly_calendar += '</ul>';
    monthly_calendar += '</div>';
    monthly_calendar += '</td>';
    event_day_cell++;
  }
  
  event_day_cell = 1;
  //fill the date and change the color of today's cell
  for (let day = 1; day <= last_day.getDate(); day++) {
    let cell_class = 'calendar_basic';
    if (year === this_year && month === this_month && day === this_day) {
      cell_class = 'today';
    }
    else{
      cell_class = 'calendar_basic';
    }
    monthly_calendar += '<td class="' + cell_class + '">' + day;
    monthly_calendar += '<div>';
    monthly_calendar += '<ul>';
    if (event_for_this_day) {
    for (envents of event_for_this_day){
        monthly_calendar += '<li>' + envents[start_time] + envents[title] + '</li>';
      }
    }
    monthly_calendar += '</ul>';
    monthly_calendar += '</div>';
    monthly_calendar += '</td>';

    if (first_date.getDay() === 6) {
      monthly_calendar += '</tr><tr>';
      count_colmn++;
    }
    first_date.setDate(first_date.getDate() + 1);
    event_day_cell++;
  }
  
  event_day_cell = 1;
  //fill the blank after the last day
  if (last_day.getDay() !== 6 || next_month_mergin > 0) {
    for (let i = 0; i < next_month_mergin; i++) {
      monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1);
      monthly_calendar += '<div>';
      monthly_calendar += '<ul>';
      if (event_for_this_day) {
      for (envents of event_for_this_day){
          monthly_calendar += '<li>' + envents[start_time] + envents[title] + '</li>';
        }
      }
      monthly_calendar += '</ul>';
      monthly_calendar += '</div>';
      monthly_calendar += '</td>';
      event_day_cell++;
    }
    monthly_calendar += '</tr>';
  }

  if(count_colmn < 6 || last_day.getDay() === 6){
    for(let i = next_month_mergin; i < next_month_mergin + 7; i++){
      monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1);
      monthly_calendar += '<div>';
      monthly_calendar += '<ul>';
      if (event_for_this_day) {
      for (envents of event_for_this_day){
          monthly_calendar += '<li>' + envents[start_time] + envents[title] + '</li>';
        }
      }
      monthly_calendar += '</ul>';
      monthly_calendar += '</div>';
      monthly_calendar += '</td>';
      event_day_cell++;
    }
    monthly_calendar += '</tr>';
    last_date_on_calendar +=  7;
    count_colmn++;
  }

  if(count_colmn < 6){
    monthly_calendar += '<tr>'
    for(let i = next_month_mergin + 7; i < next_month_mergin + 14; i++){
      monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1);
      monthly_calendar += '<div>';
    monthly_calendar += '<ul>';
    if (event_for_this_day) {
    for (envents of event_for_this_day){
        monthly_calendar += '<li>' + envents[start_time] + envents[title] + '</li>';
      }
    }
    monthly_calendar += '</ul>';
    monthly_calendar += '</div>';
      monthly_calendar += '</td>';
      event_day_cell++;
  }
  monthly_calendar += '</tr>';
  last_date_on_calendar +=  7;
  count_colmn++;
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
  // location.reload();  
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
  // location.reload();
});

function year_month(month, year){
  let englishMonth = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  let year_month_header = englishMonth + '/' + year;
  document.getElementById('year_month_header').innerHTML = year_month_header;
}

//go to the month that have today
document.getElementById('today_button_month').addEventListener('click', function() {
  current_month = today.getMonth() + 1;
  current_year = today.getFullYear();
  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
  // location.reload();
});

year_month(current_month, current_year);
generate_calendar(current_year, current_month);

//make the cell to button
document.querySelectorAll('.calendar_basic').forEach(cell => {
  cell.addEventListener('click', function() {
    let day = this.innerText;
    let start_timestamp  = new Date(current_year, current_month - 1, day, 0, 0, 0).getTime()/1000;
    let end_timestamp  = start_timestamp + (24*60*60);
    let daily_view_url = '/daily_calendar?start='+ start_timestamp + '&end=' + end_timestamp;
    window.location.href = daily_view_url;
    window.daily_view_url = daily_view_url;
  });
});
