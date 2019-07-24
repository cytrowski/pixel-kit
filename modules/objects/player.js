import { createAnimation } from "../animation.js";

export const makePlayer = ({ x, y, dispatch, subscribe, draw, sprites }) => {
  const states = {
    idle: {
      animation: createAnimation(
        [
          { src: sprites.warrior, x: 1, y: 1 },
          { src: sprites.warrior, x: 0, y: 1 }
        ],
        {
          intervalLengthMax: 3000,
          intervalLengthMin: 1000,
          index: 0
        }
      )
    },
    movingRight: {
      animation: createAnimation(
        [
          { src: sprites.warrior, x: 2, y: 1 },
          { src: sprites.warrior, x: 3, y: 1 },
          { src: sprites.warrior, x: 4, y: 1 },
          { src: sprites.warrior, x: 5, y: 1 },
          { src: sprites.warrior, x: 6, y: 1 },
          { src: sprites.warrior, x: 7, y: 1 }
        ],
        {
          intervalLengthMax: 100,
          intervalLengthMin: 100,
          index: 0
        }
      )
    },
    movingLeft: {
      animation: createAnimation(
        [
          {
            src: sprites.warrior,
            x: 2,
            y: 1,
            reversedHorizontally: true
          },
          {
            src: sprites.warrior,
            x: 3,
            y: 1,
            reversedHorizontally: true
          },
          {
            src: sprites.warrior,
            x: 4,
            y: 1,
            reversedHorizontally: true
          },
          {
            src: sprites.warrior,
            x: 5,
            y: 1,
            reversedHorizontally: true
          },
          {
            src: sprites.warrior,
            x: 6,
            y: 1,
            reversedHorizontally: true
          },
          { src: sprites.warrior, x: 7, y: 1, reversedHorizontally: true }
        ],
        {
          intervalLengthMax: 100,
          intervalLengthMin: 100,
          index: 0
        }
      )
    }
  };

  let state = "idle";
  let path = [];

  subscribe(message => {
    if (message.type === "player/setPath") {
      path = message.path;
    }
    if (message.type === "player/reachedPosition") {
      path.splice(0, 1);
    }
  });

  const gotoPosition = position => {
    const speed = 0.01;
    state = "movingRight";
    if (x < position.x) {
      state = "movingRight";
      x = Math.min(x + speed, position.x);
    }
    if (x > position.x) {
      state = "movingLeft";
      x = Math.max(x - speed, position.x);
    }
    if (y < position.y) {
      y = Math.min(y + speed, position.y);
    }
    if (y > position.y) {
      y = Math.max(y - speed, position.y);
    }
    if (x === position.x && y === position.y) {
      state = "idle";
      dispatch({ type: "player/reachedPosition", position });
    }
  };
  return {
    update(dTime) {
      if (path.length > 0) {
        gotoPosition(path[0]);
      } else {
        state = "idle";
      }
      states[state].animation.update(dTime);
    },
    render() {
      const tile = states[state].animation.getCurrentFrame();
      draw(tile, { x, y }, { width: 12, height: 15 });
    }
  };
};
