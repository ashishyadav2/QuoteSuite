
function get_all_docs() {
    const db_data_element = document.querySelector("#data_from_db");
    db_data = JSON.parse(db_data_element.value);
    // console.log(db_data);
    const card_holder = document.querySelector(".card_holder");
    for(let i=0;i<db_data.length;i++) {
        curr_doc = db_data[i]
        const rowHTML = ` 
                <div class="card">
                    <div id="srno">${i+1}</div>
                    <a href="${curr_doc._id.$oid}">${curr_doc.file_path}</a>
                    <div id="modified_date">${curr_doc.date.modified}</div>
                    <div id="created_date">${curr_doc.date.created}</div>
                    <input type="hidden" name="doc_id" value="${curr_doc._id.$oid}">
                </div>`;
        card_holder.innerHTML+=rowHTML;        
    }
}
get_all_docs();