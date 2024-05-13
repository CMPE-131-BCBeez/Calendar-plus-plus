import { query_events } from "./api_access.js";

//get the start and end timestamp from url
function get_start_and_end() {
  const url = new URLSearchParams(window.location.search);
  const start = parseInt(url.get('start'));
  const end = parseInt(url.get('end'));
  return { start, end };
}

const start_and_end = get_start_and_end();
let beginning_day = start_and_end.start;
let time = beginning_day * 1000;
let date = new Date(time);
let this_year = parseInt(date.getFullYear());
let this_month = parseInt(date.getMonth() + 1);
let this_day = parseInt(date.getDate());
let this_hours = parseInt(date.getHours());
let fetched_json = await query_events(beginning_day, start_and_end.end)
let daily_events = fetched_json[beginning_day]

function render_event(event_data) {

  let start_date = new Date(event_data['start_time'] * 1000)
  let end_date = new Date(event_data['end_time'] * 1000)
  let hour_idx = start_date.getHours()

  let start_cell = document.getElementById(new String(hour_idx))
  let start_pos = start_cell.getBoundingClientRect()
  let end_pos = new Number(start_pos.height) * (end_date.getHours() - hour_idx)

  let event_block = document.createElement("div")
  event_block.className = "dynamic-rectangle"
  event_block.style.width = start_pos.width + "px"
  event_block.style.height = end_pos + "px"
  event_block.style.backgroundColor = event_data['color']

  event_block.style.left = start_pos.left + "px"
  event_block.style.top = start_pos.top + "px"

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
  let valid_events = []

  for (let e of daily_events) {
    let start = new Date(e['start_time'] * 1000)
    let end = new Date(e['end_time'] * 1000)
    if ((start.getHours() < 12 && end.getHours < 12) || (start.getHours() >= 12 && end.getHours() >= 12)) {
      valid_events.push(e)
      continue
    }
    let hour_twelve = new Date(start)
    hour_twelve.setHours(12)
    let first_half = { "color": e['color'], "description": e['description'], "title": e['title'], "type": e['type'], "start_time": e['start_time'], "end_time": hour_twelve }
    let second_half = { "color": e['color'], "description": e['description'], "title": e['title'], "type": e['type'], "start_time": hour_twelve, "end_time": e['end_time'] }

    valid_events.push(first_half)
    valid_events.push(second_half)
  }

  for (let e of valid_events) {
    render_event(e)
  }
}

function generate_am_daily_view() {
  let time_num;
  let am_daily_view = '<table>';
  am_daily_view += '<tbody>';

  for (let i = 0; i < 12; i++) {
    am_daily_view += '<tr>';

    if (this_hours + i <= 9) {
      time_num = " " + this_hours + i
    }
    else {
      time_num = this_hours + i;
    }
    am_daily_view += '<td class="time_cell">' + (time_num + ":00") + '</td>';
    am_daily_view += `<td id="${new String(time_num).trim().substring(1)}" class="event_cell">` + (" ") + '</td>';
    am_daily_view += '</tr>';
  }
  am_daily_view += '</tbody>';
  am_daily_view += '</table>';
  document.getElementById('am_daily_view').innerHTML = am_daily_view;
}

function generate_pm_daily_view() {
  let pm_daily_view = '<table>';
  pm_daily_view += '<tbody>';

  for (let i = 0; i < 12; i++) {
    pm_daily_view += '<tr>';
    pm_daily_view += `<td class="time_cell">` + (this_hours + 12 + i + ":00") + '</td>';
    pm_daily_view += `<td id="${this_hours + 12 + i}" class="event_cell">` + (" ") + '</td>';
    pm_daily_view += '</tr>';
  }
  pm_daily_view += '</tbody>';
  pm_daily_view += '</table>';
  document.getElementById('pm_daily_view').innerHTML = pm_daily_view;
};

function year_month_day(month, year, day) {
  let englishMonth = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  let year_month_day_header = englishMonth + '/' + day + '/' + year;
  document.getElementById('year_month_day_header').innerHTML = year_month_day_header;
};

//implement the button going back to previous month
document.getElementById('prev_day').addEventListener('click', function () {
  let day = this_day - 1;
  let start_timestamp = new Date(this_year, this_month - 1, day, 0, 0, 0).getTime() / 1000;
  let end_timestamp = start_timestamp + (24 * 60 * 60);
  let daily_view_url = '/daily_calendar?start=' + start_timestamp + '&end=' + end_timestamp;
  window.location.href = daily_view_url;
  window.daily_view_url = daily_view_url;
});

//implement the button going forward to next month
document.getElementById('next_day').addEventListener('click', function () {
  let day = this_day + 1;
  let start_timestamp = new Date(this_year, this_month - 1, day, 0, 0, 0).getTime() / 1000;
  let end_timestamp = start_timestamp + (24 * 60 * 60);
  let daily_view_url = '/daily_calendar?start=' + start_timestamp + '&end=' + end_timestamp;
  window.location.href = daily_view_url;
  window.daily_view_url = daily_view_url;
});

document.getElementById('today_button_daily').addEventListener('click', function () {
  let today = new Date();
  let today_year = today.getFullYear();
  let today_month = today.getMonth() + 1;
  let today_day = today.getDate();
  let start_timestamp = new Date(today_year, today_month - 1, today_day, 0, 0, 0).getTime() / 1000;
  let end_timestamp = start_timestamp + (24 * 60 * 60);
  let daily_view_url = '/daily_calendar?start=' + start_timestamp + '&end=' + end_timestamp;
  window.location.href = daily_view_url;
  window.daily_view_url = daily_view_url;
});

generate_am_daily_view();
generate_pm_daily_view();
if (daily_events) {
  display_events()
}

year_month_day(this_month, this_year, this_day);

export { }