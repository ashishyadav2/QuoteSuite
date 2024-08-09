from flask import Flask,render_template,request, redirect,url_for, jsonify
import json
from db_test import DBQueryHandler
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
import bson

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
        form_data = json.loads(form_data)
        print(form_data)
        doc_filter = {"_id": ObjectId(doc_id)}
        db_obj.upsert(doc_filter,form_data)
        db_obj.stop()
        return render_template("form.html",document_id=doc_id,db_data=dumps(db_res))

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
    if request.method == "POST":
        doc_data = request.get_json()
        db_obj = DBQueryHandler()
        db_obj.insert(doc_data)
        query = {}
        projection = {"_id":1}
        doc_id = [res for res in db_obj.get_last_id(query,projection)]
        doc_id = json.loads(dumps(doc_id))[0]["_id"]["$oid"]
        print(doc_id)
        # return redirect(url_for("data_doc_id",doc_id=doc_id))
        return doc_id
        # print("got request")
        # print(doc_data)
        # print(url_for("data_doc_id",doc_id="ashish"))
        # # return "inside d"
        # return redirect(url_for("data_doc_id",doc_id="ashish"),code=302)
    
    if request.method == "GET":        
        return render_template("new_document.html",document_id="new_document")

if __name__ == "__main__":
    app.run(debug=True)