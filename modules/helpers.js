export const isTouching = (posA, posB) => {
  return Math.abs(posA.x - posB.x) <= 1 && Math.abs(posA.y - posB.y) <= 1;
};

export const isTheSame = (posA, posB) => {
  return posA.x === posB.x && posA.y === posB.y;
};
