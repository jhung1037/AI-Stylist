import os
import weaviate
from weaviate.auth import AuthApiKey
from weaviate.classes.config import Configure
from dotenv import load_dotenv
from datasets import load_dataset


load_dotenv()
client = weaviate.connect_to_wcs(
    cluster_url = os.environ["WEAVIATE_URL"],
    auth_credentials = AuthApiKey(os.environ["WEAVIATE_APIKEY"]),
    headers = {"X-Cohere-Api-Key": os.environ["COHERE_APIKEY"]}
)

try:
    client.collections.get("Advisor")
    print("Advisor collection exists")
except:
    dataset = load_dataset("neuralwork/fashion-style-instruct")

    client.collections.create(
        "Advisor",
        vectorizer_config = Configure.Vectorizer.text2vec_cohere()
    )

    advisor_data = client.collections.get("Advisor")
    with advisor_data.batch.dynamic() as batch:
        for src_obj in dataset["train"]:
            weaviate_obj = {
                "traits": src_obj["input"],
                "combinations": src_obj["completion"],
                "occasion": src_obj["context"]
            }
            batch.add_object(properties = weaviate_obj)
    
    print("Advisor collection reconfigured")
 
client.close()