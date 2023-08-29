//current weather cards
var currWeatherCard = document.querySelector('#current-weather');
var currWeatherHead = document.querySelector('#current-date');
var currIcon = document.querySelector('#curr-icon');
var currTempText = document.querySelector('#current-temp');
var currWindText = document.querySelector('#current-wind');
var currHumText = document.querySelector('#current-humidity');
//5 day forecast cards
var forecastDateText = document.querySelectorAll('.date');
var forecastTempText = document.querySelectorAll('.temp');
var forecastWindText = document.querySelectorAll('.wind');
var forecastHumText = document.querySelectorAll('.humidity')
//search card
var searchCard = document.querySelector('#search');
var searchBtn = document.querySelector('#search-btn');
var searchBar = document.querySelector('#search-bar');
//ul for city options li elements
var optionList = document.createElement('ul');
//array to save searched
var searches = [];
//ul for search history li elements
var searchHistoryUl = document.createElement('ul');
searchHistoryUl.setAttribute('class', 'search-history');
searchCard.appendChild(optionList);
searchCard.appendChild(searchHistoryUl);

function init() {
    //on page load, load saved search items
    var searchHistory = JSON.parse(localStorage.getItem('searched'));
    //if there are items saved, set searches array value to saved items
    if (searchHistory !== null) {
        searches = searchHistory;
    }
    //render search history li elements
    displayHistory();
}

searchBtn.addEventListener('click', function(e) {
    //on click, prevent page from refreshing,
    e.preventDefault();
    //save search text
    var searchText = searchBar.value;
    //use geocode api with city name to get coordinates
    getCoordinates(searchText);
});

optionList.addEventListener('click', function (e) {
    //on city option click, get city name and coordinates saved as data attributes
    var city = e.target.innerHTML;
    var lat = e.target.getAttribute('data-lat');
    var lon = e.target.getAttribute('data-lon');
    //save as key value pairs
    var searched = {
        'city': city,
        'lat': lat,
        'lon': lon,
    }
    //push to searches array
    searches.push(searched);
    //save in local storage
    localStorage.setItem('searched', JSON.stringify(searches));

    //render search history li elements
    displayHistory();
    //pass coordinates through current weather api
    getWeather(lat,lon);
    //pass coordinates through forecast api
    getForecast(lat, lon);

});

searchHistoryUl.addEventListener('click', function(e) {
    //on search history item click, get coordinates saved as data attributes
    var lat = e.target.getAttribute('data-lat');
    var lon = e.target.getAttribute('data-lon');
    //pass coordinates through current weather api
    getWeather(lat,lon);
    //pass coordinates through forecast api
    getForecast(lat,lon);
})

function getCoordinates(searchText) {
    //api to convert city name, entered in searchBar, into coordinates
    var geocodeAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchText + '&limit=5&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f';

    fetch(geocodeAPI)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCities(data);
            });
        } else { alert(response.status); }
    });

}

function getWeather(lat, lon) {
    //api to get current weather based on coordinates
    var currentWeatherAPI = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f&units=imperial';

    fetch(currentWeatherAPI)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data);
            });
        } else { alert(response.status); }
    });
}

function getForecast(lat, lon) {
    //api to get 5 day forecast based on coordinates
    var weatherForecastAPI = 'https://api.openweathermap.org/data/2.5/forecast/?lat=' + lat + '&lon=' + lon + '&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f&units=imperial';

    fetch(weatherForecastAPI)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayForecast(data);
            });
        } else { alert(response.status); }
        
    });
}

function displayCities(data) {
    //clear option list to prevent double rendered city options
    optionList.innerHTML = '';
    //for loop to create li elements based on data from geocode api, give user 5 options of cities matching the entered name
    for(i = 0; i < data.length; i++) {
        var cityName = data[i].name;
        var stateName = data[i].state;
        var countryName = data[i].country;
        var optionEl = document.createElement('li');
        optionEl.textContent = cityName + ", " + stateName + ', ' + countryName;
        //save latitude and longitude from geocode api data as data attributes
        optionEl.setAttribute('data-lat', data[i].lat);
        optionEl.setAttribute('data-lon', data[i].lon);
        optionList.appendChild(optionEl);
    }
}

