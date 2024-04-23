let today = new Date();
let current_day = today.getDate();
let current_month = today.getMonth() + 1;
let current_year = today.getFullYear();

current_day.setHours(0, 0, 0, 0);

let midnight_timestamp = current_day.getTime();

let midnight_unix_timestamp = Math.floor(midnightTimestamp / 1000);

console.log(midnightUnixTimestamp); // 午前0時の Unix タイムスタンプを出力

function day_to_timestamp(current_day) {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    // 時間と分を文字列として組み立てる
    var timeString = hours + ':' + (minutes < 10 ? '0' : '') + minutes; // 分が10未満の場合は0を追加
    return timeString;
}

// サンプルのUnixタイムスタンプ
var unixTimestamp = 1618911600; // 2021-04-20 12:00:00 PM UTC

// Unixタイムスタンプを時間の文字列に変換して表示
console.log(timestampToTime(unixTimestamp))
let unix_time = 

function generate_daily_view(){
    let beggining_day = 
}

//redirect to daily view when user click on the calender cell
function redirect_to_daily_view(date) {
    //add date in url
    let url = '/daily_calendar?date=' + date;
    //open new page in the same tab
    window.location.href = url;
}

// カレンダーセルをクリックしたときに redirectToDailyView 関数を呼び出すイベントリスナーを追加する
document.querySelectorAll('.calendar_basic').forEach(cell => {
    cell.addEventListener('click', function() {
        let day = this.innerText;
        let monthYear = document.getElementById('year_month_header').innerText;
        let [month, year] = monthYear.split('/');
        let date = `${year}-${month}-${day}`;
        redirectToDailyView(date);
    });
});
