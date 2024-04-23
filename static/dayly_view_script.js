let today = new Date();
let current_day = today.getDate();
let current_month = today.getMonth() + 1;
let current_year = today.getFullYear();

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
