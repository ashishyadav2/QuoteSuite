import os
from pymongo import MongoClient
from handle_env_vars import get_uri,get_db,get_table

class ConnectDB:
    def __init__(self,uri: str,database: str):
        self.client = MongoClient(uri)
        self.database = database

    def connect(self,collection_name: str):
        try:
            self.database = self.client.get_database(self.database)
            collection_table = self.database.get_collection(collection_name)
            print(f"Successfully Connected to Database '{get_db()}'")
            return collection_table
        except Exception as e:
            print(f"Unable to connect to Database '{get_db()}'")
            raise Exception("Unable to find the document due to the following error: ", e)

    def close_connection(self):
        self.client.close()

class DBQueryHandler:
    def __init__(self) -> None:
        self.uri = get_uri()
        self.database = get_db()
        self.collection_name = get_table()
        self.db_obj = ConnectDB(self.uri,self.database)
        self.collection_obj = self.db_obj.connect(self.collection_name)
    
    def stop(self):
        self.db_obj.close_connection()
        
    def insert(self,query):
        self.collection_obj.insert_one(query)
        
    def upsert(self,filter,query):
        self.collection_obj.replace_one(filter,query,upsert = True)
        
    def retrieve(self,query,projection=None,all=False):
        if all:
            return self.collection_obj.find(query,projection)  
        return self.collection_obj.find(query,projection).limit(1)
    
    def get_last_id(self,query,projection=None):
        return self.collection_obj.find(query,projection).sort({"_id": -1}).limit(1)
