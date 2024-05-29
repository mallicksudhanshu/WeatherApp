const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { City: null, Temp: null, IconUrl: null, Humidity: null, WindSpeed: null, error: null });
});

app.post('/cityTemp', async (req, res) => {
    const cityName = req.body.city_name;
    try {
        const apiKey = 'a0032a27322169d77ab6e67c9a4840bc';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);

        if (response.data.cod === '404') {
            res.render('index', { City: null, Temp: null, IconUrl: null, Humidity: null, WindSpeed: null, error: 'City not found' });
        } else {
            const temp = response.data.main.temp;
            const icon = response.data.weather[0].icon;
            const humidity = response.data.main.humidity;
            const windSpeed = response.data.wind.speed;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            res.render('index', { City: cityName, Temp: temp, IconUrl: iconUrl, Humidity: humidity, WindSpeed: windSpeed, error: null });
        }
    } catch (error) {
        console.log('Error occurred while retrieving data', error);
        res.render('index', { City: null, Temp: null, IconUrl: null, Humidity: null, WindSpeed: null, error: 'An error occurred' });
    }
});

const port = 8000;
app.listen(port, () => {
    console.log('Server is running on port 8000');
});