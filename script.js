/* Deklarasi Variabel Element */
const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelslike = document.querySelector(".feelslike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    VValue = document.getElementById("VValue"),
    PValue = document.getElementById("PValue"),
    Forecast = document.querySelector(".Forecast"),
    WDValue = document.getElementById("WDValue"),
    RCValue = document.getElementById("RCValue"),
    RVValue = document.getElementById("RVValue");

/* Endpoint API */
const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=1e3e8f230b6064d27976e41163a82b77&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?appid=1e3e8f230b6064d27976e41163a82b77&exclude=minutely&units=metric&`;

const darkModeBtn = document.getElementById('darkMode');
const notificationsBtn = document.getElementById('notifications');
const getLocationBtn = document.getElementById('getLocation');
const shareWeatherBtn = document.getElementById('shareWeather');

/* Pengaturan Tema Gelap */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkModeButton(savedTheme);
}

function updateDarkModeButton(theme) {
    darkModeBtn.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
}

darkModeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeButton(newTheme);
});

/* Fitur Geolokasi */
getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        getLocationBtn.disabled = true;
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `${WEATHER_API_ENDPOINT}&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    if (data.name) {
                        userLocation.value = data.name;
                        findUserLocation();
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Tidak dapat mendapatkan lokasi');
                } finally {
                    getLocationBtn.disabled = false;
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Tidak dapat mengakses lokasi Anda');
                getLocationBtn.disabled = false;
            }
        );
    } else {
        alert('Browser Anda tidak mendukung geolokasi');
    }
});

shareWeatherBtn.addEventListener('click', async () => {
    const weatherInfo = `
        Cuaca di ${city.innerText}:
        Suhu: ${temperature.innerText}
        Kondisi: ${description.innerText}
        Kelembapan: ${HValue.innerText}
        Kecepatan Angin: ${WValue.innerText}
    `.trim();

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Info Cuaca',
                text: weatherInfo,
                url: window.location.href
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        navigator.clipboard.writeText(weatherInfo)
            .then(() => alert('Info cuaca disalin ke clipboard!'))
            .catch(err => console.error('Error copying to clipboard:', err));
    }
});

notificationsBtn.addEventListener('click', async () => {
    if (!('Notification' in window)) {
        alert('Browser Anda tidak mendukung notifikasi');
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        localStorage.setItem('weatherNotifications', 'enabled');
        notificationsBtn.innerHTML = '<i class="fas fa-bell"></i>';
        scheduleWeatherNotifications();
    } else {
        localStorage.setItem('weatherNotifications', 'disabled');
        notificationsBtn.innerHTML = '<i class="fas fa-bell-slash"></i>';
    }
});

function scheduleWeatherNotifications() {
    setInterval(checkWeatherAndNotify, 3600000); // Check every hour
}

