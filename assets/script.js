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
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchText + '&limit=5&appid=7d6d7f71cbdd0e76a6f7fb3306fcce7f';

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCities(data);
            });
        } else alert(response.status);
    });

}

function displayCities(data) {
    console.log(data);
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
    console.log(event.target);



});