from typing import Optional
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from horde_sdk.ai_horde_api import AIHordeAPISimpleClient
from horde_sdk.ai_horde_api.apimodels import ImageGenerateAsyncRequest
from pydantic import BaseModel
import llm_client


def connect_weaviate():
    weaviate_client = llm_client.Client()
    try:
        yield weaviate_client
    finally:
        weaviate_client.weaviate.close()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Account Functions
class Account(BaseModel):
    create_account: Optional[bool] = None
    username: str
    password: Optional[str] = None
    apiKey: Optional[str] = None


db = {}
@app.post("/account")
def get_image(account: Account):
    if account.create_account:
        db[account.username] = [account.password, None]
        return {"success": True, "key": None}
    if account.username in db and db[account.username][0] == account.password:
        return {"success": True, "key": db[account.username][1]}
    return {"success": False, "key": None}


@app.post("/record")
def get_image(account: Account):
    db[account.username][1] = account.apiKey
    return


# GenAI Functions
class Request(BaseModel):
    input_text: str


@app.post("/advice")
def get_advice(request: Request, connection=Depends(connect_weaviate)):

    response = connection.advisor_data.query.hybrid(
        query = request.input_text,
        limit = 5
    )

    retrieve = ""
    for obj in response.objects:
        retrieve += str(obj.properties["combinations"])
        
    response = connection.cohere.chat(
        message = f"""DATA: {retrieve}\n
        You are a Miss Purrfect, a cat fashion stylist. Base on the DATA and the user's request: {request.input_text}, design ONE outfit suggestion.
        (Output Example:
        Meow~! Here are my suggestion:\n
        -- Top --\n A tailored, forest green blouse with a V-neckline.\n
        -- Bottom --\n A pair of high-waisted, wide-leg trousers in a dark charcoal gray.\n
        -- Shoes --\n Dark green pointed-toe heels to match the blouse.\n
        -- Accessories --\n Add a delicate gold necklace with a small pendant, and a pair of gold stud earrings.\n
        Hope you feel meow-nificent in this outfit!)"""
    )

    return {"message": response.text}


@app.post("/illustration")
def get_image(prompt: Request):

    image_generate_async_request = ImageGenerateAsyncRequest(
        apikey="0000000000", # set your personal AI Horde API key here
        prompt=f"Draw a model illustration base on: {prompt.input_text}",
        models=["Deliberate"]
    )

    simple_client = AIHordeAPISimpleClient()
    status_response = simple_client.image_generate_request(image_generate_async_request)[0]

    url = status_response.generations[0].img
    return {"url": url}