function checkWeatherAndNotify() {
    if (localStorage.getItem('weatherNotifications') !== 'enabled') return;

    const currentWeather = description.innerText.toLowerCase();
    if (currentWeather.includes('hujan')) {
        new Notification('Peringatan Cuaca', {
            body: 'Akan turun hujan di lokasi Anda',
            icon: 'https://openweathermap.org/img/wn/10d@2x.png'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    if (localStorage.getItem('weatherNotifications') === 'enabled') {
        scheduleWeatherNotifications();
    }
});

const originalFindUserLocation = findUserLocation;
findUserLocation = function() {
    const location = userLocation.value.trim();
    if (location) {
        originalFindUserLocation();
    }
};

/* Fungsi Utama Pencarian Lokasi */
function findUserLocation() {
    showLoading();
    
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.cod !== 200) {
                alert(data.message);
                return;
            }
            
            const countryCode = data.sys.country;
            city.innerHTML = data.name + ", " + countryCode;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
            
            fetch(
                WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`
            )
            .then((response) => response.json())
            .then((data) => {
                temperature.innerHTML = Math.floor(data.list[0].main.temp) + "°";
                feelslike.innerHTML = "Terasa seperti: " + Math.floor(data.list[0].main.feels_like) + "°";

                const weatherTranslations = {
                    "thunderstorm with light rain": "badai petir dengan hujan ringan",
                    "thunderstorm with rain": "badai petir dengan hujan",
                    "thunderstorm with heavy rain": "badai petir dengan hujan deras",
                    "light thunderstorm": "badai petir ringan",
                    "thunderstorm": "badai petir",
                    "heavy thunderstorm": "badai petir berat",
                    "ragged thunderstorm": "badai petir tidak teratur",
                    "thunderstorm with light drizzle": "badai petir dengan gerimis ringan",
                    "thunderstorm with drizzle": "badai petir dengan gerimis",
                    "thunderstorm with heavy drizzle": "badai petir dengan gerimis deras",
                    "light intensity drizzle": "gerimis intensitas ringan",
                    "drizzle": "gerimis",
                    "heavy intensity drizzle": "gerimis intensitas berat",
                    "light intensity drizzle rain": "hujan gerimis intensitas ringan",
                    "drizzle rain": "hujan gerimis",
                    "heavy intensity drizzle rain": "hujan gerimis intensitas berat",
                    "shower rain and drizzle": "hujan deras dan gerimis",
                    "heavy shower rain and drizzle": "hujan deras dan gerimis berat",
                    "shower drizzle": "gerimis deras",
                    "light rain": "hujan ringan",
                    "moderate rain": "hujan sedang",
                    "heavy intensity rain": "hujan intensitas berat",
                    "very heavy rain": "hujan sangat deras",
                    "extreme rain": "hujan ekstrem",
                    "freezing rain": "hujan beku",
                    "light intensity shower rain": "hujan deras intensitas ringan",
                    "shower rain": "hujan deras",
                    "heavy intensity shower rain": "hujan deras intensitas berat",
                    "ragged shower rain": "hujan deras tidak teratur",
                    "light snow": "salju ringan",
                    "snow": "salju",
                    "heavy snow": "salju berat",
                    "sleet": "hujan es",
                    "light shower sleet": "hujan es ringan",
                    "shower sleet": "hujan es",
                    "light rain and snow": "hujan dan salju ringan",
                    "rain and snow": "hujan dan salju",
                    "light shower snow": "salju hujan ringan",
                    "shower snow": "salju hujan",
                    "heavy shower snow": "salju hujan berat",
                    "mist": "kabut",
                    "smoke": "asap",
                    "haze": "kabut",
                    "sand/dust whirls": "putaran pasir/debu",
                    "fog": "kabut tebal",
                    "sand": "pasir",
                    "dust": "debu",
                    "volcanic ash": "abu vulkanik",
                    "squalls": "angin kencang",
                    "tornado": "tornado",
                    "clear sky": "langit cerah",
                    "few clouds": "beberapa awan",
                    "scattered clouds": "awan tersebar",
                    "broken clouds": "awan pecah",
                    "overcast clouds": "awan mendung",
                };                

                function translateWeatherDescription(description) {
                    return weatherTranslations[description] || description;
                }

                description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp` + 
                translateWeatherDescription(data.list[0].weather[0].description);

                function displayCurrentDate() {
                    const currentDate = new Date();
                    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
                
                    const formattedDate = currentDate.toLocaleDateString('id-ID', dateOptions);
                    const formattedTime = currentDate.toLocaleTimeString('id-ID', timeOptions);
                
                    date.innerHTML = `${formattedDate}, ${formattedTime}`;
                }
                
                displayCurrentDate();

                HValue.innerHTML = Math.round(data.list[0].main.humidity) + "<span>%<span>";
                WValue.innerHTML = Math.round(data.list[0].wind.speed) + "<span>m/s<span>";
                
                const options1 = {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                };

                if (data.city.sunrise && data.city.sunset && data.city.timezone) {
                    const sunrise = data.city.sunrise;
                    const sunset = data.city.sunset;
                    const timezoneOffset = data.city.timezone;
                    SRValue.innerHTML = getLongFormateDateTime(sunrise, timezoneOffset * 1000, options1);
                    SSValue.innerHTML = getLongFormateDateTime(sunset, timezoneOffset * 1000, options1);
                } else {
                    SRValue.innerHTML = "Sunrise data not available";
                    SSValue.innerHTML = "Sunset data not available";
                }

                CValue.innerHTML = Math.round(data.list[0].clouds.all) + "<span>%<span>";
                VValue.innerHTML = (Math.floor(data.list[0].visibility / 1000)) + "<span>km<span>";
                PValue.innerHTML = Math.round(data.list[0].main.pressure) + "<span>hPa<span>";

                const dailyData = [];
                const uniqueDates = new Set();

                for (let i = 0; i < data.list.length; i++) {
                    const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
                    if (!uniqueDates.has(date)) {
                        uniqueDates.add(date);
                        dailyData.push(data.list[i]);
                    }
                    if (dailyData.length >= 8) break;
                }

                const dailyForecast = document.getElementById('dailyForecast');
                dailyForecast.innerHTML = '';

                dailyData.forEach((day) => {
                    const date = new Date(day.dt * 1000).toLocaleDateString();
                    const temp = Math.floor(day.main.temp);
                    const description = translateWeatherDescription(day.weather[0].description);
                    const humidity = Math.round(day.main.humidity);
                    const windSpeed = Math.round(day.wind.speed);

                    const dayElement = document.createElement('div');
                    dayElement.classList.add('day-forecast');
                    
                    const weatherImg = document.createElement('img');
                    weatherImg.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                    weatherImg.alt = description;
                    
                    dayElement.style.opacity = '0';
                    dayElement.style.animation = 'fadeIn 0.5s ease forwards';
                    
                    dayElement.innerHTML = `
                        <p>${date}</p>
                        <p>Temperature: ${temp}°C</p>
                        <p>keterangan: ${description}</p>
                        <p>Kelembapan: ${humidity}%</p>
                        <p>Kecepatan angin: ${windSpeed} m/s</p>
                    `;
                    
                    dayElement.insertBefore(weatherImg, dayElement.firstChild);
                    dailyForecast.appendChild(dayElement);
                });

                const windDegree = data.list[0].wind.deg;
                const windDirection = getWindDirection(windDegree);
                WDValue.innerHTML = `${windDirection}`;

                const rainChance = data.list[0].pop ? Math.round(data.list[0].pop * 100) : 0;
                RCValue.innerHTML = `${rainChance}<span>%</span>`;

                const rainVolume = data.list[0].rain ? 
                    (data.list[0].rain['3h'] || 0).toFixed(1) : 
                    '0.0';
                RVValue.innerHTML = `${rainVolume}<span>mm</span>`;

                console.log('Wind Degree:', windDegree);
                console.log('Wind Direction:', windDirection);
                console.log('Rain Chance:', rainChance);
                console.log('Rain Volume:', rainVolume);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mencari lokasi');
        })
        .finally(() => {
            hideLoading();
        });
}

