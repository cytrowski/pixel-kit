export const makeFloor = ({ x, y, draw, sprites }) => {
  const tile = { src: sprites.tiles, x: 1, y: 2 };
  return {
    render() {
      draw(tile, { x, y });
    }
  };
};
