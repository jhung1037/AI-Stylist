const adviceForm = document.getElementById('adviceForm');
const adviceMessage = document.getElementById('adviceMessage');
const generatedImage = document.getElementById('generatedImage');

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
      body: JSON.stringify({ input_text: 'User request:' + inputText + '\nFashion styling advice' + data.message })
    });

    const illustrationData = await illustrationResponse.json();

    endAnimation();
    adviceMessage.textContent = data.message;
    if (illustrationData.url) {
      generatedImage.src = illustrationData.url;
      generatedImage.style.display = 'block';
    } else {
      console.error('Illustration API response missing URL');
    }

  } catch (error) {
    endAnimation();
    console.error(error);
    adviceMessage.textContent = 'An error occurred. Please try again.';
  }
});