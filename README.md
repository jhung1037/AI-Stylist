#### Steps:

1. Install the required packages by running the following command:

   ```
   pip install -r requirements.txt
   ```

2. Set your API keys in the `LLM.py` file:
   - Cohere API key
   - Weaviate WCS URL
   - Weaviate API key

   (Optional) Creat an account to set up your own AI Horde API key for faster image generation.

3. For initial setup, run the script `reconfigure_vectorizer.py` in the `resources` file.

4. Start the FastAPI server by running the following command:

   ```
   fastapi run backend/api.py
   ```

5. Open `index.html` in the `frontend` file in your browser and have fun!