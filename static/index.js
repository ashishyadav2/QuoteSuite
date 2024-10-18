// ----------------------------------------------------------------------------------------------------
// CONVERT obj: YYYY-MMM-DD to DD-MMM-YYYY
function convert_date_datatype(date) {
    num_to_months_mapping = { 1: "jan", 2: "feb", 3: "mar", 4: "apr", 5: "may", 6: "jun", 7: "jul", 8: "aug", 9: "sept", 10: "oct", 11: "nov", 12: "dec" }
    extracted_date = date.split("T")[0].split("-")
    day = extracted_date[2]
    month = extracted_date[1]
    year = extracted_date[0]
    if (parseInt(day) < 10) {
        day = parseInt(day) % 10
        day = `0${day}`
    }
    if (parseInt(month) < 10) {
        month = parseInt(month) % 10
    }
    month = num_to_months_mapping[month]
    month = `${month[0].toUpperCase()}${month.slice(1)}`
    final_date = `${day}-${month}-${year}`
    return final_date
}

const message_box_container = document.querySelector(".message_box_container");
const time_bar = document.querySelector(".time_bar");    
const message_content = document.querySelector(".message_content");
const message_title = document.querySelector(".message_box span");
function show_alert_and_log(message, message_class) {
    message_content.textContent = message;
    
    if (message_class!="success") {
        message_title.textContent = "Error!"
        message_box_container.classList.add("show_error");
    }
    else {
        message_title.textContent = "Success!"
        message_box_container.classList.add("show_success");        
    }
    time_bar.classList.add("time_bar_active");
    setTimeout(hide_message_box,4000);
    
    console.error(message);
    // window.alert(message);    
}

function hide_message_box(){
    message_box_container.classList.remove("show_success");
    message_box_container.classList.remove("show_error");
    time_bar.classList.remove("time_bar_active");
}

function get_all_docs() {
    const db_data_element = document.querySelector("#data_from_db");
    db_data = JSON.parse(db_data_element.value);
    // console.log(db_data);
    const card_holder = document.querySelector(".card_holder");
    for (let i = 0; i < db_data.length; i++) {
        curr_doc = db_data[i]
        const rowHTML = ` 
                <div class="card">
                    <div id="srno">${i + 1}</div>
                    <a   href="${curr_doc._id.$oid}">${curr_doc.file_path}</a>
                    <div id="modified_date">${convert_date_datatype(curr_doc.date.modified.$date)}</div>
                    <div id="created_date">${convert_date_datatype(curr_doc.date.created.$date)}</div>
                    <input type="hidden" name="doc_id" value="${curr_doc._id.$oid}">
                </div>`;
        card_holder.innerHTML += rowHTML;
    }
}
get_all_docs();
SEARCH_QUERY_OBJ = {
    search_text: "",
    client_name: "",
    client_desc: "",
    total: {
        total_start: 0,
        total_end: 10000000
    },
    date: {
        date_start: "",
        date_end: "",
    }
}
function get_current_date() {
    const date_obj = new Date();
    return date_obj.toISOString();
}
const search_text = document.querySelector("#search_box");
const search_btn = document.querySelector("#search_btn");
const client_name_text_box = document.querySelector("#client_name_text_box");
const client_desc_text_box = document.querySelector("#client_desc_text_box");
const total_start = document.querySelector("#total_start");
const total_end = document.querySelector("#total_end");
const date_start = document.querySelector("#date_start");
const date_end = document.querySelector("#date_end");

function validate_date_range() {
    date_start_ = new Date(date_start.value);
    date_end_ = new Date(date_end.value);
    if (date_start_ > date_end_) {
        show_alert_and_log("Invalid date range!");
        return false;
    }
    if (date_start.value == "") {
        SEARCH_QUERY_OBJ.date.date_start = new Date(1994, 0, 1).toISOString().split("T")[0];
    }
    else {
        SEARCH_QUERY_OBJ.date.date_start = date_start.value;
    }
    if (date_end.value == "") {
        SEARCH_QUERY_OBJ.date.date_end = get_current_date().split("T")[0];
    }
    else {
        SEARCH_QUERY_OBJ.date.date_end = date_end.value;
    }
    return true;
}

