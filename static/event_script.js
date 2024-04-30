function openModal() {
    document.getElementById("myModal").style.display = "flex"; 
  }
  
  function closeModal() {
    document.getElementById("myModal").style.display = "none"; 
  }
  
//close the modal either when user pless close button or somewahre not the pop up window
  document.getElementsByClassName("close")[0].onclick = function() {
    closeModal();
  }
  
  window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
      closeModal();
    }
  }

//function to link to other route
function load_content(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById("event_window").innerHTML = data;
    });
}

load_content("/new_event");