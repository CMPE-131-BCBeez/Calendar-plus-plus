function getWeather() {

    const apiKey = ''
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Enter your fuckin city');
        return;
    }

    const currentWeatherUrl = 'https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}/forecast'
}