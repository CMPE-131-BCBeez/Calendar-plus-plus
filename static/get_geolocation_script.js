//function to get geolocation and triger sending info function
function get_location_and_send() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            sendToServer(latitude, longitude);
        }, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

//send latitude and longitude to flask
function send_to_server(latitude, longitude) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/receive_location", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Location sent successfully");
        }
    };
    let data = JSON.stringify({"latitude": latitude, "longitude": longitude});
    xhr.send(data);
}

function show_error(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


