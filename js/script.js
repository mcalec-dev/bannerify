const baseURL = '/';
async function fetchImagesData() {
  const response = await fetch(`${baseURL}json/list.json`);
  return await response.json();
}
function getRandomImage(imagesData) {
    const imageTypes = Object.keys(imagesData.images);
    const randomType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
    const images = imagesData.images[randomType];
    return images[Math.floor(Math.random() * images.length)];
}
function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'banner-image';
    return img;
}
function positionWatermark() {
  const img = document.querySelector('.banner-image');
  const watermark = document.querySelector('.watermark');
  if (img && watermark) {
    const imgRect = img.getBoundingClientRect();
    watermark.style.top = `${imgRect.bottom + window.scrollY - watermark.offsetHeight}px`;
    watermark.style.left = `${imgRect.right + window.scrollX - watermark.offsetWidth}px`;
  }
}
async function displayBanner() {
    const container = document.getElementById('bannerContainer');
    const imagesData = await fetchImagesData();
    const randomImage = getRandomImage(imagesData);
    const img = createImageElement(`${baseURL}img/${randomImage.type}/${randomImage.src.split('/').pop()}`);
    container.appendChild(img);
    img.onload = positionWatermark;
}
setInterval(async () => {
  const container = document.getElementById('bannerContainer');
  const currentImage = document.querySelector('.banner-image');
  if (currentImage) {
    container.removeChild(currentImage);
  }
  const imagesData = await fetchImagesData();
  const randomImage = getRandomImage(imagesData);
  const img = createImageElement(`${baseURL}img/${randomImage.type}/${randomImage.src.split('/').pop()}`);
  container.appendChild(img);
  img.onload = positionWatermark;
}, 7500);
displayBanner();
window.addEventListener('resize', positionWatermark);