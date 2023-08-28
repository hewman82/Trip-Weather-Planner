var currWeatherCard = document.querySelector('#current-weather');
var currWeatherHead = document.querySelector('#current-date');
var currTempText = document.querySelector('#current-temp');
var currWindText = document.querySelector('#current-wind');
var currHumText = document.querySelector('#current-humidity');
var forecastDateText = document.querySelectorAll('.date');
var forecastTempText = document.querySelectorAll('.temp');
var forecastWindText = document.querySelectorAll('.wind');
var forecastHumText = document.querySelectorAll('.humidity')
var searchCard = document.querySelector('#search');
var searchBtn = document.querySelector('#search-btn');
var searchBar = document.querySelector('#search-bar');
var optionList = document.createElement('ul');
searchCard.appendChild(optionList);

searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var searchText = searchBar.value;
    getCoordinates(searchText);

});

function getCoordinates(searchText) {
    var geocodeAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchText + '&limit=5&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f';

    fetch(geocodeAPI)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCities(data);
            });
        } else { alert(response.status); }
    });

}

function displayCities(data) {
    for(i = 0; i < data.length; i++) {
        var cityName = data[i].name;
        var stateName = data[i].state;
        var countryName = data[i].country;
        
        var optionEl = document.createElement('li');
        optionEl.textContent = cityName + ", " + stateName + ', ' + countryName;
        optionEl.setAttribute('data-lat', data[i].lat);
        optionEl.setAttribute('data-lon', data[i].lon);

        optionList.appendChild(optionEl);
    }
}

optionList.addEventListener('click', function selectCity(event) {
    var selected = event.target;
    var lat = selected.getAttribute('data-lat');
    var lon = selected.getAttribute('data-lon');
    getWeather(lat,lon);
    getForecast(lat, lon);

});

function getWeather(lat, lon) {
    var currentWeatherAPI = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f&units=imperial';

    fetch(currentWeatherAPI)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data);
            });
        } else { alert(response.status); }
        
    });
}

function displayCurrentWeather(data) {
    var name = data.name;
    var currDate = dayjs.unix(data.dt).format(' (M, DD, YYYY)');
    var currTemp = data.main.temp;
    var currWind = data.wind.speed;
    var currHum = data.main.humidity;

    currWeatherHead.textContent = name + currDate;
    currTempText.textContent = 'Temperature: ' + currTemp + '°F';
    currWindText.textContent = 'Wind Speed: ' + currWind + ' MPH';
    currHumText.textContent = 'Humidity: ' + currHum + '%';
}

function getForecast(lat, lon) {
    var weatherForecastAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f&units=imperial';

    fetch(weatherForecastAPI)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayForecast(data);
            });
        } else { alert(response.status); }
        
    });
}

function displayForecast(data) {
    var m = 8;
    for(i = 0; i < 5; i++){
        var date = data.list[m].dt;
        console.log(date);
        var temp = data.list[m].main.temp;
        var wind = data.list[m].wind.speed;
        var humidity = data.list[m].main.humidity;

        forecastDateText[i].textContent = dayjs.unix(date).format('M, DD, YYYY');
        forecastTempText[i].textContent = 'Temp: ' + temp + '°F';
        forecastWindText[i].textContent = 'Wind: ' + wind + ' MPH';
        forecastHumText[i].textContent = 'Humidity: ' + humidity + '%';
        m = m + 7;
    }
}