var startDate = new Date();
var selectedCell = null;

function generateWeeklyCalendar(startDate) {
  var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var table = document.getElementById('calendar');

  var rows = table.getElementsByTagName('tr');
  for (var i = rows.length - 1; i > 0; i--) {
    table.removeChild(rows[i]);
  }

  var sundayDate = new Date(startDate);
  sundayDate.setDate(sundayDate.getDate() - sundayDate.getDay());

  for (var i = 0; i < 7; i++) {
    var date = new Date(sundayDate);
    date.setDate(date.getDate() + i);
    var day = daysOfWeek[i];
    var dateText = date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    var th = document.getElementById(daysOfWeek[i].toLowerCase());
    th.innerHTML = '<div class="dayInfo"><div class="dayName">' + day + '</div><div class="dateNumber">' + dateText + '</div></div>';
  }

  for (var hour = 0; hour < 24; hour++) {
    var row = document.createElement('tr');
    var hourCell = document.createElement('td');
    hourCell.textContent = hour + ':00';
    row.appendChild(hourCell);

    for (var day = 0; day < 7; day++) {
      var cell = document.createElement('td');
      cell.addEventListener('click', function() {
        selectCell(this);
      });
      row.appendChild(cell);
    }

    table.appendChild(row);
  }
}

function selectCell(cell) {
  if (selectedCell !== null) {
    selectedCell.classList.remove('selected');
  }
  cell.classList.add('selected');
  selectedCell = cell;
}

function nextWeek() {
  startDate.setDate(startDate.getDate() + 7);
  generateWeeklyCalendar(startDate);
}

function previousWeek() {
  startDate.setDate(startDate.getDate() - 7);
  generateWeeklyCalendar(startDate);
}

window.onload = function() {
  generateWeeklyCalendar(startDate);
};