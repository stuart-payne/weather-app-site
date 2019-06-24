<template>
  <div id="app">
  <ul class="title">
    <li id= "titleEle">Stuart's Useless Weather App</li>
  </ul>
    <div id ="inputContainer">
      <div id="userInput1" class="border">
        <p class="pSpace"> Choose a location to get the current weather: </p>
        <button class="butt" v-on:click="geolocation">Your Location</button>
        <p class="pSpace"> or enter a city name </p>
        <input v-model="cityInput" v-on:keyup.enter="onSubmit" placeholder="City Name">
      </div>
    </div>
    <div v-if="renderWeather" id="weatherInfo" class="border">
      <div class="weatherAtt" v-for="(value, key) in getWeatherAtts()">
        <p class="weatherKey">{{ key }}</p>
        <p class="weatherValue"> {{ value }} </p>
      </div>
    </div>
  </div>
</template>

<script>
/* to-do
  random comment
  */
export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      apiKey: "1200f8303510fcf7da4af366cc9f9b81",
      apiUrl: "https://api.openweathermap.org/data/2.5/weather?",
      cityApiUrl: "http://localhost:3000/city/",
      checkApiUrl: "http://localhost:3000/check/",
      coords: undefined,
      weatherResponse: undefined,
      weather: "",
      city: "",
      cityInput: "",
      temperature: "",
      windDir: "",
      windSpeed: "",
      humidity: "",
      pressure: "",
    };
  },
  methods: {
    geolocation: function() {
      navigator.geolocation.getCurrentPosition(this.geoCallback.bind(this));
    },
    geoCallback: function(position) {
        console.log(position);
        this.getWeather(position);
    },
    getWeather: function(position) {
      console.log(position);
      var url = `${this.apiUrl}lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${this.apiKey}&units=metric`;
      console.log(url);
      this.weatherFetch(url);
    },
    getWeatherByCityName: function(cityName) {
      var url = `${this.apiUrl}q=${cityName}&appid=${this.apiKey}&units=metric`;
      this.weatherFetch(url);
    },
    checkCityName: async function(cityName) {
      var url = `${this.checkApiUrl}${cityName}`;
      var result = await fetch(url, {mode: "cors"})
        .then((response) => {
          return response.json();
        });
      if(result.check) {
        this.getWeatherByCityName(cityName);
      } else {
        this.city = "Unknown City";
      }
    },
    onSubmit: function() {
      this.checkCityName(this.cityInput);
    },
    capitiliseFirstLetter: function(str) {
      var splitStrings = str.split(" ");
      var newStrArray = [];
      splitStrings.forEach(function(ele) {
        
        ele = ele.charAt(0).toUpperCase() + ele.substring(1);
        newStrArray.push(ele);
      });
      var result = newStrArray.reduce((acc, el) => {
        return acc + " " + el;
      });
      return result;
      
    },
    weatherFetch: function(url) {
      fetch(url, {mode: "cors"})
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          this.weatherResponse = myJson;
        });
    },
    getWeatherAtts: function() {
      return {
        "City:": this.city,
        "Weather:": this.weather,
        "Temperature:": this.temperatureComp,
        "Wind Direction:": this.windDirComp,
        "Wind Speed:": this.windSpeedComp,
        "Humidity:": this.humidityComp,
        "Pressure:": this.pressureComp
      }
    }
  },
  watch: {
    /*coords: function() {
      var url = `${this.apiUrl}lat=${this.coords.latitude}&lon=${this.coords.longitude}&appid=${this.apiKey}`;
      fetch(url)
        .then(function(response){
          this.weatherResponse = JSON.parse(response.json);
        });
    },*/
    weatherResponse: function() {
      this.weather = this.capitiliseFirstLetter(this.weatherResponse.weather[0].description);
      let url = `${this.cityApiUrl}${this.weatherResponse.id}`;
      fetch(url, {mode: "cors"})
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((obj) => {
            console.log(obj);
            this.city = `${obj.name}, ${obj.country}`;
        });
      this.windDir = this.weatherResponse.wind.deg;
      this.windSpeed = this.weatherResponse.wind.speed;
      this.temperature = this.weatherResponse.main.temp;
      this.humidity = this.weatherResponse.main.humidity;
      this.pressure = this.weatherResponse.main.pressure;
    }
  },
  computed: {
    //this could easily be refactored to one function
    
    temperatureComp: function(){
      return `${this.temperature}°C`;
    },
    windDirComp: function(){
      return `${this.windDir}°`;
    },
    windSpeedComp: function(){
      return `${this.windSpeed} m/s`;
    },
    humidityComp: function(){
      return `${this.humidity}%`;
    },
    pressureComp: function(){
      return `${this.pressure} hPa`;
    },
    renderWeather: function(){
      return (this.weatherResponse ? true : false);
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: auto;
}

* {
  margin: 0px;
}

#titleEle {
  padding: 8px;
  font-weight: bolder;
  font-size: 20px;

}

.title {
  padding: 0px;
  list-style-type: none;
  top: 0;
  width: 100%;
  text-align: center;
  background: #2c3e50;
  color: white;
  height: 40px;
  margin-bottom: 20px;
  box-shadow: 3px 3px 3px darkgray;
}

#weatherInfo {
  max-width: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
  font-weight: bolder;
}

.weatherAtt {
  margin: 4px;
  display: flex;
  justify-content: space-between;
}

#userInput1 {
  max-width: 300px;
  text-align: center;
  margin: 5px;
  padding: 5px;
  display: inline-block;
  font-weight: bold;
}

#inputContainer {
  margin: auto;
  width: 314px;
}

.border {
    border: 2px solid #2c3e50;
}

.pSpace {
  margin: 5px;
}

.butt {
  background-color: white;
  border: 2px solid #2c3e50;
  box-shadow: 3px 3px 5px lightgrey;
}

.butt:hover {
  background-color: lightskyblue;
}

.butt:active {
  background-color: #2c3e50;
  color: white;
}
</style>
