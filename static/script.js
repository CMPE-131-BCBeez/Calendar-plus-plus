document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    // カレンダーの設定
    plugins: [ 'dayGrid' ] 
  });
  calendar.render(); 
});