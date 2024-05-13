import { get_weather } from "./api_access.js";


let today = new Date()
const start_ts = Math.round(today.getTime() / 1000)
today.setDate(today.getDate() + 1)
const end_ts = Math.round(today.getTime() / 1000)
let lat = 37.3394;
let lng = -121.895;

if (sessionStorage.getItem('lat') && sessionStorage.getItem('lng')) {
    lat = sessionStorage.getItem('lat')
    lng = sessionStorage.getItem('lng')
} else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude
        lng = pos.coords.longitude
        sessionStorage.setItem("lat", lat)
        sessionStorage.setItem("lng", lng)
    })
}


async function checkWeather() {
    let full_json = await get_weather(lat, lng, start_ts, end_ts)
    let current_data = full_json['current']
    let wc = current_data['weather_code']
    let weather_img_src;
    if (wc == 0) {
        weather_img_src = "image/clear.png"
    } else if (wc >= 1 && wc < 4) {
        weather_img_src = "image/clouds.png"
    } else if ((wc >= 4 && wc < 20) || (wc >= 40 && wc < 50)) {
        weather_img_src = "image/clear.png"
    } else if ((wc > 21 && wc < 29) || (wc > 37 && wc < 40) || (wc >= 70 && wc < 80)) {
        weather_img_src = "image/snow.png"
    } else if ((wc >= 20 && wc < 22) || (wc >= 40 && wc < 70) || (wc >= 80 && wc <= 84)) {
        weather_img_src = "image/drizzle.png"
    } else {
        weather_img_src = "image/clear.png"
    }

    let wc_img = document.getElementById("wc")
    wc_img.src = weather_img_src
    document.querySelector(".city").innerHTML = "Current Location";
    document.querySelector(".temp").innerHTML = Math.round(current_data['temperature_2m']) + "°F";
    document.querySelector(".humidity").innerHTML = current_data['relative_humidity_2m'] + "%";
    document.querySelector(".wind").innerHTML = Math.round(current_data['wind_speed_10m']) + " mph";

}

checkWeather();

export { }