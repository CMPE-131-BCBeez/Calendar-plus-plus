import openmeteo_requests

import requests_cache
import pandas as pd
from retry_requests import retry
from datetime import datetime

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below


def getWeather(latitude: float, longitude: float, start_time: datetime, end_time: datetime, mode: str = None) -> str:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ["temperature_2m", "is_day", "weather_code", "relative_humidity_2m", "wind_speed_10m"],
        "hourly": ["temperature_2m", "weather_code"],
        "daily": ["weather_code", "temperature_2m_max"],
        "temperature_unit": "fahrenheit",
        "timezone": "America/Los_Angeles",
        "start_date": datetime.strftime(start_time, "%Y-%m-%d"),
        "end_date": datetime.strftime(end_time, "%Y-%m-%d")
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    # print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    # print(f"Elevation {response.Elevation()} m asl")
    # print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
    # print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

    # Current values. The order of variables needs to be the same as requested.
    current = response.Current()
    current_temperature_2m = current.Variables(0).Value()
    current_relative_humidity_2m = current.Variables(1).Value()
    current_is_day = current.Variables(2).Value()
    current_weather_code = current.Variables(3).Value()
    current_wind_speed_10m = current.Variables(4).Value()

    print(current_relative_humidity_2m)
    current_dict = {"current": {"timestamp": current.Time(), "temperature_2m": current_temperature_2m, 
                          "s_day": current_is_day, "weather_code": current_weather_code, "relative_humidity_2m": current_relative_humidity_2m, "wind_speed_10m": current_wind_speed_10m}}
    if mode == "current":
        return current_dict

    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_weather_code = hourly.Variables(1).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}
    hourly_data["temperature_2m"] = hourly_temperature_2m
    hourly_data["weather_code"] = hourly_weather_code

    hourly_dataframe = pd.DataFrame(data = hourly_data)
    hourly_dataframe['date'] = hourly_dataframe['date'].astype(int) // (10 ** 9)
    hour_dict = {"hourly": hourly_dataframe.to_dict(orient='list')}
    hour_dict.update(current_dict)
    if mode == "hourly":
        return hour_dict
    
    # print(hourly_dataframe)

    # Process daily data. The order of variables needs to be the same as requested.
    daily = response.Daily()
    daily_weather_code = daily.Variables(0).ValuesAsNumpy()
    daily_temperature_2m_max = daily.Variables(1).ValuesAsNumpy()

    daily_data = {"date": pd.date_range(
        start = pd.to_datetime(daily.Time(), unit = "s", utc = True),
        end = pd.to_datetime(daily.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = daily.Interval()),
        inclusive = "left"
    )}
    daily_data["weather_code"] = daily_weather_code
    daily_data["temperature_2m_max"] = daily_temperature_2m_max

    daily_dataframe = pd.DataFrame(data = daily_data)
    daily_dataframe['date'] = daily_dataframe['date'].astype(int) // (10 ** 9)
    daily_dict = {"daily": daily_dataframe.to_dict('list')}
    daily_dict.update(hour_dict)
    return daily_dict


if __name__ == "__main__":
    res = getWeather(37.3394, -121.895, datetime.strptime("2024-05-05", "%Y-%m-%d"), datetime.strptime("2024-05-06", "%Y-%m-%d"))
    print(type(res))