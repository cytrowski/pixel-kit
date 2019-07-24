const makeDraw = (ctx, gridSize) => {
  const flippingCanvas = document.createElement("canvas");
  const flippingCtx = flippingCanvas.getContext("2d");

  return (tile, { x, y }, size = { width: gridSize, height: gridSize }) => {
    if (tile.reversedHorizontally) {
      flippingCtx.save();
      flippingCtx.translate(gridSize, 0);
      flippingCtx.scale(-1, 1);

      flippingCtx.clearRect(0, 0, gridSize, gridSize);
      flippingCtx.drawImage(
        tile.src,
        tile.x * size.width,
        tile.y * size.height,
        size.width,
        size.height,
        Math.floor((gridSize - size.width) / 2),
        Math.floor((gridSize - size.height) / 2),
        size.width,
        size.height
      );
      flippingCtx.restore();

      ctx.drawImage(
        flippingCtx.canvas,
        0,
        0,
        size.width,
        size.height,
        x * gridSize + Math.floor((gridSize - size.width) / 2),
        y * gridSize + Math.floor((gridSize - size.height) / 2),
        size.width,
        size.height
      );
    } else {
      ctx.drawImage(
        tile.src,
        tile.x * size.width,
        tile.y * size.height,
        size.width,
        size.height,
        x * gridSize + Math.floor((gridSize - size.width) / 2),
        y * gridSize + Math.floor((gridSize - size.height) / 2),
        size.width,
        size.height
      );
    }
  };
};

const getCursorPosition = (canvas, event, zoomLevel, gridSize) => {
  // const rect = canvas.getBoundingClientRect();
  const x = Math.floor(event.offsetX / zoomLevel / gridSize);
  const y = Math.floor(event.offsetY / zoomLevel / gridSize);
  return { x, y };
};

export const init = ({
  canvasId,
  zoomLevel,
  gridSize,
  handleGridCellClick
}) => {
  const viewportNode = document.getElementById(canvasId);
  const ctx = viewportNode.getContext("2d");

  const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  const resize = ({ width, height }) => {
    ctx.canvas.width = gridSize * width;
    ctx.canvas.height = gridSize * height;
  };

  const canvas = ctx.canvas;
  canvas.style.zoom = zoomLevel;
  canvas.addEventListener("mousedown", function(e) {
    const position = getCursorPosition(canvas, e, zoomLevel, gridSize);
    handleGridCellClick(position);
  });

  const draw = makeDraw(ctx, gridSize);

  return {
    clear,
    resize,
    draw
  };
};
