from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from horde_sdk.ai_horde_api import AIHordeAPISimpleClient
from horde_sdk.ai_horde_api.apimodels import ImageGenerateAsyncRequest
import LLM

connection = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Weaviate client connected")
    connection["Weaviate_client"] = LLM.Server()
    yield
    connection["Weaviate_client"].client.close()
    print("Weaviate client closed")

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    input_text: str

@app.post("/advice")
async def get_advice(request: Request):

    response = connection["Weaviate_client"].advisor_data.query.hybrid(
        query = request.input_text,
        limit = 5
    )

    retrieve = ""
    for obj in response.objects:
        retrieve += str(obj.properties["combinations"])
        
    response = connection["Weaviate_client"].cohere.chat(
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
async def get_advice(prompt: Request):

    image_generate_async_request = ImageGenerateAsyncRequest(
        apikey="0000000000",
        prompt=f"Draw a model illustration base on: {prompt.input_text}",
        models=["Deliberate"]
    )

    simple_client = AIHordeAPISimpleClient()
    status_response = simple_client.image_generate_request(image_generate_async_request)[0]

    url = status_response.generations[0].img
    return {"url": url}
