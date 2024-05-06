async function authenticate() {

}


async function getDailyForecast(latitude, longitude) {
    try {
        let response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
        let data = response.json()
    } catch(error) {
        console.log(`cant get weather ${error}`)
        document.getElementById("err").innerHTML = "Cannot get weather"
    }
}