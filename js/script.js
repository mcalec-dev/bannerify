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
    if (randomImage.type === 'gif' && randomImage.repeat) {
        img.dataset.startTime = Date.now();
        img.dataset.repeat = randomImage.repeat;
    }
    container.appendChild(img);
    img.onload = positionWatermark;
}

// Replace the setInterval with a function that checks GIF duration
let bannerTimer;

async function updateBanner() {
    const container = document.getElementById('bannerContainer');
    const currentImage = document.querySelector('.banner-image');
    
    if (currentImage) {
        // Check if current image is a GIF that hasn't completed its repeats
        if (currentImage.src.endsWith('.gif') && currentImage.dataset.startTime && currentImage.dataset.repeat) {
            const elapsedTime = Date.now() - parseInt(currentImage.dataset.startTime);
            const repeats = parseInt(currentImage.dataset.repeat);
            // Assuming average GIF duration of 3 seconds - adjust if needed
            const estimatedDuration = 3000 * repeats;
            
            if (elapsedTime < estimatedDuration) {
                // Schedule next check
                bannerTimer = setTimeout(updateBanner, 1000);
                return;
            }
        }
        
        container.removeChild(currentImage);
    }
    
    const imagesData = await fetchImagesData();
    const randomImage = getRandomImage(imagesData);
    const img = createImageElement(`${baseURL}img/${randomImage.type}/${randomImage.src.split('/').pop()}`);
    
    if (randomImage.type === 'gif' && randomImage.repeat) {
        img.dataset.startTime = Date.now();
        img.dataset.repeat = randomImage.repeat;
    }
    
    container.appendChild(img);
    img.onload = positionWatermark;
    
    // Schedule next update
    bannerTimer = setTimeout(updateBanner, randomImage.type === 'gif' ? 3000 * parseInt(randomImage.repeat) : 7500);
}

// Replace setInterval with initial call to updateBanner
displayBanner();
setTimeout(updateBanner, 6750);

// Clean up timer on window unload
window.addEventListener('unload', () => {
    if (bannerTimer) {
        clearTimeout(bannerTimer);
    }
});

window.addEventListener('resize', positionWatermark);