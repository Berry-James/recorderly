
function browserRedirect() {
    window.location.href="#search"
}

/* function testBtn() {
document.getElementById("see-more-btn").addEventListener('click', testAlert());
}

function testAlert() {
    document.getElementById('home-page').style.display="none";
    document.getElementById('about-page').style.display="block";
} */

function search() {

    fetch(`https://api.discogs.com/database/search?q=${document.getElementById("searchBar").value}&token=VGCcdPkiXMOSimYzzdmpboMlvbMhSlZejvcNwWYL`)
    .then(response => response.json())
    .then(data => appendData(data.results))
    .catch(err => {
      console.log(err);
    
});
  }

  function appendData(data) {
    var mainContainer = document.getElementById("myData");
    document.getElementById("myData").innerHTML = null;
  
    for (var i = 0; i < data.length; i++) {
      // If data does not have an assigned format (i.e. artists), it is not displayed
      if (data[i].format == undefined) {
       
      }else{
      var div = document.createElement("div");
      var relId = data[i].master_url;
      div.className = "release-box"
      div.innerHTML = '<p>Country: ' + data[i].country + '<br>' + 'Year: ' + data[i].year + '<br>' + 'Format: ' + data[i].format + '</p>' + '<img src="' + data[i].cover_image + '" class="cover-img">';
      mainContainer.appendChild(div);
      }
  }
  };
