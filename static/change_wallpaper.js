function change_wallpaper(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      document.body.style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
  }
  
  document.getElementById('walpaper').addEventListener('change', change_wallpaper);