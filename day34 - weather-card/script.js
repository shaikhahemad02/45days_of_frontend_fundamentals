const mockWeatherData = {
    newyork: {
        city: "New York",
        temp: 18,
        condition: "Partly Cloudy",
        icon: "⛅",
        humidity: 62,
        wind: 14,
        feelsLike: 16
    },
    tokyo: {
        city: "Tokyo",
        temp: 27,
        condition: "Sunny",
        icon: "☀️",
        humidity: 45,
        wind: 8,
        feelsLike: 29
    },
    london: {
        city: "London",
        temp: 11,
        condition: "Rainy",
        icon: "🌧️",
        humidity: 88,
        wind: 22,
        feelsLike: 8
    }
};

const citySelect = document.querySelectorAll('.city-btn');
const currentCity = document.querySelector('.active').dataset.city;
updateWeatherCard(currentCity);

citySelect.forEach(button => {
    button.addEventListener('click', (e) => {
        citySelect.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        const city = e.target.dataset.city;
        updateWeatherCard(city);
    })
});

function updateWeatherCard(city) {
    const weatherData = mockWeatherData[city];
    document.querySelector('.city').textContent = weatherData.city;
    document.querySelector('.temp').textContent = `${weatherData.temp}°C`;
    document.querySelector('.cond').textContent = `${weatherData.condition} ${weatherData.icon}`;
    document.querySelector('.humidity').textContent = `Humidity: ${weatherData.humidity}%`;
    document.querySelector('.wind').textContent = `Wind: ${weatherData.wind} km/h`;
    document.querySelector('.feels-like').textContent = `Feels like: ${weatherData.feelsLike}°C`;
    const condition = weatherData.condition.toLowerCase();
    
        document.querySelector('.weather-card').classList.remove('cloudy', 'rainy', 'sunny');
    if (condition.includes('sunny')) {
        document.querySelector('.weather-card').classList.add('sunny');
    } else if (condition.includes('cloudy')) {
        document.querySelector('.weather-card').classList.add('cloudy');
    } else if (condition.includes('rainy')) {
        document.querySelector('.weather-card').classList.add('rainy');
    }
}