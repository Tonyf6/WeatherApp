function toggleMenu() {
    var menu = document.getElementById('offcanvas-menu');
    var hamburger = document.querySelector('.hamburger-menu');

    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        hamburger.style.display = 'none'; 
    } else {
        hamburger.style.display = 'block';
    }
}

function fetchTodayWeather(city) {
    let apiKey = 'eb16dd52c0f0133731da86406157045b'; 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
                document.getElementById('weather-icon').setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
                document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)} °F`;
                document.querySelector('.weather-info').style.display = 'block';

                let highTemp = `${Math.round(data.main.temp_max)}`;
                let lowTemp = `${Math.round(data.main.temp_min)}`;
            if (city.trim() !== '') {
                document.getElementById('high-temp').textContent = highTemp;
                document.getElementById('low-temp').textContent = lowTemp;
                document.querySelector('.temp-info').style.display = 'block'; 
                document.getElementById('city-name').textContent = city; 
            } else {
                document.querySelector('.temp-info').style.display = 'none'; 
                document.getElementById('city-name').textContent = ''; 
            }
        })
}

// Function to fetch 5-day weather forecast for a given city
function fetchFiveDayWeather(city) {
    let apiKey = 'eb16dd52c0f0133731da86406157045b'; 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            
            console.log(data); 

            
            let forecastData = data.list.filter(item => {
                let currentDate = new Date();
                let forecastDate = new Date(item.dt * 1000);
                let tomorrowDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); 
                return forecastDate.getDate() !== currentDate.getDate() && forecastDate >= tomorrowDate; 
            });

            // Update HTML to display weather information for the next 5 days
            let weatherBoxes = document.querySelectorAll('.weather-box');
            let dayIndex = new Date().getDay(); // Get current day index
            forecastData.forEach((item, index) => {
                let forecastDate = new Date(item.dt * 1000); 
                let dayOfWeek = getDayOfWeek((dayIndex + index) % 7); 
                let box = weatherBoxes[index];
                box.querySelector('h3').textContent = `${dayOfWeek}`;
                box.querySelector('p').textContent = `${Math.round(item.main.temp)} °F`;

                // Set weather icon
                let iconCode = item.weather[0].icon; 
                let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`; 
                let weatherIcon = box.querySelector('.forecast-icon');
                weatherIcon.setAttribute('src', iconUrl);
                weatherIcon.setAttribute('alt', 'Weather Icon');
            });
        })
}


function isWeekday(day) {
    return day !== 0 && day !== 6; // Sunday is 0, Saturday is 6
}


function getDayOfWeek(day) {
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[day];
}

// Event listener for the search button click
document.getElementById('search-button').addEventListener('click', () => {
    let city = document.getElementById('search-input').value;
    if (city.trim() !== '') {
        fetchTodayWeather(city);
        fetchFiveDayWeather(city);
    } else {
    }
});

document.getElementById('favorites-btn').addEventListener('click', addToFavorites);

function addToFavorites() {
    let cityName = document.getElementById('city-name').textContent;
    let favoritesList = document.getElementById('favorites-list');

    if (cityName.trim() !== '') {
        // Check if the city is already in the favorites list
        let existingCity = Array.from(favoritesList.children).find(item => item.textContent.trim() === cityName);
        if (existingCity) {
            return;
        }

        let listItem = document.createElement('li');
        listItem.textContent = cityName;

        let removeImg = document.createElement('img');
        removeImg.src = 'images/Trashcan-512.webp'; 
        removeImg.alt = 'Remove';
        removeImg.classList.add('remove-btn'); 
        removeImg.addEventListener('click', function() {
            removeFromFavorites(listItem); 
        });
    
        listItem.appendChild(removeImg);
        favoritesList.appendChild(listItem); 
    } else {
    }
}

function removeFromFavorites(item) {
    item.remove(); // Remove the city from favorites list
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        let listItem = event.target.parentNode;
        let cityName = listItem.textContent.trim();
        listItem.remove();

    }
});