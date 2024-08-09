import os
from dotenv import load_dotenv

load_dotenv()


def get_uri():
    uri = os.getenv("URI")
    return uri


def get_db():
    database = os.getenv("DB_NAME")
    return database


def get_table():
    collection_name = os.getenv("COLLECTION_NAME")
    return collection_name

