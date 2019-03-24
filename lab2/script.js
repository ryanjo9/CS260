// GET CURRENT WEATHER
document.getElementById("weatherSubmit").addEventListener("click", function(event) {
  event.preventDefault(); //prevents the default action of reloading the whole page after click
  const value = document.getElementById("weatherInput").value; //gets the input from the form
  if (value === "")
    return; //if empty don't do anything
  console.log(value);
  const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=bb1b1de7c00463cbcaa8ee9b769fa8e1";
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let results = "";
      let color = "";
      results += '<h2><b>The current weather in ' + json.name + " is</b></h2>";
      results += '<p><b>' + json.main.temp + '&deg;F -  ';
      for (let i = 0; i < json.weather.length; i++) {
        results += json.weather[i].description;
        if (i !== json.weather.length - 1)
          results += ", ";
      }
      results += '</p>'
      for (let i = 0; i < json.weather.length; i++) {
        results += '<img src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
      }
      console.log(json);
      /*results += '><b>' + json.main.temp + " &deg;F";*/
      results += "<p>";
      results += '<br><div id="suggestion">';
      /*get suggestion message*/
      if (json.weather[0].main === 'Rain' || json.weather[0].main === 'Hail') {
        results += 'Grab an umbrella<br>';
      } else if (json.weather[0].main === 'Clear') {
        results += 'Remember your sunglasses<br>';
      }
      if (json.main.temp >= 72 && json.weather[0].main != 'Rain') {
        results += 'Wear shorts today';
      }
      if (json.main.temp > 50 && json.main.temp < 72) {
        results += 'Wear a light jacket today';
      } else if (json.main.temp <= 50 && json.main.temp > 32) {
        results += 'You should wear a warm jacket today ';
      } else if (json.main.temp <= 32) {
        results += 'Do you really need to go outside?? If you do then wear a heavy coat, hat, gloves, and multiple pairs of socks.'
      }
      results += "</div></p>";
      document.getElementById("weatherResults").innerHTML = results;

      //get new color
      let main = json.weather[0].main;
      if (main === 'Clear') {
        document.body.style.backgroundColor = "#87CEEB";
      }
      if (main != 'Clear') {
        document.body.style.backgroundColor = "#c6c6c6";
      }
    });

  //get weather forecast
  const url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + value + ", US&units=imperial" + "&APPID=bb1b1de7c00463cbcaa8ee9b769fa8e1";
  fetch(url2)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json);
      let forecast = "";
      /*
            forecast += "<h2><b>" + moment(json.list[0].dt_txt).format('MMM Do YYYY') + "</b></h2>";
            forecast += "<p>" + "High:" + json.list[0].main.temp_max + '&deg;F&nbsp&nbspLow:' + json.list[0].main.temp_min + '&deg;F<br>' + moment(json.list[0].dt_txt).format('h:mm a');
            forecast += "  - " + json.list[0].main.temp + " &deg;F</p>";
            forecast += '<img src="http://openweathermap.org/img/w/' + json.list[0].weather[0].icon + '.png"/>'
            forecast += '<br>';*/
      let currentDay = moment(json.list[0].dt_txt).format('MMM Do YYYY');
      for (let i = 0; i < json.list.length;) {
        currentDay = moment(json.list[i].dt_txt).format('MMM Do YYYY');
        forecast += "<h2><b>" + moment(json.list[i].dt_txt).format('MMM Do YYYY') + "</b></h2>";
        forecast += "<p>" + "High:" + json.list[i].main.temp_max + '&deg;F&nbsp&nbspLow:' + json.list[i].main.temp_min + '&deg;F</p><br>';
        console.log("i before j loop: " + i);
        //nextDay = i + 8;
        forecast += '<p>';
        for (let j = 0; j < 8; j++) {
          console.log("j:" + j + " i:" + i);
          forecast += moment(json.list[i].dt_txt).format('h:mm a') + "  - " + json.list[i].main.temp + " &deg;F<br>";
          forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>';
          forecast += '<br>';
          i++;
          if (i === 39) {
            break;
            if (moment(currentDay).isSame(moment(json.list[i].format('MMM Do YYYY'), 'day'))) {
              console.log('currentDay:' + currentDay + "  isSame:" + moment(json.list[i]));
            }
          }
        }
        //i += 8;
      }
      /*forecast += "<h2>" + moment(json.list[i].dt_txt).format('MMMM Do YYYY, h:mm a') + "</h2>";
      forecast += "<p>Temperature: " + json.list[i].main.temp + "&deg;F</p>";
      forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>'
      forecast += '<br>'*/

      document.getElementById("forecastResults").innerHTML = forecast;
    });
});