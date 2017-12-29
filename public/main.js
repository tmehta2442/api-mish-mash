// Foursquare API Info
const clientId = 'HIDDEN';
const clientSecret = 'HIDDEN';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const imgPrefix = 'https://igx.4sqi.net/img/general/275x366';

// APIXU Info
const apiKey = 'HIDDEN';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const numArray = [];
for (var num = 0; num < 10; num++) {
  numArray.push(num);
}
let numberOfVenues = 5;
console.log(numArray.length);
while (numberOfVenues > 0) {
  console.log(numberOfVenues);
  numArray.splice([(Math.floor((Math.random() * (numArray.length)) + 1))], 1);
  numberOfVenues--;
}

console.log(numArray);
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions
async function getVenues() {
  const city = $input.val();
  const urlToFetch = url + city + '&venuePhotos=1&limit=10&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20170305';
  //console.log("url to fetch is ", urlToFetch);
  try {
    //console.log('try is working');
    let response = await fetch(urlToFetch);
    if(response.ok) {
      //console.log('good');
      let jsonResponse = await response.json();
      let venues = jsonResponse.response.groups[0].items.map(location => location.venue);
     // console.log("json response is" + jsonResponse);
      console.log(venues);
      //console.log("venues are", venues);
      return venues;
    } 
    throw new Error('FAILED');
  } catch(error) {
    console.log(error);
  }
}

async function getForecast() {
  const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=5&hour=11';
  try {
    let response = await fetch(urlToFetch);
    if(response.ok) {
      let jsonResponse = await response.json();
      //console.log(jsonResponse);
      let days = jsonResponse.forecast.forecastday;
      console.log(days);
      return days;
    }
  } catch(error) {
    console.log(error);
  }
}
// Render functions
function renderVenues(venues) {
  $venueDivs.forEach(($venue, index) => {
    let venueContent =
      '<h2>' + venues[index].name + '</h2>' +
      '<img class="venueimage" src="' + imgPrefix +
      venues[index].photos.groups[0].items[0].suffix + '"/>' +
      '<h3>Address:</h3>' +
      '<p>' + venues[index].location.address + '</p>' +
      '<p>' + venues[index].location.city + '</p>' +
      '<p>' + venues[index].location.country + '</p>';
    $venue.append(venueContent);
  });
  $destination.append('<h2>' + venues[0].location.city + '</h2>');
}

function renderForecast(days) {
  $weatherDivs.forEach(($day, index) => {
    let d = new Date(days[index].date)
    let n = d.getDay();
    let weatherContent =
      '<h2> High: ' + days[index].day.maxtemp_f + '</h2>' +
      '<h2> Low: ' + days[index].day.mintemp_f + '</h2>' +
      '<h2> Avg: ' + days[index].day.avgtemp_f + '</h2>' +
      '<img src="http://' + days[index].hour[0].condition.icon +
      '" class="weathericon" />' +
      '<h2>' + weekDays[n] + '</h2>';
    $day.append(weatherContent);
  });
}

function executeSearch() {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(days => renderForecast(days));
  return false;
}

$submit.click(executeSearch)
