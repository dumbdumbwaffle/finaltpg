//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 100;
let dinoHeight = 100;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// Discount-related variables
let discountGiven = false; // To track if the discount has been given

let resetImg; // Image for the reset button


function startGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Load images
    dinoImg = new Image();
    dinoImg.src = "./game img/bunnyded.png";

    cactus1Img = new Image();
    cactus1Img.src = "./game img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./game img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./game img/cactus3.png";

    resetImg = new Image();
    resetImg.src = "./game img/reset.png"; // Reset button image

    // Start game loop
    requestAnimationFrame(update);

    // Place cacti periodically
    setInterval(placeCactus, 1000);

    // Listen for key presses
    document.addEventListener("keydown", function (e) {
        if (["ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
            e.preventDefault();
        }
        moveDino(e);
    });

    // Listen for mouse clicks (to handle reset button)
    board.addEventListener("click", function(){ 
        if (gameOver) {
            restartGame();
        } velocityY = -10;
    });
};

function update() {
    if (gameOver) {
        // Draw reset button
        context.drawImage(resetImg, boardWidth / 2 - 50, boardHeight / 2 - 25, 100, 50);
        return;
    }

    requestAnimationFrame(update);

    // Clear the canvas
    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity to the dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Move and draw cacti
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Check for collision
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./game img/bunnyded.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            };
        }
    }

    // Draw score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);

    // Check if score reaches 3000 to offer the discount
    if (score >= 1000 && !discountGiven) {
        giveDiscount(); // Call the function to show the discount
    }
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
        // Jump
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    };

    let chance = Math.random();

    if (chance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else if (chance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    }

    cactusArray.push(cactus);

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function handleReset(event) {
    if (!gameOver) return;

    const rect = board.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const resetX = boardWidth / 2 - 50;
    const resetY = boardHeight / 2 - 25;
    const resetWidth = 100;
    const resetHeight = 50;

    // Check if the click is within the reset button bounds
    if (mouseX >= resetX && mouseX <= resetX + resetWidth && mouseY >= resetY && mouseY <= resetY + resetHeight) {
        restartGame();
    }
}

function restartGame() {
    gameOver = false;
    score = 0;
    cactusArray = [];
    dinoImg.src = "./game img/bunnyded.png";
    dino.y = dinoY;
    velocityY = 0;

    // Reset the discount-related flag
    discountGiven = false;

    requestAnimationFrame(update);
}

// Function to give the discount after reaching 3000 points
// function giveDiscount() {
//     discountGiven = true;
//     alert("Congratulations! You've reached 3000 points. Use code Bunny for your next purchase for a 10% discount!");
// }

function initializeAccordions() {
    const accordions = document.querySelectorAll(".accordion");
  
    accordions.forEach((accordion) => {
      accordion.addEventListener("click", function () {
        // Close all other accordions
        accordions.forEach((otherAccordion) => {
          if (otherAccordion !== this) {
            otherAccordion.classList.remove("active");
            const otherPanel = otherAccordion.nextElementSibling;
            otherPanel.style.display = "none";
            const otherIcon = otherAccordion.querySelector(".plus-icon");
            if (otherIcon) {
              otherIcon.textContent = "+"; // Reset icon to "+"
            }
          }
        });
  
        // Toggle the clicked accordion
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        panel.style.display = panel.style.display === "block" ? "none" : "block";
  
        // Toggle the "+" and "-" icon
        const icon = this.querySelector(".plus-icon");
        if (icon) {
          icon.textContent = icon.textContent === "+" ? "-" : "+";
        }
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    initializeAccordions(); // Call the function to initialize accordions
  });

  function giveDiscount() {
    discountGiven = true;
    randomNumber = Math.round(Math.random()*9999);
    document.getElementById('alert').style.display='block';
    document.getElementById('msg1').innerHTML="PaperBunny"+randomNumber;
    document.getElementById('msg2').innerHTML="PaperBunny"+randomNumber;
    //alert("Congratulations! You've reached 3000 points. Use code Bunny for your next purchase for a 10% discount!");
}
  
