import os
import cohere
import weaviate
from weaviate.auth import AuthApiKey
from dotenv import load_dotenv

# # remember to set your api keys
# os.environ["COHERE_APIKEY"] = "PUT_YOUR_COHERE_APIKEY_HERE"
# os.environ["WEAVIATE_URL"] = "PUT_YOUR_WEAVIATE_URL_HERE"
# os.environ["WEAVIATE_APIKEY"] = "PUT_YOUR_WEAVIATE_APIKEY_HERE"
class Client:
    def __init__(self):
        load_dotenv() 
        self.weaviate = weaviate.connect_to_wcs(
            cluster_url = os.environ["WEAVIATE_URL"],
            auth_credentials = AuthApiKey(os.environ["WEAVIATE_APIKEY"]),
            headers = {"X-Cohere-Api-Key": os.environ["COHERE_APIKEY"]}
        )
        self.advisor_data = self.weaviate.collections.get("Advisor")
        self.cohere = cohere.Client(os.environ["COHERE_APIKEY"])