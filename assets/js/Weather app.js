// JavaScript Code
        class WeatherApp {
            constructor() {
                this.apiKey = 'demo'; // In production, use a real API key
                this.initializeElements();
                this.bindEvents();
                this.createBackgroundAnimation();
                this.loadDefaultWeather();
            }

            initializeElements() {
                this.cityInput = document.getElementById('cityInput');
                this.searchBtn = document.getElementById('searchBtn');
                this.weatherContent = document.getElementById('weatherContent');
                this.errorMessage = document.getElementById('errorMessage');
                this.loadingMessage = document.getElementById('loadingMessage');
                
                // Weather display elements
                this.weatherIcon = document.getElementById('weatherIcon');
                this.temperature = document.getElementById('temperature');
                this.location = document.getElementById('location');
                this.description = document.getElementById('description');
                this.humidity = document.getElementById('humidity');
                this.windSpeed = document.getElementById('windSpeed');
                this.feelsLike = document.getElementById('feelsLike');
                this.pressure = document.getElementById('pressure');
            }

            bindEvents() {
                this.searchBtn.addEventListener('click', () => this.searchWeather());
                this.cityInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.searchWeather();
                    }
                });
                this.cityInput.addEventListener('input', () => this.hideError());
            }

            async searchWeather() {
                const city = this.cityInput.value.trim();
                if (!city) {
                    this.showError('Please enter a city name');
                    return;
                }

                this.showLoading();
                
                try {
                    // Simulate API call with demo data
                    await this.delay(1500); // Simulate network delay
                    const weatherData = this.getDemoWeatherData(city);
                    this.displayWeather(weatherData);
                } catch (error) {
                    this.showError('Failed to fetch weather data. Please try again.');
                } finally {
                    this.hideLoading();
                }
            }

            getDemoWeatherData(city) {
                // Demo weather data with various conditions
                const conditions = ['sunny', 'rainy', 'cloudy', 'snowy', 'stormy'];
                const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
                
                const weatherMappings = {
                    sunny: { icon: '☀️', temp: 25, desc: 'sunny', wind: 12 },
                    rainy: { icon: '🌧️', temp: 15, desc: 'light rain', wind: 18 },
                    cloudy: { icon: '☁️', temp: 20, desc: 'cloudy', wind: 8 },
                    snowy: { icon: '❄️', temp: -2, desc: 'snow', wind: 15 },
                    stormy: { icon: '⛈️', temp: 18, desc: 'thunderstorm', wind: 25 }
                };

                const weather = weatherMappings[randomCondition];
                
                return {
                    name: city,
                    main: {
                        temp: weather.temp + Math.floor(Math.random() * 10) - 5,
                        feels_like: weather.temp + Math.floor(Math.random() * 6) - 3,
                        pressure: 1013 + Math.floor(Math.random() * 40) - 20,
                        humidity: 50 + Math.floor(Math.random() * 40)
                    },
                    weather: [{
                        main: weather.desc,
                        description: weather.desc,
                        icon: weather.icon
                    }],
                    wind: {
                        speed: weather.wind + Math.floor(Math.random() * 10) - 5
                    },
                    condition: randomCondition
                };
            }

            displayWeather(data) {
                // Update weather display
                this.weatherIcon.textContent = data.weather[0].icon;
                this.temperature.textContent = `${Math.round(data.main.temp)}°C`;
                this.location.textContent = data.name;
                this.description.textContent = data.weather[0].description;
                this.humidity.textContent = `${data.main.humidity}%`;
                this.windSpeed.textContent = `${Math.round(data.wind.speed)} km/h`;
                this.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
                this.pressure.textContent = `${data.main.pressure} hPa`;

                // Update background based on weather condition
                this.updateBackground(data.condition);
                
                // Show weather content
                this.weatherContent.style.display = 'block';
                this.hideError();
            }

            updateBackground(condition) {
                // Remove existing weather classes
                document.body.classList.remove('sunny', 'rainy', 'cloudy', 'snowy', 'stormy');
                
                // Add new weather class
                if (condition) {
                    document.body.classList.add(condition);
                }

                // Update floating particles
                this.updateFloatingParticles(condition);
            }

            updateFloatingParticles(condition) {
                const container = document.getElementById('floatingElements');
                container.innerHTML = '';

                const particleMappings = {
                    sunny: { char: '✨', count: 20, color: '#f1c40f' },
                    rainy: { char: '💧', count: 30, color: '#3498db' },
                    cloudy: { char: '☁️', count: 15, color: '#95a5a6' },
                    snowy: { char: '❄️', count: 25, color: '#ecf0f1' },
                    stormy: { char: '⚡', count: 10, color: '#e74c3c' }
                };

                const particles = particleMappings[condition] || particleMappings.sunny;

                for (let i = 0; i < particles.count; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.textContent = particles.char;
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.color = particles.color;
                    particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
                    particle.style.animationDelay = Math.random() * 20 + 's';
                    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                    container.appendChild(particle);
                }
            }

            createBackgroundAnimation() {
                // Initialize with default particles
                this.updateFloatingParticles('sunny');
            }

            loadDefaultWeather() {
                // Show a default city weather on load
                this.cityInput.value = 'London';
                setTimeout(() => this.searchWeather(), 1000);
            }

            showLoading() {
                this.loadingMessage.style.display = 'block';
                this.weatherContent.style.display = 'none';
                this.hideError();
            }

            hideLoading() {
                this.loadingMessage.style.display = 'none';
            }

            showError(message) {
                this.errorMessage.textContent = message;
                this.errorMessage.style.display = 'block';
                this.weatherContent.style.display = 'none';
                this.hideLoading();
            }

            hideError() {
                this.errorMessage.style.display = 'none';
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        // Initialize the weather app when the DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new WeatherApp();
        });

        // Add some interactive effects
        document.addEventListener('mousemove', (e) => {
            const card = document.querySelector('.weather-card');
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            }
        });