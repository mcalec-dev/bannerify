const baseURL = '/';
const maxWidth = 720;
const maxHeight = 300;
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
    img.style.height = `${maxHeight}px`;
    img.style.width = 'auto';
    return img;
}
async function displayBanner() {
    const container = document.getElementById('bannerContainer');
    container.style.position = 'relative';
    const imagesData = await fetchImagesData();
    const randomImage = getRandomImage(imagesData);
    container.innerHTML = '';
    const img = createImageElement(`${baseURL}img/${randomImage.type}/${randomImage.src.split('/').pop()}`);
    img.onload = () => {
        const width = Math.max(Math.min(img.naturalWidth, maxWidth), maxWidth);
        const height = Math.max(Math.min(img.naturalHeight, maxHeight), maxHeight);
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        if (randomImage.type === 'gif') {
            const gifDuration = img.naturalWidth / img.naturalHeight * 1000;
            setTimeout(displayBanner, gifDuration * 6);
        }
    };
    container.appendChild(img);
    const watermark = document.getElementById('watermark');
    watermark.onclick = () => {
        window.location.href = 'https://mcalec.dev';
    };
}
displayBanner();
setInterval(() => {
    const currentImage = document.querySelector('.banner-image');
    if (currentImage && currentImage.getAttribute('type') !== 'gif') {
        displayBanner();
    }
}, 7500);