function displayHistory() {
    //clear search history ul
    searchHistoryUl.innerHTML = '';
    //clear options ul
    optionList.innerHTML = '';
    //for loop to create li elements for search history items
    for(i = 0; i < searches.length; i++) {
        var searchEl = document.createElement('li');
        searchEl.textContent = searches[i].city;
        //save latitude and longitude from key value pairs
        searchEl.setAttribute('data-lat', searches[i].lat);
        searchEl.setAttribute('data-lon', searches[i].lon);
        searchHistoryUl.appendChild(searchEl);
    }
}

function displayCurrentWeather(data) {
    //set weather icon based on weather conditions
    if(data.weather[0].main === 'Clear') {
        var icon = '☀️';
    } else if(data.weather[0].main === 'Clouds') {
        var icon = '☁️';
    } else if(data.weather[0].main === 'Drizzle') {
        var icon = '🌦️';
    } else if(data.weather[0].main === 'Rain') {
        var icon = '🌧️';
    } else if(data.weather[0].main === 'Thunderstorm') {
        var icon = '🌩️';
    } else if(data.weather[0].main === 'Snow') {
        var icon = '❄️';
    } else if(data.weather[0].main === 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Ash' || 'Squall') {
        var icon = '🌫️';
    } else if(data.weather[0].main === 'Tornado'){
        var icon = '🌪️';
    } 
    //save current weather api data
    var name = data.name;
    var currDate = dayjs.unix(data.dt).format(' (M, DD, YYYY)');
    var currTemp = data.main.temp;
    var currWind = data.wind.speed;
    var currHum = data.main.humidity;
    //display current weather api data
    currWeatherHead.textContent = name + currDate + ' ' + icon;
    currTempText.textContent = 'Temperature: ' + currTemp + '°F';
    currWindText.textContent = 'Wind Speed: ' + currWind + ' MPH';
    currHumText.textContent = 'Humidity: ' + currHum + '%';
}

function displayForecast(data) {
    //m sets data.list index item
    var m = 6;
    //i sets forecast card content index item
    for(i = 0; i < 5; i++){
        //save forecast api data
        var date = data.list[m].dt;
        var temp = data.list[m].main.temp;
        var wind = data.list[m].wind.speed;
        var humidity = data.list[m].main.humidity;
        //set weather icon based on weather conditions
        if(data.list[m].weather[0].main === 'Clear') {
            var icon = '☀️';
        } else if(data.list[m].weather[0].main === 'Clouds') {
            var icon = '☁️';
        } else if(data.list[m].weather[0].main === 'Drizzle') {
            var icon = '🌦️';
        } else if(data.list[m].weather[0].main === 'Rain') {
            var icon = '🌧️';
        } else if(data.list[m].weather[0].main === 'Thunderstorm') {
            var icon = '🌩️';
        } else if(data.list[m].weather[0].main === 'Snow') {
            var icon = '❄️';
        } else if(data.list[m].weather[0].main === 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Ash' || 'Squall') {
            var icon = '🌫️';
        } else if(data.list[m].weather[0].main === 'Tornado'){
            var icon = '🌪️';
        }
        //display forecast data
        forecastDateText[i].textContent = dayjs.unix(date).format('M, DD, YYYY') + ' ' + icon;
        forecastTempText[i].textContent = 'Temp: ' + temp + '°F';
        forecastWindText[i].textContent = 'Wind: ' + wind + ' MPH';
        forecastHumText[i].textContent = 'Humidity: ' + humidity + '%';
        //increase data.list index item by 8 to get to the next forecast day (there is a forecast list item for every 3hrs)
        m = m + 8;
    }
}
//run init on page load
init();