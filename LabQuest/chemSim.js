const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Constants
const WIDTH = 800;
const HEIGHT = 600;
const SOLID_COLOR = 'blue';
const LIQUID_COLOR = 'green';
const GAS_COLOR = 'red';
const PARTICLE_RADIUS = 5;
const PARTICLES_COUNT = 50;

// Initial state
let state = 'solid';
let temperature = 0;  // Temperature starts at 0°C
let pressure = 1.0;   // Normal atmospheric pressure
let particles = [];
let containerWidth = WIDTH / 2;
let containerHeight = HEIGHT - 150;
let containerX = (WIDTH - containerWidth) / 2;
let containerY = HEIGHT / 2 - containerHeight / 2;

// Create particles in different states
function createParticles() {
  particles = [];
  if (state === 'solid') {
    const rows = 5;
    const columns = PARTICLES_COUNT / rows;
    const xStart = containerX + (containerWidth - columns * PARTICLE_RADIUS * 2) / 2;
    const yStart = containerY + containerHeight - rows * PARTICLE_RADIUS * 2;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const x = xStart + j * (PARTICLE_RADIUS * 2);
        const y = yStart + i * (PARTICLE_RADIUS * 2);
        particles.push({ x, y, color: SOLID_COLOR });
      }
    }
  } else if (state === 'liquid') {
    for (let i = 0; i < PARTICLES_COUNT; i++) {
      const x = containerX + Math.random() * (containerWidth - PARTICLE_RADIUS * 2);
      const y = containerY + containerHeight / 2 + Math.random() * (containerHeight / 2 - 10);
      particles.push({ x, y, color: LIQUID_COLOR });
    }
  } else if (state === 'gas') {
    for (let i = 0; i < PARTICLES_COUNT; i++) {
      const x = Math.random() * (containerWidth - PARTICLE_RADIUS * 2) + containerX;
      const y = Math.random() * (containerHeight - PARTICLE_RADIUS * 2) + containerY;
      particles.push({ x, y, color: GAS_COLOR });
    }
  }
}

// Update particle movement based on state
function updateParticles() {
  if (state === 'solid') {
    // Keep particles in fixed positions
  } else if (state === 'liquid') {
    particles.forEach(p => {
      p.x += Math.random() * 2 - 1;
      p.y += Math.random() * 2 - 1;
      // Constrain particles within the bottom half of the container
      if (p.x < containerX + PARTICLE_RADIUS || p.x > containerX + containerWidth - PARTICLE_RADIUS) {
        p.x = Math.max(containerX + PARTICLE_RADIUS, Math.min(containerX + containerWidth - PARTICLE_RADIUS, p.x));
      }
      if (p.y < containerY + containerHeight / 2) {
        p.y = containerY + containerHeight / 2 + Math.random() * 5;
      }
    });
  } else if (state === 'gas') {
    particles.forEach(p => {
      p.x += Math.random() * 4 - 2;
      p.y += Math.random() * 4 - 2;
      // Bounce off the container boundaries
      if (p.x < containerX + PARTICLE_RADIUS || p.x > containerX + containerWidth - PARTICLE_RADIUS) {
        p.x = Math.max(containerX + PARTICLE_RADIUS, Math.min(containerX + containerWidth - PARTICLE_RADIUS, p.x));
      }
      if (p.y < containerY + PARTICLE_RADIUS || p.y > containerY + containerHeight - PARTICLE_RADIUS) {
        p.y = Math.max(containerY + PARTICLE_RADIUS, Math.min(containerY + containerHeight - PARTICLE_RADIUS, p.y));
      }
    });
  }
}

// Display current state and conditions
function displayState() {
  document.getElementById('state').textContent = `Current State: ${state.charAt(0).toUpperCase() + state.slice(1)}`;
  document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
  document.getElementById('pressure').textContent = `Pressure: ${pressure.toFixed(1)} atm`;
}

// Main loop
function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw container
  ctx.strokeStyle = 'black';
  ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);

  // Update particles
  updateParticles();

  // Draw particles
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  // Display state and conditions
  displayState();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Event listeners for user input
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    temperature += 10;
    if (temperature > 100 && state !== 'gas') {
      state = 'gas';
      createParticles();
    } else if (temperature <= 100 && temperature > 0 && state !== 'liquid') {
      state = 'liquid';
      createParticles();
    } else if (temperature <= 0 && state !== 'solid') {
      state = 'solid';
      createParticles();
    }
  } else if (event.key === 'ArrowDown') {
    temperature -= 10;
    if (temperature > 100 && state !== 'gas') {
      state = 'gas';
      createParticles();
    } else if (temperature <= 100 && temperature > 0 && state !== 'liquid') {
      state = 'liquid';
      createParticles();
    } else if (temperature <= 0 && state !== 'solid') {
      state = 'solid';
      createParticles();
    }
  } else if (event.key === 'ArrowLeft') {
    pressure = Math.max(0.5, pressure - 0.1);
  } else if (event.key === 'ArrowRight') {
    pressure = Math.min(2.0, pressure + 0.1);
  }
});

// Start the game
createParticles();
gameLoop();
