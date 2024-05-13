import { query_events, get_weather } from "./api_access.js"

let startDate = new Date();
let selectedCell = null;
let week_event_data;

let sundayDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
sundayDate.setDate(sundayDate.getDate() - sundayDate.getDay());
let next_week = new Date(sundayDate)
next_week.setDate(next_week.getDate() + 7)
week_event_data = await query_events(Math.round(sundayDate.getTime() / 1000), Math.round(next_week.getTime() / 1000))
console.log(week_event_data)



function render_event(event_data) {
    let start_date = new Date(event_data['start_time'] * 1000)
    let end_date = new Date(event_data['end_time'] * 1000)
    let hour_idx = start_date.getHours()

    let start_cell = document.getElementById(new String(event_data['start_time']))
    let start_pos = start_cell.getBoundingClientRect()
    let end_pos;
    if (end_date.getDate() > start_date.getDate()) {
        end_pos = new Number(start_pos.height) * (24 - hour_idx)
    } else {
        end_pos = 46 * (end_date.getHours() - hour_idx)
    }

    let event_block = document.createElement("div")
    event_block.className = "dynamic-rectangle"
    event_block.style.width = start_pos.width + "px"
    event_block.style.height = end_pos + "px"
    event_block.style.backgroundColor = event_data['color']

    // event_block.style.left = start_pos.left + "px"
    event_block.style.top = 0 + "%"

    let event_text = document.createTextNode(`${hour_idx} - ${event_data['title']}`)
    let desc = document.createTextNode(`\n\n\n${event_data['description']}`)
    let text_span = document.createElement("span")
    let desc_span = document.createElement("span")
    let br = document.createElement("br")
    text_span.appendChild(event_text)
    desc_span.appendChild(desc)
    event_block.appendChild(text_span)
    event_block.appendChild(br)
    event_block.appendChild(desc_span)

    start_cell.appendChild(event_block)

}

function display_events() {
    let ts = new Date(sundayDate)
    let event_array;
    for (let i = 0; i < 7; i++) {
        event_array = week_event_data[Math.round(ts / 1000)]
        if (event_array) {
            for (let e of event_array) {
                render_event(e)
            }
        }
        ts.setDate(ts.getDate() + 1)
    }

}

function generateWeeklyCalendar(startDate) {
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let table = document.getElementById('calendar');

    let rows = table.getElementsByTagName('tr');
    for (let i = rows.length - 1; i > 0; i--) {
        table.removeChild(rows[i]);
    }

    let sundayDate = new Date(startDate);
    sundayDate.setDate(sundayDate.getDate() - sundayDate.getDay());

    for (let i = 0; i < 7; i++) {
        let date = new Date(sundayDate);
        date.setDate(date.getDate() + i);
        let day = daysOfWeek[i];
        let dateText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        let th = document.getElementById(daysOfWeek[i].toLowerCase());
        th.innerHTML = '<div class="dayInfo"><div class="dayName">' + day + '</div><div class="dateNumber">' + dateText + '</div></div>';
    }

    let ts = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), sundayDate.getDate(), 0, 0, 0)
    for (let hour = 0; hour < 24; hour++) {
        let row = document.createElement('tr');
        let hourCell = document.createElement('td');
        hourCell.textContent = hour + ':00';
        row.appendChild(hourCell);
        ts.setHours(hour)

        for (let day = 0; day < 7; day++) {
            let cell = document.createElement('td');
            cell.setAttribute("id", `${Math.round(ts.getTime() / 1000)}`)
            cell.addEventListener('click', function () {
                selectCell(this);
            });
            row.appendChild(cell);
            ts.setDate(ts.getDate() + 1)
        }
        ts.setDate(ts.getDate() - 7)
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
    //location.reload()
}

function previousWeek() {
    startDate.setDate(startDate.getDate() - 7);
    generateWeeklyCalendar(startDate);
    //location.reload()
}

function this_week() {
    startDate = new Date();
    generateWeeklyCalendar(startDate);
    //location.reload()
}

window.onload = function () {
    console.log("loading")
    generateWeeklyCalendar(startDate);
    //display_events()
};


document.getElementById("weekly").addEventListener("click", this_week);
document.getElementById("prevWeek").addEventListener("click", previousWeek);
document.getElementById("nextWeek").addEventListener("click", nextWeek);

generateWeeklyCalendar(startDate)
display_events()

export { }