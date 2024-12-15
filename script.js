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
    Forecast = document.querySelector(".Forecast");

const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=1e3e8f230b6064d27976e41163a82b77&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?appid=1e3e8f230b6064d27976e41163a82b77&exclude=minutely&units=metric&`;


function findUserLocation() {
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod != " " && data.cod != 200) {
                alert(data.message);
                return;
            }
            console.log(data);
            
            city.innerHTML = data.name + ", " + data.sys.country;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
            fetch(
                WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`
            )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
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
                    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }; // Format 12 jam
                
                    const formattedDate = currentDate.toLocaleDateString('id-ID', dateOptions);
                    const formattedTime = currentDate.toLocaleTimeString('id-ID', timeOptions);
                
                    date.innerHTML = `${formattedDate}, ${formattedTime}`; // Set inner HTML dari elemen date
                }
                
                // Panggil fungsi untuk menampilkan tanggal dan waktu saat halaman dimuat
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
                
            });
        });
}

function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date(dtValue * 1000 + offset);
    return date.toLocaleString([], { timeZone: "UTC", ...options });
}

function getLongFormateDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options);
}

converter.addEventListener("click", findUserLocation);

function addAnimationDelays() {
    // Animate highlights with delay
    document.querySelectorAll('.hightlights div').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Animate forecast cards with delay
    document.querySelectorAll('.daily-forecast div').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

function showLoading() {
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
}

function hideLoading() {
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'none';
}

async function searchLocation(city) {
    showLoading();
    try {
        // Reset animasi dengan menghapus dan menambahkan kembali class
        document.querySelectorAll('.hightlights div, .daily-forecast div').forEach(el => {
            el.style.opacity = '0';
        });
        
        // Tunggu data fetch
        await fetchWeatherData(city); // fungsi fetch yang sudah ada
        
        // Tambahkan kembali animasi
        addAnimationDelays();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addAnimationDelays();
    
    // Tambahkan efek ripple ke semua button
    document.querySelectorAll('button').forEach(button => {
        button.classList.add('ripple');
    });
});

function updateWeatherIcon(iconCode) {
    const weatherIcon = document.querySelector('.weatherIcon');
    weatherIcon.style.opacity = '0';
    
    setTimeout(() => {
        // Update icon (kode yang sudah ada)
        weatherIcon.style.opacity = '1';
        weatherIcon.style.animation = 'float 3s ease-in-out infinite';
    }, 300);
}