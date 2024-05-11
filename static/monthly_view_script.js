import { query_events, get_weather } from "./api_access.js";

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
let lat = 37.3394;
let lng = -121.895;
let fetched_weather_data;



//get timestamp for first date and last date of the calendar
function get_timestamp_monthly(year, month, timestamp_start_day, timestamp_last_day) {
  let first_date, last_date;
  if (timestamp_start_day > 1) {
    first_date = new Date(Date.UTC(year, month - 2, timestamp_start_day)).getTime();
  }
  else {
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


const timestamp = get_timestamp_monthly(current_year, current_month, first_date_on_calendar, last_date_on_calendar);
const timestamp_for_first_date_on_calendar = timestamp.start;
const timestamp_for_last_date_on_calendar = timestamp.end;
let two_weeks_ahead;

try {
  let prev_mon_ts = new Date(timestamp_for_first_date_on_calendar * 1000);
  prev_mon_ts.setMonth(prev_mon_ts.getMonth() - 1)
  prev_mon_ts /= 1000

  let next_mon_ts = new Date(timestamp_for_last_date_on_calendar * 1000);
  next_mon_ts.setMonth(next_mon_ts.getMonth() + 1)
  next_mon_ts /= 1000

  two_weeks_ahead = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  two_weeks_ahead.setDate(two_weeks_ahead.getDate() + 10)
  two_weeks_ahead /= 1000

  let end_ts = two_weeks_ahead < next_mon_ts ? two_weeks_ahead : next_mon_ts
  let got_pos = false

  // if (sessionStorage.getItem('lat') && sessionStorage.getItem('lng')) {
  //   lat = sessionStorage.getItem('lat')
  //   lng = sessionStorage.getItem('lng')
  // } 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      lat = pos.coords.latitude
      lng = pos.coords.longitude
      fetched_weather_data = await get_weather(lat, lng, prev_mon_ts, end_ts)
      got_pos = true
      // sessionStorage.setItem("lat", lat)
      // sessionStorage.setItem("lng", lng)
    })
  }

  // hacky workaround to make sure some weather data is acquired
  if (!navigator.geolocation || !got_pos) {
    fetched_weather_data = await get_weather(lat, lng, prev_mon_ts, end_ts)
  }

  if (!fetched_weather_data) {
    console.log("race condition")
    throw new ErrorEvent("race condition")
  }
  console.log(`Past: ${JSON.stringify(fetched_weather_data)}`)
  monthly_events = await query_events(prev_mon_ts, next_mon_ts)
} catch (error) {
  console.error("Failed to get event data:", error);
  throw error;
}

function get_event_array(ts_micro) {
  let ceil_scaled_ts = Math.ceil(ts_micro / 1000)
  let floor_scaled_ts = Math.floor(ts_micro / 1000)

  if (floor_scaled_ts in monthly_events) {
    return monthly_events[floor_scaled_ts]

  } else if (ceil_scaled_ts in monthly_events) {
    return monthly_events[ceil_scaled_ts]
  }

  return null
}

