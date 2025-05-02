const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    texxt = document.querySelector("#texxt"),
    saveImg = document.querySelector(".save-img"),
  
    ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let selectedColor = "#000";
let isTextMode = false;
let text = '';
let fontSize = 20;
let textColor = '#000000';

// Set canvas background to white
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // Set fill color back to the selected color
};

window.addEventListener("load", () => {
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 200;
    setCanvasBackground();
});

// Drawing shapes
const drawRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawOval = (e) => {
    ctx.beginPath(); // Creating a new path to draw the oval

    // Calculate the width (horizontal radius) and height (vertical radius) of the oval
    let width = Math.abs(prevMouseX - e.offsetX);
    let height = Math.abs(prevMouseY - e.offsetY);

    // Draw the oval using the arc method (ellipse)
    ctx.ellipse(prevMouseX, prevMouseY, width, height, 0, 0, 2 * Math.PI); // ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle)

    // If fillColor is checked, fill the oval; otherwise, stroke the oval
    fillColor.checked ? ctx.fill() : ctx.stroke();
};


const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};




const drawStar = (e) => {
    const centerX = prevMouseX; // Center of the star (starting point)
    const centerY = prevMouseY; // Center of the star
    const outerRadius = Math.sqrt(Math.pow(e.offsetX - centerX, 2) + Math.pow(e.offsetY - centerY, 2)); // Distance from center to mouse for outer radius
    const innerRadius = outerRadius / 2; // Inner radius is half the outer radius
    const numPoints = 5; // Number of star points
    const angleStep = Math.PI / numPoints; // Angle between each point of the star

    ctx.beginPath();
    for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius; // Alternate between outer and inner radius
        const angle = i * angleStep - Math.PI / 2; // Adjust angle to start at the top
        const x = centerX + radius * Math.cos(angle); // Calculate x-coordinate of the point
        const y = centerY + radius * Math.sin(angle); // Calculate y-coordinate of the point
        if (i === 0) {
            ctx.moveTo(x, y); // Move to the first point
        } else {
            ctx.lineTo(x, y); // Draw line to the next point
        }
    }
    ctx.closePath(); // Close the star shape
    fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke based on the fill checkbox
};


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "star") {
        drawStar(e);
    }
    else if (selectedTool === "star") {
        drawStar(e);
    }
    else if (selectedTool === "oval") {
        drawOval(e);
    }
    
     else {
        drawTriangle(e);
    }
};

// Tool Buttons
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        if (selectedTool === "text") {
            isTextMode = true; // Enable text mode
        } else {
            isTextMode = false; // Disable text mode
        }
    });
});

// Size Slider for brush
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

// Color Buttons
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Color Picker
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Clear Canvas
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

// Save Image
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

// Mouse Events for drawing
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

// File Input for Image Upload
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}); // Closing brace for addEventListener


// Text Button Event (This allows adding text interactively on the canvas)
const textButton = document.getElementById('text');
textButton.addEventListener('click', () => {
    if (isTextMode) {
        const userInput = prompt('Enter the text you want to add to the canvas:');
        if (userInput !== null && userInput.trim() !== '') {
            text = userInput;
            ctx.fillStyle = textColor;
            ctx.font = `${fontSize}px Arial`;

            // Draw text at the current mouse position
            const x = prevMouseX;
            const y = prevMouseY;

            ctx.fillText(text, x, y);
        } else {
            alert('Please enter valid text!');
        }
    }
});

// Dynamic font size and color updates
sizeSlider.addEventListener('input', (e) => {
    fontSize = e.target.value;
});

colorPicker.addEventListener('input', (e) => {
    textColor = e.target.value;
});
// File Input for Image Upload
const fileInput = document.getElementById('file');
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];  // Get the selected file
    if (file) {
        const reader = new FileReader();  // Create a file reader

        // Once the file is read, this function will run
        reader.onload = function(event) {
            const img = new Image();  // Create a new Image object
            img.onload = function() {
                // Clear the canvas before drawing the new image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Draw image to fill canvas
            };
            img.src = event.target.result;  // Set the image source to the file content
        };

        // Read the selected file as a data URL (base64 encoded string)
        reader.readAsDataURL(file);
    }
});


