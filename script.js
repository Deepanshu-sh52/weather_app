const API_KEY = "a9c43d1aafffd09091b47fee2e0d2a02";
const BASE_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const content={
    locationName:document.querySelector(".location"),
    temp:document.querySelector(".temp"),
    unit:document.querySelector(".unit"),
    desc:document.querySelector(".desc"),
    max:document.querySelector(".max"),
    min:document.querySelector(".min"),
    feelsLike:document.querySelector(".feels-like"),
    humidity:document.querySelector(".humidity"),
    windSpeed:document.querySelector(".wind-speed"),
    pressure:document.querySelector(".pressure"),
}




const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  const locationName = searchForm.search.value.trim();
  if (!locationName) {
    alert("Please enter a city, state or country name.");
    return;
  }

  const isImperial=document.querySelector('#unitType').checked===false;

  const unitType=isImperial?'imperial':'metric';
  
  try{
    const data= await getWeatherByLocation(locationName,unitType);
    if(data.cod==='404')
    {
        alert("Location not Found");
        return;
    }
       displayWeatherData(data,isImperial);
  }
  catch{
    console.error("Error on submit",error);
  }
  searchForm.reset();
}

async function getWeatherByLocation(locationName, unitType) {
   const apiUrl = `${BASE_API_URL}?q=${locationName}&appid=${API_KEY}&units=${unitType}`;

   return await fetchData(apiUrl);
}
async function getWeatherByposition(lat,lon,unitType) {
    const apiUrl = `${BASE_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitType}`;
     return await fetchData(apiUrl);
}

async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data.", error);
    throw error;
  }
}

function displayWeatherData(data,isImperial){
    const { weather, main, wind, sys, name } = data;
   
    //set units
    const tempUnit=isImperial ? "°F" : "°C";
    const windSpeedUnit=isImperial ? "mph" : "m/s";
    const pressureUnit = isImperial ? "inHg" : "hPa";

    //pressureInHg   
    const pressureInHg=(main.pressure/33.33).toFixed(2);
    const pressure=isImperial ? pressureInHg : main.pressure;
    //set data
  content.locationName.textContent = name;
  content.temp.textContent = main.temp.toFixed(2);
  content.unit.textContent = tempUnit;
  content.desc.textContent = weather[0].description;
  content.max.textContent = `${main.temp_max} ${tempUnit}`;
  content.min.textContent = `${main.temp_min} ${tempUnit}`;
  content.feelsLike.textContent = `${main.feels_like} ${tempUnit}`;
  content.humidity.textContent = `${main.humidity}%`;
  content.windSpeed.textContent = `${wind.speed} ${windSpeedUnit}`;
  content.pressure.textContent = `${pressure} ${pressureUnit}`;
}