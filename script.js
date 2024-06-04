const adviceForm = document.getElementById('adviceForm');
const adviceMessage = document.getElementById('adviceMessage');
const generatedImage = document.getElementById('generatedImage');

adviceForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  adviceMessage.textContent = 'Thinking...';
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
    adviceMessage.textContent = 'Visualising...';

    const illustrationResponse = await fetch('http://127.0.0.1:8000/illustration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input_text: 'User request:' + inputText + '\nFashion styling advice' + data.message })
    });

    const illustrationData = await illustrationResponse.json();

    adviceMessage.textContent = data.message;
    if (illustrationData.url) {
      generatedImage.src = illustrationData.url;
      generatedImage.style.display = 'block';
    } else {
      console.error('Illustration API response missing URL');
    }

  } catch (error) {
    console.error(error);
    adviceMessage.textContent = 'An error occurred. Please try again.';
  } finally {
    adviceForm.reset();
  }
});