function generate_calendar(year, month) {
  console.log("generate is running")
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

  let render_event = (ts_key) => {
    let events = get_event_array(ts_key)
    monthly_calendar += "<div>";
    monthly_calendar += '<ul>';
    if (events) {
      for (let e of events) {
        // console.log(`Rendering Event: ${e['title']} at date ${new Date(e['start_time'])}`)
        let start_date = new Date(e['start_time'] * 1000)
        let end_date = new Date(e['end_time'] * 1000)
        let event_list_item = '<li style="' + 'color:' + e['color'] + ';">' + start_date.getHours() + " - " + end_date.getHours()
        if (start_date.getDate() != end_date.getDate()) {
          event_list_item += " (on " + (end_date.getMonth() + 1) + "/" + end_date.getDate() + ")";
        }

        event_list_item += ": " + e['title'] + '</li>';
        monthly_calendar += event_list_item
      }
    }
    monthly_calendar += '</ul>';
    monthly_calendar += '</div>';
  }

  let render_weather = (ts_key) => {
    if (ts_key > (two_weeks_ahead * 1000)) {
      console.log(`skipping: ${ts_key}`)
      return;
    }
    console.log(ts_key.getTime())
    console.log("render weather is running")
    let weather_data_idx = undefined;
    let daily_date = fetched_weather_data['daily']
    for (let i = 0; i < daily_date['date'].length; i++) {
      if ((daily_date['date'][i] * 1000) === ts_key.getTime()) {
        weather_data_idx = i
        break
      }
    }

    if (!weather_data_idx) {
      console.log(ts_key)
      throw new TypeError("API fetched wrong, invalid timestamp given")
    }

    let weather_img_src;
    let wc = daily_date['weather_code'][weather_data_idx];
    if (wc == 0) {
      weather_img_src = "clear.png"
    } else if (wc >= 1 && wc < 4) {
      weather_img_src = "clouds.png"
    } else if ((wc >= 4 && wc < 20) || (wc >= 40 && wc < 50)) {
      weather_img_src = "clear.png"
    } else if ((wc > 21 && wc < 29) || (wc > 37 && wc < 40) || (wc >= 70 && wc < 80)) {
      weather_img_src = "snow.png"
    } else if ((wc >= 20 && wc < 22) || (wc >= 40 && wc < 70) || (wc >= 80 && wc <= 84)) {
      weather_img_src = "drizzle.png"
    } else {
      weather_img_src = "clear.png"
    }
    monthly_calendar += `<div style="position: absolute; top: 0; right: 0;">`
    monthly_calendar += `<p>${Math.round(daily_date['temperature_2m_max'][weather_data_idx])}F</p>`
    monthly_calendar += `<img src="static/Image/${weather_img_src}" alt="Image" style="width: 20px; height: 20px;">`
    monthly_calendar += `</div>`
  }

  //fill the blank before the 1st date 
  for (let i = 0; i < day_of_Week; i++) {
    let date_num = prev_month_last_day.getDate() - day_of_Week + 1 + i
    let date_in_month = new Date(prev_month_last_day.getTime())
    date_in_month.setDate(date_num)
    let date_ts = date_in_month.getTime()
    monthly_calendar += '<td class="' + prev_next_day_class + '">' + date_num;
    render_event(date_ts)
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

    let date_ts = new Date(last_day.getTime())
    date_ts.setDate(day)
    monthly_calendar += '<td class="' + cell_class + '" style="position: relative;">' + day;
    render_weather(date_ts)
    render_event(date_ts)
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
      let date_ts = new Date(last_day.getTime())
      date_ts.setDate(i + 1)
      date_ts.setMonth(date_ts.getMonth() + 1)
      monthly_calendar += '<td class="' + prev_next_day_class + '" style="position: relative;">' + (i + 1);
      render_weather(date_ts)
      //monthly_calendar += "<h4> Hello! I am in the first for loop! (iter" + i + ")</h4>"
      render_event(date_ts)
      monthly_calendar += '</td>';
      event_day_cell++;
    }
    monthly_calendar += '</tr>';
  }

  if (count_colmn < 6 || last_day.getDay() === 6) {
    for (let i = next_month_mergin; i < next_month_mergin + 7; i++) {
      let date_ts = new Date(last_day.getTime())
      date_ts.setDate(i + 1)
      date_ts.setMonth(date_ts.getMonth() + 1)
      monthly_calendar += '<td class="' + prev_next_day_class + '">' + (i + 1);
      render_weather(date_ts)
      render_event(date_ts)
      monthly_calendar += '</td>';
      event_day_cell++;
    }
    monthly_calendar += '</tr>';
    last_date_on_calendar += 7;
    count_colmn++;
  }

  if (count_colmn < 6) {
    monthly_calendar += '<tr>'
    for (let i = next_month_mergin + 7; i < next_month_mergin + 14; i++) {
      let date_ts = new Date(last_day.getTime())
      date_ts.setDate(i + 1)
      date_ts.setMonth(date_ts.getMonth() + 1)
      monthly_calendar += '<td class="' + prev_next_day_class + '">' + (i + 1);
      //monthly_calendar += "<h4> Hello! I am in the third for loop! (iter" + i + ")</h4>"
      render_weather(date_ts)
      render_event(date_ts)
      monthly_calendar += '</td>';
      event_day_cell++;
    }
    monthly_calendar += '</tr>';
    last_date_on_calendar += 7;
    count_colmn++;
  }

  monthly_calendar += '</tbody>';
  monthly_calendar += '</table>';

  document.getElementById('monthly_calendar').innerHTML = monthly_calendar;

  let todayCell = document.querySelector('.today');
  if (todayCell) {
    let event_div = Array.from(todayCell.children).filter((el) => el.tagName.toLowerCase() == 'div')[0]
    event_div.style['border'] = "2px"
    event_div.style['font-size'] = "15px"

    let todayCellHTML = todayCell.innerHTML;
    const regex = /^\d+/
    const today_date = todayCellHTML.match(regex)[0]
    let bold_html = '<span class="today_cell">' + today_date + '</span>'
    let new_html = bold_html + todayCellHTML.substring(today_date.length)
    todayCell.innerHTML = new_html
  }
}

