const calculateIntervalLength = ({ intervalLengthMin, intervalLengthMax }) =>
  intervalLengthMin + Math.random() * (intervalLengthMax - intervalLengthMin);

export const createAnimation = (
  frames,
  options = { intervalLengthMin: 1000, intervalLengthMax: 1000, index: 0 }
) => {
  let { intervalLengthMax, intervalLengthMin, index } = options;
  index = index % frames.length;
  let time = 0;
  let intervalLength = calculateIntervalLength({
    intervalLengthMin,
    intervalLengthMax
  });
  return {
    getCurrentFrame() {
      return frames[index];
    },
    update(dTime) {
      time += dTime;
      if (time > intervalLength) {
        time = time % intervalLength;
        index = (index + 1) % frames.length;
        intervalLength = calculateIntervalLength({
          intervalLengthMin,
          intervalLengthMax
        });
      }
    },
    reset() {
      time = 0;
      index = 0;
    }
  };
};

export const start = ({ clear, tick }) => {
  let lastPaintMoment = Date.now();
  let isPlaying = true;
  const animate = () => {
    if (isPlaying === false) {
      return;
    }

    clear();

    const now = Date.now();
    const dTime = now - lastPaintMoment;

    tick(dTime);

    lastPaintMoment = now;
    requestAnimationFrame(animate);
  };

  animate();

  return {
    stop: () => {
      isPlaying = false;
    }
  };
};
