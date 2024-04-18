let today = new Date();
let current_day = today.getDate();
let current_month = today.getMonth() + 1;
let current_year = today.getFullYear();

function generate_calendar(year, month) {
  let first_date = new Date(year, month - 1, 1);
  let last_day = new Date(year, month, 0);
  let prev_month_last_day = new Date(year, month - 1, 0);
  let next_month_mergin = 6 - last_day.getDay();

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

  //fill the blank before the 1st date 
  for (let i = 0; i < day_of_Week; i++) {
    monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (prev_month_last_day.getDate() - day_of_Week + 1 + i) + '</td>';
  }

  //fill the date and change the color of today's cell
  for (let day = 1; day <= last_day.getDate(); day++) {
    let cell_class = 'calendar_basic';
    if (year === current_year && month === current_month && day === current_day) {
      cell_class += 'today';
    }
   
    monthly_calendar += '<td class="' + cell_class + '">' + day + '</td>';
    if (first_date.getDay() === 6) {
      monthly_calendar += '</tr><tr>';
    }
    first_date.setDate(first_date.getDate() + 1);
  }

  //fill the blank after the last day
  if (first_date.getDay() !== 0 || next_month_mergin > 0) {
    for (let i = 0; i < next_month_mergin; i++) {
      monthly_calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1) + '</td>';
    }
  }

  monthly_calendar += '</tr>';
  monthly_calendar += '</tbody>';
  monthly_calendar += '</table>';

  document.getElementById('monthly_calendar').innerHTML = monthly_calendar;
  let todayCell = document.querySelector('.calendar_basic.today');
    if (todayCell) {
      let todayCellNumber = todayCell.innerText;
        todayCell.innerHTML = '<span>' + todayCellNumber + '</span>';
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

year_month(current_month, current_year);
generate_calendar(current_year, current_month);
document.querySelectorAll('.calendar_basic').forEach(cell => {
  cell.addEventListener('click', function() {
    let day = this.innerText;
    // var month = current_month;
    // var year = current_year;

    let url = '/daily_calendar?date=' + current_year + '-' + current_month + '-' + day;

    window.location.href = url;
  });
});

day(current_day);
today(today);