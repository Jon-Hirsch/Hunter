import Hunter from './Hunter';
import Prey from './Prey';

document.addEventListener('DOMContentLoaded', initHunterGame);

function initHunterGame () {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const container = document.getElementById('hunterContainer');
  if (container) {
    container.appendChild(canvas);
    startGame(canvas);
  }
}

function startGame(canvas) {
  const context = canvas.getContext('2d');
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
      context.fillStyle = '#D2B48C';
      context.fillRect(0, 0, canvas.width, canvas.height);

      prey.forEach(p => p.update());
      hunter.update();
      prey.forEach(p => p.draw());
      hunter.draw();
      lastUpdate = timestamp;
    }
    window.requestAnimationFrame(gameLoop);
  }
}
