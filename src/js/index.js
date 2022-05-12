import debounce from "./debounce";
import Hunter from "./Hunter";
import Prey from "./Prey";

initHunterGame();

function initHunterGame() {
  const canvas = document.createElement("canvas");
  resizeCanvas(canvas);
  const container = document.getElementById("hunterContainer");
  if (container) {
    container.appendChild(canvas);
    startGame(canvas);
    window.addEventListener(
      "resize",
      debounce(() => resizeCanvas(canvas))
    );
  }
}

function resizeCanvas(canvas) {
  if (window.innerWidth < 375) {
    canvas.width = 300;
    canvas.height = 300;
  } else if (window.innerWidth < 850) {
    const size = (window.innerWidth / 850) * 600;
    canvas.width = size;
    canvas.height = size;
  } else {
    canvas.width = 600;
    canvas.height = 600;
  }
}

function startGame(canvas) {
  const context = canvas.getContext("2d");
  const preyCount = 15;
  const hunter = new Hunter(context, canvas);
  const prey = [];
  let lastUpdate;

  for (let i = 0; i < preyCount; i++) {
    prey.push(new Prey(context, canvas, hunter));
  }
  hunter.targets = prey;

  gameLoop();

  function gameLoop(timestamp) {
    if (!lastUpdate) {
      lastUpdate = timestamp;
    }
    if (timestamp - lastUpdate > 16.7) {
      context.fillStyle = "#D2B48C";
      context.fillRect(0, 0, canvas.width, canvas.height);

      prey.forEach((p) => p.update());
      hunter.update();
      prey.forEach((p) => p.draw());
      hunter.draw();
      lastUpdate = timestamp;
    }
    window.requestAnimationFrame(gameLoop);
  }
}
