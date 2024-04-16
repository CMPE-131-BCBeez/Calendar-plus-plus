function generate_calendar(year, month) {
  var date = new Date(year, month - 1, 1);
  var last_day = new Date(year, month, 0).getDate();
  var englishMonth = date.toLocaleString('en', { month: 'long' });
  var prev_month_last_day = new Date(year, month - 2, 0);
  var next_month_first_day = new Date(year, month, 1);

  var calendar = '<table>';
  calendar += '<thead>';
  calendar += '<tr><th colspan="7" class="calendar_h1">' + englishMonth + '/' + year+ '</th></tr>';
  calendar += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
  calendar += '</thead>';

  var day_of_Week = date.getDay();
  calendar += '<tr>';
  for (var i = 0; i < day_of_Week; i++) {
    calendar += '<td>' + (prev_month_last_day.getDate() - day_of_Week + i + 1) + '</td>';
  }

  for (var day = 1; day <= last_day; day++) {
    calendar += '<td>' + day + '</td>';
      if (date.getDay() === 6) {
        calendar += '</tr><tr>';
      }
      date.setDate(date.getDate() + 1);
  }

  if (date.getDay() !== 0) {
      for (var i = date.getDay(); i < 7; i++) {
        calendar += '<td>' + (next_month_first_day.getDate() + i + 1) + '</td>';
      }
  }
  calendar += '</tr>';

  calendar += '</table>';
  document.getElementById('calendar').innerHTML = calendar;
}

document.getElementById('prev_month').addEventListener('click', function() {
current_month--; 
  if (current_month === 0) {
      current_year--; 
      current_month = 12;
  }
  generate_calendar(current_year, current_month); 
});

document.getElementById('next_month').addEventListener('click', function() {
  current_month++; 
  if (current_month === 13) {
      current_year++;
      current_month = 1;
  }
  generate_calendar(current_year, current_month);
});

var today = new Date();
var current_year = today.getFullYear();
var current_month = today.getMonth() + 1;
generate_calendar(current_year, current_month);