function validate_total_range() {
    total_start_ = total_start.value;
    total_end_ = total_end.value;
    if (isNaN(parseInt(total_start_))) {
        total_start_ = 0
    }
    if (isNaN(parseInt(total_end_))) {
        total_end_ = 10000000
    }
    total_start_ = parseInt(total_start_)
    total_end_ = parseInt(total_end_)
    if ((total_start_ < 0 || total_end_ > 10000000) || !(total_start_ <= total_end_)) {
        show_alert_and_log("Invalid total range!");
        return false;
    }
    SEARCH_QUERY_OBJ.total.total_start = total_start_
    SEARCH_QUERY_OBJ.total.total_end = total_end_
    return true;
}

function validate_client_name_description() {
    SEARCH_QUERY_OBJ.client_name = client_name_text_box.value.trim();
    SEARCH_QUERY_OBJ.client_desc = client_desc_text_box.value.trim();
    return true;
}

function validate_search_text() {
    SEARCH_QUERY_OBJ.search_text = search_text.value.trim();
    SEARCH_QUERY_OBJ.search_text = search_text.value.trim();
    return true;
}

date_start.max = new Date().toISOString().split("T")[0];
date_end.max = new Date().toISOString().split("T")[0];

function fire_query() {
    if (search_query() == true) {
        fetch(`/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(SEARCH_QUERY_OBJ)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            })
            .then(data => {
                console.log("query fired", data);
                show_search_results(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
function search_query() {
    if (validate_date_range() && validate_total_range() && validate_client_name_description() && validate_search_text()) {
        return true;
    }
    return false;
}

function show_search_results(data) {
    db_data = JSON.parse(data);
    const card_holder = document.querySelector(".card_holder");
    card_holder.innerHTML = ""
    if (db_data.length<1){
        card_holder.innerHTML = "No records";
        return;
    }
    for (let i = 0; i < db_data.length; i++) {
        curr_doc = db_data[i]
        const rowHTML = ` 
                <div class="card">
                <div id="srno">${i + 1}</div>
                <a   href="${curr_doc._id.$oid}">${curr_doc.file_path}</a>
                <div id="modified_date">${convert_date_datatype(curr_doc.date.modified.$date)}</div>
                <div id="created_date">${convert_date_datatype(curr_doc.date.created.$date)}</div>
                <input type="hidden" name="doc_id" value="${curr_doc._id.$oid}">
                </div>`;
        card_holder.innerHTML += rowHTML;
    }
    console.log("data");
}

const search_box = document.querySelector("#search_box");
function show_search_filters() {
    const filter_container = document.querySelector(".filter_container");
    filter_container.classList.toggle("show_filter");
}
search_box.addEventListener('keydown',enter_search_btn)
function enter_search_btn(e){
    // e.preventDefault();
    if (e.key == "Enter") {
        fire_query()
    }

}

// ----------------------------------------------------------------------------------------------------
// SORT FILTERS
function sort_filter(){
    const select_filter = document.querySelector("#select_filter").value;
    const asc_desc_filter = document.querySelector("#asc_desc_filter").value;
    let SORT_OBJ = {
        "sort_by": select_filter,
        "order": asc_desc_filter
    }
    fetch(`/sort_filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SORT_OBJ)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
            // console.log("Sort results", data);            
            show_search_results(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// db.test.find({
//     $or: [
//         {"date.created": {$gte: ISODate("2024-01-01") ,$lte: ISODate("2024-06-01")}},
//         {"date.modified": {$gte: ISODate("2024-08-18") ,$lte: ISODate("2024-08-18")}}
//     ]
// })

// db.test.find({
//     total: {
//     $gte: 50000,
//     $lte: 10000000
//     }
// })

// db.test.find({
//     $and: [
//         {
//             $or: [
//                 {"date.created": {$gte: ISODate("2024-01-01"), $lte: ISODate("2024-08-18")}},
//                 {"date.modified": {$gte: ISODate("2024-08-18"), $lte: ISODate("2024-08-18")}}
//             ]
//         },
//         {
//             total: {
//                 $gte: 0,
//                 $lte: 10000000
//             }
//         }
//     ]
// })

// client_name_text_client_description_text_q_description.product_text
// db.test.find({$text: {$search: "adfas"}})