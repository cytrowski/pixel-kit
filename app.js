const getImageAsset = ({ src, width, height, tileWidth, tileHeight }) =>
  new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.onload = () =>
      resolve({ image, width, height, tileWidth, tileHeight });
    image.src = "./assets/" + src;
  });

const gridSize = 16;
const zoomLevel = 3;
const canvasId = "viewport";
const boardWidth = 14;
const boardHeight = 14;

const play = async () => {
  const viewportNode = document.getElementById(canvasId);
  const ctx = viewportNode.getContext("2d");

  ctx.canvas.width = gridSize * boardWidth;
  ctx.canvas.height = gridSize * boardHeight;

  viewportNode.style.zoom = zoomLevel;

  const warriorSprite = await getImageAsset({
    src: "warrior.png",
    width: 256,
    height: 128,
    tileWidth: 12,
    tileHeight: 15
  });

  const wallSprite = await getImageAsset({
    src: "tiles0.png",
    width: 256,
    height: 64,
    tileWidth: 16,
    tileHeight: 16
  });

  const foodSprite = await getImageAsset({
    src: "items.png",
    width: 128,
    height: 256,
    tileWidth: 16,
    tileHeight: 16
  });

  const makePlayer = ({ x, y }) => ({
    x,
    y,
    health: 100,
    hunger: 100,
    path: [],
    currentState: "idle",
    states: {
      idle: {
        frames: [
          { src: warriorSprite, x: 1, y: 1 },
          { src: warriorSprite, x: 0, y: 1 }
        ],
        index: 0
      },
      dead: {
        frames: [{ src: warriorSprite, x: 12, y: 1 }],
        index: 0
      }
    }
  });

  const player = makePlayer({
    x: 1,
    y: 1
  });

  const makeFood = ({ x, y }) => ({
    x,
    y,
    currentState: "smellingGood",
    states: {
      smellingGood: {
        frames: [
          {
            src: foodSprite,
            x: 4,
            y: 0
          }
        ],
        index: 0
      }
    }
  });

  const food = makeFood({
    x: 6,
    y: 10
  });

  const makeWall = ({ x, y }) => ({
    x,
    y,
    currentState: "standing",
    states: {
      standing: {
        frames: [{ src: wallSprite, x: 0, y: 1 }],
        index: 0
      }
    }
  });

  const makeFloor = ({ x, y }) => ({
    x,
    y,
    currentState: "basic",
    states: {
      basic: {
        frames: [{ src: wallSprite, x: 1, y: 0 }],
        index: 0
      }
    }
  });

  const cellsMap = [
    "##############",
    "#   #        #",
    "#       #    #",
    "####### ######",
    "#       #    #",
    "#   #     #  #",
    "#   #     #  #",
    "#   #     #  #",
    "######## #####",
    "#   #     #  #",
    "#         #  #",
    "#   #        #",
    "#   #     #  #",
    "##############"
  ];
  const charsWithPositions = cellsMap.flatMap((row, y) =>
    row.split("").map((char, x) => ({ x, y, char }))
  );

  const walls = charsWithPositions
    .filter(item => item.char === "#")
    .map(({ x, y }) => makeWall({ x, y }));

  const floors = charsWithPositions
    .filter(item => item.char === " ")
    .map(({ x, y }) => makeFloor({ x, y }));

  let totalTime = 0;
  let isPlaying = true;

  const objects = [...floors, ...walls, player, food];
  const hungerBar = document.getElementById("hunger-bar");
  const healthBar = document.getElementById("health-bar");

  const tick = dTime => {
    totalTime += dTime;

    player.hunger = player.hunger - dTime / 100;

    if (player.hunger < 0) {
      alert("You died of hunger!");
      player.currentState = "dead";
      isPlaying = false;
    }

    hungerBar.style.width = player.hunger + "%";
    objects.forEach(object => {
      const state = object.states[object.currentState];
      const frame = state.frames[state.index];
      ctx.drawImage(
        frame.src.image,
        frame.x * frame.src.tileWidth,
        frame.y * frame.src.tileHeight,
        frame.src.tileWidth,
        frame.src.tileHeight,
        object.x * gridSize + Math.floor((gridSize - frame.src.tileWidth) / 2),
        object.y * gridSize + Math.floor((gridSize - frame.src.tileHeight) / 2),
        frame.src.tileWidth,
        frame.src.tileHeight
      );
    });
  };

  let lastPaintMoment = Date.now();

  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const now = Date.now();
    const dTime = now - lastPaintMoment;
    lastPaintMoment = now;

    tick(dTime);
    if (isPlaying === false) {
      return;
    }

    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("keyup", event => {
    const currentPosition = {
      x: player.x,
      y: player.y
    };
    if (event.code === "ArrowRight") {
      player.x = player.x + 1;
    }
    if (event.code === "ArrowLeft") {
      player.x = player.x - 1;
    }
    if (event.code === "ArrowUp") {
      player.y = player.y - 1;
    }
    if (event.code === "ArrowDown") {
      player.y = player.y + 1;
    }
    if (player.x < 0 || player.x > boardWidth - 1) {
      player.x = currentPosition.x;
    }
    if (player.y < 0 || player.y > boardHeight - 1) {
      player.y = currentPosition.y;
    }
    walls.forEach(wall => {
      if (player.x === wall.x && player.y === wall.y) {
        player.x = currentPosition.x;
        player.y = currentPosition.y;
      }
      if (food.x === wall.x && food.y === wall.y) {
        food.x = Math.floor(Math.random() * boardWidth);
        food.y = Math.floor(Math.random() * boardHeight);
      }
    });
    if (food.x === player.x && food.y === player.y) {
      verifyFoodPosition(food.x, food.y);
      player.hunger >= 70 ? (player.hunger = 100) : (player.hunger += 30);
    }
  });

  const verifyFoodPosition = (x, y) => {
    // choose new food position
    food.x = Math.floor(Math.random() * boardWidth);
    food.y = Math.floor(Math.random() * boardHeight);

    // check if the food collides with walls
    walls.forEach(wall => {
      if (food.x === wall.x && food.y === wall.y) {
        // if collides then try the function again
        verifyFoodPosition(food.x, food.y);
      } else {
        // make food with the function's arguments
        makeFood(x, y);
      }
    });
  };

  verifyFoodPosition(food.x, food.y);
};

play();
