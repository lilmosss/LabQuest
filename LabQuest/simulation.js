// Setting up the canvas and context
const canvas = document.getElementById("simulation-canvas");
const ctx = canvas.getContext("2d");

// Simulation variables
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Liquid and object densities
const liquidDensities = { Water: 1.0, Oil: 0.8, Mercury: 13.6 };
const objectDensities = { Ball: 0.9, Rock: 2.5, Wood: 0.4, Balloon: 0.2 };
const objectColors = { Ball: 'red', Rock: 'gray', Wood: 'brown', Balloon: 'yellow' };

// Initial state
let selectedLiquid = 'Water';
let selectedObject = 'Ball';
let objectRadius = 40;
let objectY = HEIGHT - objectRadius - 10;
let waterLevel = HEIGHT - 100;
let stepSize = 1; // Object movement step size

// Buoyancy Object class
class BuoyancyObject {
    constructor(type) {
        this.type = type;
        this.density = objectDensities[type];
        this.color = objectColors[type];
        this.x = WIDTH / 2;
        this.y = HEIGHT - objectRadius - 10;  // Starting position just above the liquid level
    }

    updatePosition() {
        const liquidDensity = liquidDensities[selectedLiquid];
        const buoyantForce = liquidDensity - this.density;

        if (buoyantForce > 0) {
            // Object floats
            this.y = Math.max(waterLevel - objectRadius * 2, this.y - stepSize);
        } else if (buoyantForce < 0) {
            // Object sinks
            this.y = Math.min(HEIGHT - objectRadius * 2, this.y + stepSize);
        } else {
            // Object is neutrally buoyant (density matches liquid density)
            this.y = waterLevel - objectRadius;  // Position the object exactly at the liquid level
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, objectRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


// Create the object
let buoyancyObject = new BuoyancyObject(selectedObject);

// Update information display
function updateInfo() {
    const liquidDensity = liquidDensities[selectedLiquid];
    const objectDensity = buoyancyObject.density;
    const explanation = getExplanation(objectDensity, liquidDensity);

    document.getElementById('info-density').textContent = `Density of Object: ${objectDensity.toFixed(2)}`;
    document.getElementById('info-liquid').textContent = `Liquid: ${selectedLiquid} (${liquidDensity} g/cm³)`;
    document.getElementById('info-explanation').textContent = explanation;
}

// Explanation based on buoyancy
function getExplanation(objectDensity, liquidDensity) {
    if (objectDensity < liquidDensity) {
        return "Object floats!";
    } else if (objectDensity === liquidDensity) {
        return "Object is neutrally buoyant.";
    } else {
        return "Object sinks!";
    }
}

// Draw the simulation
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw liquid
    ctx.fillStyle = getLiquidColor(selectedLiquid);
    ctx.fillRect(0, HEIGHT - 100, WIDTH, 100);  // Liquid is at the bottom 100px

    // Draw the buoyancy object
    buoyancyObject.updatePosition();
    buoyancyObject.draw();

    // Update UI info
    updateInfo();
}

// Liquid color selection
function getLiquidColor(liquid) {
    switch (liquid) {
        case 'Oil': return 'orange';
        case 'Mercury': return 'gray';
        default: return 'blue'; // Water is blue
    }
}

// Event listeners for keyboard interaction
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        selectedLiquid = 'Water';
        buoyancyObject = new BuoyancyObject(selectedObject);  // Reset object when liquid changes
    }
    if (e.key === 'o' || e.key === 'O') {
        selectedLiquid = 'Oil';
        buoyancyObject = new BuoyancyObject(selectedObject);
    }
    if (e.key === 'm' || e.key === 'M') {
        selectedLiquid = 'Mercury';
        buoyancyObject = new BuoyancyObject(selectedObject);
    }

    if (e.key === '1') {
        selectedObject = 'Ball';
        buoyancyObject = new BuoyancyObject(selectedObject);
    }
    if (e.key === '2') {
        selectedObject = 'Rock';
        buoyancyObject = new BuoyancyObject(selectedObject);
    }
    if (e.key === '3') {
        selectedObject = 'Wood';
        buoyancyObject = new BuoyancyObject(selectedObject);
    }
    if (e.key === '4') {
        selectedObject = 'Balloon';
        buoyancyObject = new BuoyancyObject(selectedObject);
    }

    // Adjust the density of the selected object
    if (e.key === 'ArrowUp') {
        buoyancyObject.density += 0.01;
    }
    if (e.key === 'ArrowDown') {
        buoyancyObject.density = Math.max(0.1, buoyancyObject.density - 0.01);  // Prevent density from being too low
    }
});

// Main loop for drawing and updating the simulation
function mainLoop() {
    draw();
    requestAnimationFrame(mainLoop);
}

mainLoop();
