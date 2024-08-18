var GLOBAL_DATA_OBJ = {
    file_path: null,
    client_name: null,
    client_description: null,
    q_description: [],
    date: {
        created: null,
        modified: null
    },
    total: 0
};                  

function get_current_date(mode) {
    const date = new Date();
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    if(mode==0) {
        month = months[month-1];
    }
    if(month<10) {
        month = `0${month}`;
    }
    if(day<10) {
        day = `0${day}`;
    }
    let formatedDate = `${day}-${month}-${year}`;
    return formatedDate;
}
function change_date_format(date) {
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    date = date.split("-");
    day = date[0];
    month = date[1];
    year = date[2];
    month = months[parseInt(month)-1];
    if(month<10) {
        month = `0${month}`;
    }
    let formatedDate = `${day}-${month}-${year}`;
    return formatedDate;
}
function update_top_date_value(mode) {
    const top_date = document.querySelector("#top_date");
    if(mode==0) {
        top_date.value = get_current_date(0);
    }
    else{
        top_date.value = get_current_date();
    }
}


function show_alert_and_log(message) {
    console.error(message);
    // window.alert(message);    
}

function validate_product_row(qty,rate,amount,rowNum) {
    let isValid = true;
    if(isNaN(qty)) {
        show_alert_and_log(`"Qty column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    if(isNaN(rate)) {
        show_alert_and_log(`"Rate column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    if(isNaN(amount)||amount<1) {
        show_alert_and_log(`"Amount column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    return isValid;
}

function format_total_amount(num) {
    temp = num.toString().split("");    
    if(temp.length<4) {
        return num;
    }    
    let counter = 0;    
    let s = [];
    for(let i=temp.length-1;i>=0;i--) {
        if(counter==3){
            break;
        }
        s.push(temp[i]);
        counter++;
    }
    let c = 0;
    for(let i=temp.length-counter-1;i>=0;i--) {
        if(c%2==0){
            s.push(",");
        }
        c++;
        s.push(temp[i]);
    }
    return s.reverse().join("");
}
function number_to_words (num) {
    var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
}

// let data_from_db = localStorage.getItem(get_document_id());
// if(data_from_db==null) {
//     show_alert_and_log(`Document is not stored locally with document id: ${get_document_id()}`);
// }
// else {
//     populate_data_into_document(data_from_db,false)
// }
function populate_data_into_document(data_from_db,isFromServer){
    if (!isFromServer) {
        // data_from_db = localStorage.getItem(get_document_id());
    }
    if(data_from_db==null) {
        // show_alert_and_log(`Document is not stored locally with document id: ${get_document_id()}`);
        return
    }
    data_from_db = JSON.parse(data_from_db);
    const client_name = document.querySelector("#client_name");
    const client_description = document.querySelector("#client_description");
    const top_date = document.querySelector("#top_date");
    const table_title_input = document.querySelector("#table_title_input");
    const cliTextAreaElement = document.querySelector("#cli_textarea");
    const totalSpan = document.querySelector(".total span");
    const total_in_words = document.querySelector(".total_in_words");
    const modified_date = document.querySelector("#modified_date");
    const created_date = document.querySelector("#created_date");
    
    client_name.value = data_from_db.client_name;
    client_description.value = data_from_db.client_description;
    top_date.value = data_from_db.date.created;
    table_title_input.value = data_from_db.file_path.split("-")[3].split(".")[0];
    cliTextAreaElement.value = format_textarea_data(data_from_db,isFromServer);
    totalSpan.textContent = format_total_amount(data_from_db.total);
    total_in_words.textContent = "Rs. "+number_to_words(data_from_db.total)+ " Only";
    modified_date.textContent = data_from_db.date.modified;
    created_date.textContent = data_from_db.date.created;
}
function format_textarea_data(data_from_db) {
    let description = data_from_db.q_description;
    let finalDescription = [];
    for(let i=0;i< description.length;i++) {
        let rowData = [];
        row = description[i];
        rowData.push(row.product);
        rowData.push(row.qty);
        rowData.push(row.rate);
        rowData.push(row.amount);
        finalDescription.push(rowData.join("  #  "));
    }
    return finalDescription.join("\n"); 
}
function get_document_id() {
    const document_id = document.querySelector(".document_id span");
    return document_id.textContent;
}
function serializeAllData() {        
    if (handle_top_date() && handleClientName() && handleClientDescription() && validate_product_description()&& handle_table_title() && handle_created_modified_date() && validateLocalFiles() ) {        
        console.log(GLOBAL_DATA_OBJ);
        // localStorage.setItem(get_document_id(),JSON.stringify(GLOBAL_DATA_OBJ));
        // console.log("Data saved locally");
        return true;
    }
    return false;
}
// setInterval(serializeAllData,350000);
function handleClientName() {
    const client_name = document.querySelector("#client_name");
    
    let isValid = false;
    if(client_name.value=="") {
        show_alert_and_log("Client name cannot be empty!");
        isValid = false;
    }
    else{
        GLOBAL_DATA_OBJ.client_name = client_name.value;
        isValid = true;
    }
    return isValid;
}

function handleClientDescription() {
    const client_name = document.querySelector("#client_name");
    const client_description = document.querySelector("#client_description");
    let isValid = false;
    if(client_description.value=="") {
        GLOBAL_DATA_OBJ.client_description = client_name.value;
        isValid = true;
    }
    else{
        GLOBAL_DATA_OBJ.client_description = client_description.value;
        isValid = true;
    }
    return isValid;
}

function handle_table_title() {
    const table_title_input = document.querySelector("#table_title_input");
    const top_date = document.querySelector("#top_date");
    let prefix_date = top_date.value;
    let isValid = false;
    if(table_title_input.value=="") {
        GLOBAL_DATA_OBJ.file_path = `${prefix_date}-${GLOBAL_DATA_OBJ.q_description[0].product}.ash`;
        isValid = true;
    }
    else{
        GLOBAL_DATA_OBJ.file_path = `${prefix_date}-${table_title_input.value}.ash`;
        isValid = true;
    }    
    return isValid;
}
function handle_top_date() {
    return validate_top_date();
}
function handle_created_modified_date() {
    const created_date = document.querySelector("#created_date");
    const modified_date = document.querySelector("#modified_date");
    const top_date = document.querySelector("#top_date");
    let isValid = false;
    let created_date_val = created_date.textContent;
    let modified_date_val = modified_date.textContent;
    if (created_date_val!=""&&modified_date_val !="") {
        GLOBAL_DATA_OBJ.date.created = top_date.value;
        GLOBAL_DATA_OBJ.date.modified = modified_date.textContent;
        isValid = true;
    }
    return isValid;
}
function validateLocalFiles() {
    if(localStorage.length>10) {
        show_alert_and_log("Cannot store more than 10 files locally!");
        return false;
    }
    return true;
}
function load_data_from_db() {
    const db_data_element = document.querySelector("#data_from_db");
    db_data = db_data_element.value;
    test_db_data = JSON.parse(db_data);
    db_data = JSON.stringify(test_db_data[0]);
    populate_data_into_document(db_data,true);
}
load_data_from_db();

function upload_to_db() {
     if (serializeAllData()==true) {
         const document_id = get_document_id();
         fetch(`/data/${document_id}`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(GLOBAL_DATA_OBJ)
         })
         .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response;
          })
          .then(data => {
            console.log("Uploaded to db");
          })
          .catch(error => {
            console.error('Error:', error);
          });
         location.reload();
     }    
}

// ----------------------------------------------------------------------------------------------------
// GLOBAL ELEMENTS



// ----------------------------------------------------------------------------------------------------
// SAVE DOCUMENT WITH CTRL + S
function save_document_ctrl_plus_s(e) {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        upload_to_db();
        console.log("document saved");
    }
}
document.addEventListener('keydown', save_document_ctrl_plus_s);

// ----------------------------------------------------------------------------------------------------
// CLIENT NAME VALIDATION
const client_name_element = document.querySelector("#client_name");
client_name_element.addEventListener('keyup',validate_client_name);

function validate_client_name(){
    const client_name_element_value = client_name_element.value;
    let isValid = false;
    if (client_name_element_value.length>35) {
        show_alert_and_log("Client name cannot be more 50 characters (spaces included)");
        isValid = false;
    }
    if(client_name_element_value.length<2) {
        show_alert_and_log("Client name should be atleast 2 characters long");
        isValid = false;
    }
    if(client_name_element_value=="") {
        show_alert_and_log("Client name should not be empty");
        isValid = false;
    }
    if(isValid==true) {
        return true;
    }
    return isValid;    
}

// ----------------------------------------------------------------------------------------------------
// CLIENT DESCRIPTION VALIDATION
const client_description_element = document.querySelector("#client_description");
client_description_element.addEventListener('keyup',validate_client_name);

function validate_client_description() {
    const client_description_value = client_description_element.value;
    if (client_description_value.length>120) {
        show_alert_and_log("Client name cannot be more 50 characters (spaces included)");
        return false;
    }
    return true;
}

// ----------------------------------------------------------------------------------------------------
// TOP DATE VALIDATION
const top_date_element = document.querySelector("#top_date");
top_date_element.addEventListener("focusout",validate_top_date);


function validate_top_date() {
    // validates document top date 
    // valid date range 1 jan 1994 to current date
    
    const top_date_value = top_date_element.value;
    let isValid = false
    let months_mapping = {"jan":1,"feb":2,"mar":3,"apr":4,"may":5,"jun":6,"jul":7,"aug":8,"sept":9,"oct":10,"nov":10,"dec":12};
    date = top_date_value.trim();
    date = top_date_value.split("-");
    day = date[0]
    month = date[1].toLowerCase();
    year = date[2]
    month = months_mapping[month];
    const formated_date_alt = `${year}/${month}/${day}`;
    let dateObj = new Date(formated_date_alt);
    if (isNaN(dateObj)){
        isValid = false;
    }
    else{
        let current_date = get_current_date().split("-");
        current_date = `${current_date[2]}/${current_date[1]}/${current_date[0]}`;
        lower_date_limit = new Date(1994, 0, 1); // 01 Jan 1994
        date1 = new Date(formated_date_alt);
        upper_date_limit = new Date(current_date);
        if (date1>upper_date_limit || date1< lower_date_limit) {
            isValid = false;
        }
        else {
            isValid = true;
        }
    }
    if(isValid==false) {
        show_alert_and_log("Invalid date!");
        return false;
    }
    return true;
}

// ----------------------------------------------------------------------------------------------------
// TABLE TITLE VALIDATION
const table_title_input = document.querySelector("#table_title_input");
function validate_table_title() {
    let prefix_date = top_date_element.value;
    let isValid = false;
    if(table_title_input.value=="") {
        GLOBAL_DATA_OBJ.file_path = `${prefix_date}-${GLOBAL_DATA_OBJ.q_description[0].product}.ash`;
        isValid = true;
    }
    else{
        GLOBAL_DATA_OBJ.file_path = `${prefix_date}-${table_title_input.value}.ash`;
        isValid = true;
    }    
    if (table_title_input.value.length>80) {
        isValid = false;
    }
    return isValid;
}
// ----------------------------------------------------------------------------------------------------
// PRODUCT DESCRIPTION VALIDATION
const cliTextAreaElement = document.querySelector("#cli_textarea");
const cli_textarea_value= cliTextAreaElement.value;
const modified_date = document.querySelector("#modified_date");
const totalSpan = document.querySelector(".total span");

function validate_product_description() {

    if(cli_textarea_value=="") {
        show_alert_and_log("Text box cannot be empty!");
        return;
    }
    
    const data = cli_textarea_value.split("\n");
    let dataArr = [];
    let totalAmount = 0;
    
    let isValid = false;
    
    for(let i=0;i<data.length;i++) {
        if(data[i]=="") {
            continue;
        }
        
        let rowData = data[i].split("#");
        let rowObj = null;
        for(let j=0;j<rowData.length;j++) {
            if (rowData.length==4) {
                const qty= parseFloat(rowData[1].trim());
                const rate= parseFloat(rowData[2].trim());
                const amount= parseFloat(rowData[3].trim());
                if (validate_product_row(qty,rate,amount,i+1)) {
                    isValid = true;
                    rowObj = {
                        product: rowData[0].trim(),
                        qty: qty,
                        rate: rate,
                        amount: amount
                    }                    
                }
                else{
                    isValid = false;
                    break;
                }
            }
            else {
                isValid = false;
                show_alert_and_log(`Unable to parse the data!. There should be 4 columns,received less than 4 or more than 4 columns at row: ${i+1}`);
                break;                
            }
        }
        if(isValid) {
            dataArr.push(rowObj);
        }
        else {
            break;
        }
    }
    if(isValid) {
        for(let i=0;i<dataArr.length;i++) {
            row = dataArr[i];
            totalAmount+=row.amount;
            }
        modified_date.textContent = `${get_current_date(0)}`;
        GLOBAL_DATA_OBJ.q_description = dataArr;
        if(!isNaN(totalAmount)) {
            GLOBAL_DATA_OBJ.total = totalAmount;
            totalSpan.textContent = format_total_amount(totalAmount);
        }
        const total_in_words = document.querySelector(".total_in_words");
        total_in_words.textContent = `Rs. ${number_to_words(totalAmount)} Only`;
        return true;
    }
    return false;
}
