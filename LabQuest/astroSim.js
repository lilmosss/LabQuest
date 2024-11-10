const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Colors
const YELLOW = 'yellow';  // Sun
const GRAY = 'gray';      // Planets
const BLUE = 'blue';      // Earth
const WHITE = 'white';    // Moons

// Planet attributes: (color, radius, distance from Sun, speed of orbit)
const planets = [
    { name: 'Mercury', color: GRAY, radius: 5, distance: 60, speed: 0.05 },
    { name: 'Venus', color: GRAY, radius: 10, distance: 100, speed: 0.03 },
    { name: 'Earth', color: BLUE, radius: 15, distance: 150, speed: 0.02 },
    { name: 'Mars', color: GRAY, radius: 12, distance: 220, speed: 0.015 },
    { name: 'Jupiter', color: GRAY, radius: 30, distance: 300, speed: 0.01 },
];

// Moon for Earth
const earthMoon = { color: WHITE, radius: 3, distance: 20, speed: 0.03 };

// Sun position (center of the canvas)
const sunX = WIDTH / 2;
const sunY = HEIGHT / 2;

// Time tracking for Earth
let showTimeOfDay = true;

// Function to draw the Sun
function drawSun() {
    ctx.beginPath();
    ctx.arc(sunX, sunY, 50, 0, Math.PI * 2);
    ctx.fillStyle = YELLOW;
    ctx.fill();
}

// Function to draw planets and moons
function drawPlanetsAndMoons() {
    const currentTime = Date.now();

    planets.forEach(planet => {
        const angle = currentTime * planet.speed;  // The angle changes over time to simulate orbit
        const planetX = sunX + planet.distance * Math.cos(angle * Math.PI / 180);
        const planetY = sunY + planet.distance * Math.sin(angle * Math.PI / 180);

        ctx.beginPath();
        ctx.arc(planetX, planetY, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();

        // Draw moons (only for Earth)
        if (planet.name === 'Earth') {
            const moonAngle = currentTime * earthMoon.speed;
            const moonX = planetX + earthMoon.distance * Math.cos(moonAngle * Math.PI / 180);
            const moonY = planetY + earthMoon.distance * Math.sin(moonAngle * Math.PI / 180);

            ctx.beginPath();
            ctx.arc(moonX, moonY, earthMoon.radius, 0, Math.PI * 2);
            ctx.fillStyle = earthMoon.color;
            ctx.fill();
        }
    });
}

// Function to display the time of day
function displayTimeOfDay() {
    const text = "Time of day: Earth Rotation";
    ctx.fillStyle = WHITE;
    ctx.font = '24px Arial';
    ctx.fillText(text, 20, HEIGHT - 50);
}

// Event listener for space bar to toggle time display
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        showTimeOfDay = !showTimeOfDay;
    }
});

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);  // Clear the canvas

    // Draw the Sun
    drawSun();

    // Draw planets and moons
    drawPlanetsAndMoons();

    // Display time of day if flag is true
    if (showTimeOfDay) {
        displayTimeOfDay();
    }

    // Request the next frame
    requestAnimationFrame(animate);
}

// Start the animation
animate();

