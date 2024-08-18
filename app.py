from flask import Flask,render_template,request, redirect,url_for, jsonify
import json
from db_test import DBQueryHandler
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
from data_validation import DataValidation
from datetime import datetime
import time

app = Flask(__name__)

@app.route("/",methods=['GET'])
def home():
    return "hello world"

@app.route("/data/<doc_id>",methods = ['GET','POST'])
def data_doc_id(doc_id):
    if doc_id=="":
        return redirect(url_for("data"),code=302)
    try:
        a = ObjectId(doc_id)
    except Exception as e:
        print("Invalid doc id")
        return redirect(url_for("data"),code=302)
    
    db_obj = DBQueryHandler()
    db_res = []
    if request.method == "GET":
        try:
            for res in db_obj.retrieve({"_id": ObjectId(doc_id)}):
                db_res.append(res)
            db_obj.stop()
        except Exception as e:
            print(f"{doc_id} is not in db")
            print(e)
        return render_template("form.html",document_id=doc_id,db_data=dumps(db_res))
            
    if request.method=="POST":        
        form_data = request.get_json()
        doc_filter = {"_id": ObjectId(doc_id)}
        data_validation_obj = DataValidation(form_data)
        validated_data_dict = data_validation_obj.get_data_dict()
        print(validated_data_dict)
        if validated_data_dict:
            print('inserted')
            db_obj.upsert(doc_filter,validated_data_dict)
            db_obj.stop()
            return render_template("form.html",document_id=doc_id,db_data=dumps(db_res))
        else:
            print("unable to insert data")
        return "Invalid data format! Try again"

@app.route("/data/",methods=['GET'])
def data():
    db_obj = DBQueryHandler()
    all_docs = []
    query = {}
    projection = {
                    "_id":1,
                    "file_path":1,
                    "date":1                
                }
             
    for res in db_obj.retrieve(query,projection,True):
        all_docs.append(res)
        
    return render_template("index.html",all_docs=dumps(all_docs))

@app.route("/new_document",methods=["GET","POST"]) 
def handle_new_document():
    if request.method == "GET":        
        return render_template("new_document.html",document_id="new_document")
    
    if request.method == "POST":
        doc_data = request.get_json()
        data_validation_obj = DataValidation(doc_data)
        validated_data_dict = data_validation_obj.get_data_dict()
        if validated_data_dict:
            db_obj = DBQueryHandler()
            db_obj.insert(doc_data)
            query = {}
            projection = {"_id":1}
            doc_id = [res for res in db_obj.get_last_id(query,projection)]
            db_obj.stop()
            doc_id = json.loads(dumps(doc_id))[0]["_id"]["$oid"]
            return jsonify(doc_id)
        return jsonify("Invalid data format!")
    
@app.route("/search",methods=["GET","POST"]) 
def search_in_db(): 
    if request.method == "POST":
        search_obj = request.get_json()
        db_obj = DBQueryHandler()
        # print(datetime.strptime(search_obj["date"]["date_end"],"%Y-%m-%d"))
        # if search_obj['client_name'] == "":
        #     client_name_query = {}
        # else:
        #     client_name_query = search_obj['client_name'].strip()
        # if search_obj['client_desc'] == "":
        #     client_desc_query = {}
        # else:
        #     client_desc_query = search_obj['client_desc'].strip()
        if search_obj['search_text']=="":
            add_queries = {}
        else:
            search_text_query = search_obj['search_text'].strip() 
            add_queries = {
                "$text": {
                    "$search": search_text_query
                }
            }
            
        # if not (client_name_query and client_desc_query and search_text_query):
        #     add_queries = {}
            
        # query_arr = [client_name_query,client_desc_query,search_text_query]
        
        # for text in query_arr:
        #     add_queries["$text"]
            
        # else:
        #     add_queries = {
        #         "$text" : {
        #             "$search": client_name_query,
        #             "$search": client_desc_query,
        #             "$search": search_text_query 
        #         }
        #     }
        query = {
    "$and": [
        {
            "$or": [
                {"date.created": 
                    {"$gte": datetime.strptime(search_obj["date"]["date_start"],"%Y-%m-%d"),   "$lte": datetime.strptime(search_obj["date"]["date_end"],"%Y-%m-%d")}},
                
                {"date.modified": 
                    {"$gte": datetime.strptime(search_obj["date"]["date_start"],"%Y-%m-%d"), 
                     "$lte": datetime.strptime(search_obj["date"]["date_end"],"%Y-%m-%d")}}
            ]
        },
        {
            "total": {
                "$gte": search_obj["total"]["total_start"],
                "$lte": search_obj["total"]["total_end"]
            }
        }
    ]
}
        query["$and"].append(add_queries)
        print(query)
        projection = {"_id":1,"file_path":1,"date":1}
        result_data = []
        for res in db_obj.retrieve(query,projection,all=True):
            result_data.append(res)
        print(search_obj)
        db_obj.stop()
        return jsonify(dumps(result_data))
    return render_template("index.html",result_data = None)

if __name__ == "__main__":
    app.run(debug=True)