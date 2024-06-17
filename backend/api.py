from fastapi import Depends, FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from horde_sdk.ai_horde_api import AIHordeAPISimpleClient
from horde_sdk.ai_horde_api.apimodels import ImageGenerateAsyncRequest
import llm_client


def connect_weaviate():
    weaviate_client = llm_client.Client()
    yield weaviate_client
    weaviate_client.weaviate.close()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Functions
class Request(BaseModel):
    input_text: str


@app.post("/advice")
async def get_advice(request: Request, connection=Depends(connect_weaviate)):

    response = connection.advisor_data.query.hybrid(
        query = request.input_text,
        limit = 5
    )

    retrieve = ""
    for obj in response.objects:
        retrieve += str(obj.properties["combinations"])
        
    response = connection.cohere.chat(
        message = f"""DATA: {retrieve}\n\n
                    Base on the DATA and the user's request: {request.input_text}, designe ONE outfit suggestion.
                    Output Format Example:
                     - Top: Fitted navy blue button-down shirt.
                     - Bottom: Dark wash slim fit jeans.
                     - Shoes: Brown leather loafers.
                     - Accessories: A sleek silver watch and a brown leather belt.""",
        max_tokens = 250
    )

    return {"message": response.text}


@app.post("/illustration")
async def get_image(prompt: Request):

    image_generate_async_request = ImageGenerateAsyncRequest(
        apikey="0000000000", # set your personal AI Horde API key here
        prompt=f"Draw a model illustration base on: {prompt.input_text}",
        models=["Deliberate"]
    )

    simple_client = AIHordeAPISimpleClient()
    status_response = simple_client.image_generate_request(image_generate_async_request)[0]

    url = status_response.generations[0].img
    return {"url": url}
