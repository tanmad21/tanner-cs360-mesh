<!DOCTYPE html>
<html>
<?php include 'navigation.htm'?>
  <h2 class='main-page-header'>Current Weather Page</h2>
  <form class="weather-form">
    <label for="City">Enter a City: </label>
    <input type="text" name="City" id="city-field" autocomplete="off"/>
    <input id="weather-submit" type='submit' value="Get Weather"><br>
  </form>
  <div style="left:25%;width:50%;position:relative;">
    <span id="city-suggestions" style="position:fixed;left:50%;"></span>
    <textarea id="city-displayer" readonly style="resize:none;margin-top:20px;background-color:lightsteelblue;"></textarea>
  </div>
  <div id="weather">
  </div>
</body>


<script>
$(document).ready(function() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  $('#city-field').keyup(function(e) {
    if(e.target.value.length < 1) {
      $("#city-suggestions").html("");
      return;
    }
    var api = "http://52.11.39.168:8080/getcity?q=";
    var input = e.target.value;
    input = capitalizeFirstLetter(input);
    api += input;
    $.ajax({
      url: api
    })
    .done(function(data) {
      data = JSON.parse(data);
      var htmlToDisplay = "<ul>";
      $.each(data,function(i,item) {
      	htmlToDisplay += "<li class='city-list'>"+item;
      });
      htmlToDisplay += "<ul>";
      $("#city-suggestions").html(htmlToDisplay);
 
    })	
    .fail(function(data,err) {
      alert("Something went wrong!");
    })
  });
  $(document).on('click','.city-list',function(e) {
    $("#city-field").val(e.target.innerText);
    $("#city-suggestions").html("");
  });
  $('#weather-submit').on('click',function(e) {
    e.preventDefault();
    $('#city-displayer').val($('#city-field').val());

    var api = "https://api.wunderground.com/api/b63833a1301e308d/geolookup/conditions/q/UT/";
    api += $("#city-field").val() + ".json";
    $.ajax(
      {
        type:"GET",
        dataType:"jsonp",
        url:api
      })
    .done(function(data,result){
      console.log(data);
      var location = data.location.city;
      var temp_string = data.current_observation.temperature_string;
      var current_weather = data.current_observation.weather;
      var everything = "<ul id='current-weather'>";
      everything += "<li>Location: "+location;
      everything += "<li>Temperature: "+temp_string;
      everything += "<li>Weather: "+current_weather;
      everything += "</ul>";
      $("#weather").html(everything);
    });
  });
});
</script>
</html>
