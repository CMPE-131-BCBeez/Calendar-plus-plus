export async function query_events(start_timestamp, end_timestamp) {
    if (start_timestamp < 0 || end_timestamp < 0 || end_timestamp < start_timestamp) {
        throw new URIError("Invalid arguments")
    }

    const url = new URL(window.location.origin + "/api/events?") + new URLSearchParams({
        start_time: start_timestamp,
        end_time: end_timestamp
    })

    const response = await fetch(url)
    return await response.json()
}


export async function get_weather(lat, lng, start_timestamp, end_timestamp) {
    if (start_timestamp < 0 || end_timestamp < 0 || end_timestamp < start_timestamp) {
        throw new URIError("Invalid arguments")
    }
    const url = new URL(window.location.origin + "/api/weather?") + new URLSearchParams({
        start_time: start_timestamp,
        end_time: end_timestamp,
        lat: lat,
        lng: lng
    })

    const response = await fetch(url)
    return await response.json()
}


