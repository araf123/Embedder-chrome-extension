// Create buttons to select between video or PDF
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.top = '50%';
buttonContainer.style.left = '50%';
buttonContainer.style.transform = 'translate(-50%, -50%)';
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px';

const videoButton = document.createElement('button');
videoButton.innerHTML = '<img src="https://img.icons8.com/color/48/000000/youtube-play.png" style="height:20px; margin-right:8px; vertical-align:middle;">Embed Video';
videoButton.style.padding = '10px 15px';
videoButton.style.fontWeight = 'bold';
videoButton.style.color = '#4f5b66';
videoButton.style.backgroundColor = '#F7D7D7';
videoButton.style.border = 'none';
videoButton.style.borderRadius = '5px';
videoButton.style.cursor = 'pointer';

const pdfButton = document.createElement('button');
pdfButton.innerHTML = '<img src="https://img.icons8.com/color/48/000000/pdf-2.png" style="height:20px; margin-right:8px; vertical-align:middle;">Embed PDF';
pdfButton.style.padding = '10px 15px';
pdfButton.style.fontWeight = 'bold';
pdfButton.style.color = '#4f5b66';
pdfButton.style.backgroundColor = '#E5EBD7';
pdfButton.style.border = 'none';
pdfButton.style.borderRadius = '5px';
pdfButton.style.cursor = 'pointer';

buttonContainer.appendChild(videoButton);
buttonContainer.appendChild(pdfButton);
document.body.appendChild(buttonContainer);

let currentEmbedType = null;
let currentIframe = null;
let overlay = null;
let brightnessSlider = null;
let closeButton = null;
let overlayVisible = true;

function resetButtons() {
  document.body.appendChild(buttonContainer);
  currentEmbedType = null;
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
  if (brightnessSlider) {
    document.body.removeChild(brightnessSlider);
    brightnessSlider = null;
  }
  if (closeButton) {
    document.body.removeChild(closeButton);
    closeButton = null;
  }
  if (currentIframe) {
    document.body.removeChild(currentIframe);
    currentIframe = null;
  }
}

videoButton.addEventListener('click', () => {
  if (currentEmbedType === 'pdf') removeEmbed();
  const videoInput = prompt("Please enter the YouTube video URL or video ID:");
  let videoID = videoInput.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  videoID = videoID ? videoID[1] : videoInput;
  if (videoID.length === 11) embedIframe(`https://www.youtube.com/embed/${videoID}`, '50%', '50%', 'video');
  else alert("Invalid YouTube input. Please try again.");
});

pdfButton.addEventListener('click', () => {
  if (currentEmbedType === 'video') removeEmbed();
  const fileURL = prompt("Please enter the Google Drive PDF URL:");
  const match = fileURL.match(/\/d\/([^/]+)\/|id=([^&]+)/);
  const fileCode = match ? (match[1] || match[2]) : null;
  if (fileCode) embedIframe(`https://drive.google.com/file/d/${fileCode}/preview`, '50%', '100%', 'pdf');
  else alert("Invalid Google Drive URL. Please try again.");
});

function embedIframe(src, width, height, type) {
  currentEmbedType = type;
  document.body.removeChild(buttonContainer);

  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9998';
  overlay.style.pointerEvents = 'none'; // Allows interaction with the rest of the website
  document.body.appendChild(overlay);

  brightnessSlider = document.createElement('input');
  brightnessSlider.type = 'range';
  brightnessSlider.min = '0';
  brightnessSlider.max = '1';
  brightnessSlider.step = '0.05';
  brightnessSlider.value = '0.5';
  brightnessSlider.style.position = 'fixed';
  brightnessSlider.style.bottom = '20px';
  brightnessSlider.style.left = '50%';
  brightnessSlider.style.transform = 'translateX(-50%)';
  brightnessSlider.style.zIndex = '10000';
  document.body.appendChild(brightnessSlider);

  brightnessSlider.addEventListener('input', () => {
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${brightnessSlider.value})`;
  });

  closeButton = document.createElement('button');
  closeButton.innerHTML = '✖';
  closeButton.style.position = 'fixed';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'red';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '20px';
  closeButton.style.padding = '5px 10px';
  closeButton.style.zIndex = '10001';
  closeButton.addEventListener('click', removeEmbed);
  document.body.appendChild(closeButton);

  currentIframe = document.createElement('iframe');
  currentIframe.src = src;
  currentIframe.style.position = 'fixed';
  currentIframe.style.top = '50%';
  currentIframe.style.left = '50%';
  currentIframe.style.transform = 'translate(-50%, -50%)';
  currentIframe.style.width = width;
  currentIframe.style.height = height;
  currentIframe.style.zIndex = '9999';
  currentIframe.style.border = 'none';
  currentIframe.setAttribute('allowfullscreen', 'true');
  document.body.appendChild(currentIframe);

  document.addEventListener('keydown', handleKeyEvents);
}

function removeEmbed() {
  if (currentIframe) {
    document.body.removeChild(currentIframe);
    currentIframe = null;
  }
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
  if (brightnessSlider) {
    document.body.removeChild(brightnessSlider);
    brightnessSlider = null;
  }
  if (closeButton) {
    document.body.removeChild(closeButton);
    closeButton = null;
  }
  document.removeEventListener('keydown', handleKeyEvents);
  resetButtons();
}

function handleKeyEvents(event) {
  if (event.key === '.') { // Increase brightness
    brightnessSlider.value = Math.min(1, parseFloat(brightnessSlider.value) + 0.05);
  } else if (event.key === ',') { // Decrease brightness
    brightnessSlider.value = Math.max(0, parseFloat(brightnessSlider.value) - 0.05);
  } else if (event.key === '/') { // Toggle overlay & slider
    overlayVisible = !overlayVisible;
    overlay.style.display = overlayVisible ? 'block' : 'none';
    brightnessSlider.style.display = overlayVisible ? 'block' : 'none';
  }
  overlay.style.backgroundColor = `rgba(0, 0, 0, ${brightnessSlider.value})`;
}
