const getImageAsset = (src, width, height) =>
  new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.onload = () => resolve(image);
    image.src = "./assets/" + src;
  });

export const getSprites = async () => {
  return {
    tiles: await getImageAsset("tiles1.png", 256, 64),
    enemy: await getImageAsset("rat.png", 256, 32),
    items: await getImageAsset("items.png", 128, 256),
    warrior: await getImageAsset("warrior.png", 256, 128)
  };
};
