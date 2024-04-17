var today = new Date();
var current_day = today.getDate();
var current_month = today.getMonth() + 1;
var current_year = today.getFullYear();

function generate_calendar(year, month) {
  var first_date = new Date(year, month - 1, 1);
  var last_day = new Date(year, month, 0);
  var prev_month_last_day = new Date(year, month - 1, 0);
  var next_month_mergin = 6 - last_day.getDay();

  //Header of the calendar
  var calendar = '<table>';
  calendar += '<thead>';
  calendar += '<tr class="calendar_day">';
  calendar += '<th class="calendar_day">Sun</th>';
  calendar += '<th class="calendar_day">Mon</th>';
  calendar += '<th class="calendar_day">Tue</th>';
  calendar += '<th class="calendar_day">Wed</th>';
  calendar += '<th class="calendar_day">Thu</th>';
  calendar += '<th class="calendar_day">Fri</th>';
  calendar += '<th class="calendar_day">Sat</th>';
  calendar += '</tr>';
  calendar += '</thead>';

  //body of the calendar
  calendar += '<tbody>';
  var day_of_Week = first_date.getDay();
  var prev_next_day_class = 'calendar_basic';

  //day block start
  calendar += '<tr>';

  //fill the blank before the 1st date 
  for (var i = 0; i < day_of_Week; i++) {
    calendar += '<td class="'+ prev_next_day_class +'">' + (prev_month_last_day.getDate() - day_of_Week + 1 + i) + '</td>';
  }

  //fill the date and change the color of today's cell
  for (var day = 1; day <= last_day.getDate(); day++) {
    var cell_class = 'calendar_basic';
    if (year === current_year && month === current_month && day === current_day) {
      cell_class += 'today';
    }
   
    calendar += '<td class="' + cell_class + '">' + day + '</td>';
    if (first_date.getDay() === 6) {
      calendar += '</tr><tr>';
    }
    first_date.setDate(first_date.getDate() + 1);
  }

  //fill the blank after the last day
  if (first_date.getDay() !== 0 || next_month_mergin > 0) {
    for (var i = 0; i < next_month_mergin; i++) {
      calendar += '<td class="'+ prev_next_day_class +'">' + (i + 1) + '</td>';
    }
  }

  calendar += '</tr>';
  calendar += '</tbody>';
  calendar += '</table>';

  document.getElementById('calendar').innerHTML = calendar;
  var todayCell = document.querySelector('.calendar_basic.today');
    if (todayCell) {
        var todayCellNumber = todayCell.innerText;
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
  var englishMonth = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  var year_month_header = englishMonth + '/' + year;
  document.getElementById('year_month_header').innerHTML = year_month_header;
};

year_month(current_month, current_year);
generate_calendar(current_year, current_month);
day(current_day);
today(today);