/* Fungsi Format Waktu */
function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date(dtValue * 1000 + offset);
    return date.toLocaleString([], { timeZone: "UTC", ...options });
}

function getLongFormateDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options);
}

converter.addEventListener("click", findUserLocation);

/* Fungsi Arah Mata Angin */
function getWindDirection(degree) {
    if (degree === undefined) return 'N/A';
    const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
}

/* Fungsi Loading */
function showLoading() {
    const spinner = document.querySelector('.loading-spinner');
    spinner.classList.add('show');
}

function hideLoading() {
    const spinner = document.querySelector('.loading-spinner');
    spinner.classList.remove('show');
}

/* Fungsi Animasi */
function addAnimationDelays() {
    document.querySelectorAll('.hightlights div').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.daily-forecast div').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

async function searchLocation(city) {
    showLoading();
    try {
        document.querySelectorAll('.hightlights div, .daily-forecast div').forEach(el => {
            el.style.opacity = '0';
        });
        
        await fetchWeatherData(city);
        
        addAnimationDelays();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addAnimationDelays();
    
    document.querySelectorAll('button').forEach(button => {
        button.classList.add('ripple');
    });
});

/* Fungsi Update Icon */
function updateWeatherIcon(iconCode) {
    const weatherIcon = document.querySelector('.weatherIcon');
    weatherIcon.style.opacity = '0';
    
    setTimeout(() => {
        weatherIcon.style.opacity = '1';
        weatherIcon.style.animation = 'float 3s ease-in-out infinite';
    }, 300);
}

/* Event Listeners */
userLocation.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        findUserLocation();
    }
});