//implement the button going back to previous month
document.getElementById('prev_month').addEventListener('click', async function () {
  current_month--;
  if (current_month === 0) {
    current_year--;
    current_month = 12;
  }

  let prev_mon_ts = new Date(current_year, current_month, 1);
  prev_mon_ts.setMonth(prev_mon_ts.getMonth() - 2)
  prev_mon_ts /= 1000

  let next_mon_ts = new Date(current_year, current_month + 1, 0);
  next_mon_ts.setMonth(next_mon_ts.getMonth() + 1)
  next_mon_ts /= 1000

  monthly_events = await query_events(prev_mon_ts, next_mon_ts)

  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
  // location.reload();  
});

//implement the button going forward to next month
document.getElementById('next_month').addEventListener('click', async function () {
  current_month++;
  if (current_month === 13) {
    current_year++;
    current_month = 1;
  }

  let prev_mon_ts = new Date(current_year, current_month, 1);
  prev_mon_ts.setMonth(prev_mon_ts.getMonth() - 2)
  prev_mon_ts /= 1000

  let next_mon_ts = new Date(current_year, current_month + 1, 0);
  next_mon_ts.setMonth(next_mon_ts.getMonth() + 1)
  next_mon_ts /= 1000

  monthly_events = await query_events(prev_mon_ts, next_mon_ts)


  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
  // location.reload();
});

function year_month(month, year) {
  let englishMonth = new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' });
  let year_month_header = englishMonth + '/' + year;
  document.getElementById('year_month_header').innerHTML = year_month_header;
}

//go to the month that have today
document.getElementById('today_button_month').addEventListener('click', async function () {
  current_month = today.getMonth() + 1;
  current_year = today.getFullYear();

  let prev_mon_ts = new Date(today.getFullYear(), today.getMonth(), 1);
  prev_mon_ts.setMonth(prev_mon_ts.getMonth() - 1)
  prev_mon_ts /= 1000

  let next_mon_ts = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  next_mon_ts.setMonth(next_mon_ts.getMonth() + 1)
  next_mon_ts /= 1000


  monthly_events = await query_events(prev_mon_ts, next_mon_ts)
  generate_calendar(current_year, current_month);
  year_month(current_month, current_year);
  // location.reload();
});

year_month(current_month, current_year);
generate_calendar(current_year, current_month);

//make the cell to button
document.querySelectorAll('.calendar_basic').forEach(cell => {
  cell.addEventListener('click', function () {
    let day = Number(this.innerText.match(/^\d+/));
    let start_timestamp = new Date(current_year, current_month - 1, day, 0, 0, 0).getTime() / 1000;
    let end_timestamp = start_timestamp + (24 * 60 * 60);
    let daily_view_url = '/daily_calendar?start=' + start_timestamp + '&end=' + end_timestamp;
    window.location.href = daily_view_url;
    window.daily_view_url = daily_view_url;
  });
});

//load the get_location_and_send() when it finished loading page

// // document.addEventListener('DOMContentLoaded', function() {
// //   get_location_and_send();
// // });

export { }

