
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geoData = require('./data/geo.js');
const weatherData = require('./data/weather.js');
const  request  = require('superagent');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.static('public'));
const {
  GEO_CODE,
  WEATHER_CODE,
  YELP_CODE,
  HIKING_CODE

} = process.env;

async function getLatLong(cityName){
 const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${GEO_CODE}&q=${cityName}&format=json`);

 const city = response.body[0];
console.log(response.body);
    return {
      formatted_query: city.display_name,
      latitude: city.lat,
      longitude: city.lon,
    };
}
async function getWeather(lat, lon) {
  const data = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=38.123&lon=-78.543&key=${WEATHER_CODE}`)
  const forecastArray = data.map((weatherItem) =>{
    return {
        forecast: weatherItem.weather.description,
        time: new Date(weatherItem.ts * 1000),
    };
  });
  return forecastArray;
}

app.get('/location', async (req,  res) => {
  try {
  const userInput = req.query.search;
  const mungedData = await getLatLong(userInput);
  console.log(userInput);
  
  res.json(mungedData);
} catch (e) {
    res.status(500).json({ error: e.message });
}


});
app.get('/weather', (req, res) => {
  try {
  
  const userLat = req.query.latitude;
  const userLon = req.query.longitude;
  const mungedData = getWeather(userLat, userLon);
  
  
  res.json(mungedData);
  } catch (e) {
    res.status(500).json({ error: e.message});
  }



});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});