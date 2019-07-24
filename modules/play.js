import { init } from "./viewport.js";
import { start } from "./animation.js";
import { getSprites } from "./sprites.js";
import { makeMessaging } from "./messaging.js";

import { makePlayer } from "./objects/player.js";
import { makeFloor } from "./objects/floor.js";

const gridSize = 16;
const zoomLevel = 4;

export default async () => {
  const sprites = await getSprites();

  const { dispatch, subscribe } = makeMessaging();

  const { clear, resize, draw } = init({
    canvasId: "viewport",
    zoomLevel,
    gridSize,
    handleGridCellClick: position => {
      dispatch({ type: "click", position });
    }
  });

  subscribe(message => {
    if (message.type === "click") {
      dispatch({
        type: "player/setPath",
        path: [message.position]
      });
    }
  });

  const player = makePlayer({ x: 1, y: 1, dispatch, subscribe, draw, sprites });
  const floors = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }
  ].map(({ x, y }) => makeFloor({ x, y, draw, sprites }));

  resize({ width: 3, height: 3 });

  const objects = [...floors, player];

  const tick = dTime => {
    objects.forEach(object => {
      if (object.update) {
        object.update(dTime);
      }
      object.render();
    });
  };

  const { stop } = start({ clear, tick });
};
