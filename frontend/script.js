const adviceForm = document.getElementById('adviceForm');
const adviceMessage = document.getElementById('adviceMessage');
const intro = document.getElementById('intro');
const generatedImage = document.getElementById('generatedImage');
const apiKeyInput = document.getElementById('apiKeyInput');

// Functions
let process = '';
let dots = '';
let interval;
function Animation() {
  dots = dots === '...' ? '' : dots + '.';
  adviceMessage.textContent = `${process}${dots}`;
}

function startAnimation() {
  interval = setInterval(Animation, 375);
}

function endAnimation() {
  clearInterval(interval);
  adviceMessage.textContent = `${process}`;
}

// Script
adviceForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!apiKeyInput.value) { apiKeyInput.value = "0000000000"; }
  adviceMessage.classList.remove("hidden");
  process = 'Thinking';
  startAnimation();
  const inputText = document.getElementById('inputText').value;

  try {
    const response = await fetch('http://127.0.0.1:8000/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input_text: inputText })
    });
    
    const data = await response.json();
    process = 'Visualising';
    
    const illustrationResponse = await fetch('http://127.0.0.1:8000/illustration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input_text: 'User request:' + inputText + '\nFashion styling advice' + data.message, api_key: apiKeyInput.value })
    });

    const illustrationData = await illustrationResponse.json();

    endAnimation();
    adviceMessage.textContent = data.message;
    if (illustrationData.url) {
      generatedImage.src = illustrationData.url;
      intro.textContent = "Visual Sample";
    } else {
      console.error('Illustration API response missing URL');
    }

  } catch (error) {
    endAnimation();
    console.error(error);
    adviceMessage.textContent = 'An error occurred. Please try again.';
  }
});