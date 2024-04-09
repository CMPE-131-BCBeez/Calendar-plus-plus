function generateCalendarGrid(data) {
    const calendarGrid = document.getElementById('calendarGrid');

    calendarGrid.innerHTML = '';
  
    data.forEach(week => {
      const weekRow = document.createElement('div');
      weekRow.classList.add('weekRow');
      week.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.classList.add('dayCell');
        dayCell.textContent = day;
        weekRow.appendChild(dayCell);
      });
      calendarGrid.appendChild(weekRow);
    });
  }