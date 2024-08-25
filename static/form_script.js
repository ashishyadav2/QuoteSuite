// ----------------------------------------------------------------------------------------------------
// GLOBAL DATA OBJECT
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

// ----------------------------------------------------------------------------------------------------
// GET CURRENT DATE
function get_current_date(mode) {
    const date = new Date();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (mode == 0) {
        month = months[month - 1];
    }
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    let formatedDate = `${day}-${month}-${year}`;
    return formatedDate;
}

// ----------------------------------------------------------------------------------------------------
// CONVERT obj: YYYY-MMM-DD to DD-MMM-YYYY
function convert_date_datatype(date){
    num_to_months_mapping = { 1:"jan", 2:"feb", 3:"mar", 4:"apr", 5:"may", 6:"jun", 7:"jul", 8:"aug", 9:"sept", 10:"oct", 11:"nov", 12:"dec"}
    extracted_date = date.split("T")[0].split("-")
    day = extracted_date[2]
    month = extracted_date[1]
    year = extracted_date[0]
    if (parseInt(day)<10){
        day = parseInt(day)%10
        day = `0${day}`
    }
    if (parseInt(month)<10) {
        month = parseInt(month)%10
    }
    month = num_to_months_mapping[month]
    month = `${month[0].toUpperCase()}${month.slice(1)}`
    final_date = `${day}-${month}-${year}`
    return final_date    
}
// ----------------------------------------------------------------------------------------------------
// UPDATE DOCUMENT DATE VALUE
function update_top_date_value(mode) {
    const top_date = document.querySelector("#top_date");
    if (mode == 0) {
        top_date.value = get_current_date(0);
    }
    else {
        top_date.value = get_current_date();
    }
}

// ----------------------------------------------------------------------------------------------------
// ERROR LOGGING AND DEBUGGING
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

// ----------------------------------------------------------------------------------------------------
// CHANGE DATE FORMAT
function change_date_format(date) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    date = date.split("-");
    if (typeof date == "undefined"){
        show_alert_and_log("Invalid date!");
        return null
    }
    else if(date.length < 3){
        show_alert_and_log("Invalid date!");
        return null
    }
    day = date[0];
    month = date[1];
    year = date[2];
    month = months[parseInt(month) - 1];
    if (month < 10) {
        month = `0${month}`;
    }
    let formatedDate = `${day}-${month}-${year}`;
    return formatedDate;
}

// ----------------------------------------------------------------------------------------------------
// CLIENT NAME VALIDATION
function validate_client_name() {
    const client_name_element = document.querySelector("#client_name");
    const client_name_element_value = client_name_element.value;
    let isValid = true;
    if (client_name_element_value.length > 35) {
        show_alert_and_log("Client name cannot be more than 50 characters (spaces included)");
        isValid = false;
    }
    if (client_name_element_value.length < 2) {
        show_alert_and_log("Client name should be atleast 2 characters long");
        isValid = false;
    }
    if (client_name_element_value == "") {
        show_alert_and_log("Client name should not be empty");
        isValid = false;
    }
    if (isValid == true) {
        return true;
    }
    return isValid;
}

// ----------------------------------------------------------------------------------------------------
// CLIENT DESCRIPTION VALIDATION
const client_description_element = document.querySelector("#client_description");
client_description_element.addEventListener('keyup', validate_client_name);

function validate_client_description() {
    const client_description_value = client_description_element.value;
    if (client_description_value.length > 120) {
        show_alert_and_log("Client description cannot be more than 120 characters (spaces included)");
        return false;
    }
    return true;
}

// ----------------------------------------------------------------------------------------------------
// TOP DATE VALIDATION
const top_date_element = document.querySelector("#top_date");
top_date_element.addEventListener("focusout", validate_top_date);


function validate_top_date() {
    // validates document top date 
    // valid date range 1 jan 1994 to current date

    const top_date_value = top_date_element.value;
    let isValid = false
    let months_mapping = { "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7, "aug": 8, "sept": 9, "oct": 10, "nov": 11, "dec": 12 };
    date = top_date_value.trim();
    if (typeof date == "undefined"){
        show_alert_and_log("Invalid date!");
        return false;
    }
    date = top_date_value.split("-");
    if (typeof date=="undefined"){
        show_alert_and_log("Invalid date!");
        return false;
    }
    else if (date.length<3){
        show_alert_and_log("Invalid date!");
        return false;
    }
    day = date[0]
    if (day.length>2) {
        isValid = false;
    }
    month = date[1].toLowerCase();
    year = date[2]
    month = months_mapping[month];
    const formated_date_alt = `${year}/${month}/${day}`;
    let dateObj = new Date(formated_date_alt);
    if (isNaN(dateObj)) {
        isValid = false;
    }
    else {
        let current_date = get_current_date().split("-");
        let curr_day = day
        let curr_month = month
        let curr_year = year

        if (typeof current_date == "undefined"){
            show_alert_and_log("Invalid date!");
            return false;
        }
        else if (current_date.length<3){
            show_alert_and_log("Invalid date!");
            return false;
        }
        current_date = `${current_date[2]}/${current_date[1]}/${current_date[0]}`;
        lower_date_limit = new Date(1994, 0, 1); // 01 Jan 1994
        date1 = new Date(formated_date_alt);
        upper_date_limit = new Date(current_date);
        if (date1.getDate()!=parseInt(curr_day) || date1.getMonth()!=parseInt(curr_month)-1 || date1.getFullYear()!=parseInt(curr_year)) {
            show_alert_and_log("Invalid date!")
            isValid = false;
        }               
        if (date1 > upper_date_limit || date1 < lower_date_limit) {
            show_alert_and_log("Invalid date!")
            isValid = false;
        }
        else {
            isValid = true;
        }
    }
    if (isValid == false) {
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
    if (table_title_input.value == "") {
        GLOBAL_DATA_OBJ.file_path = `${prefix_date}-${GLOBAL_DATA_OBJ.q_description[0].product}.ash`;
        isValid = true;
    }
    else {
        GLOBAL_DATA_OBJ.file_path = `${prefix_date}-${table_title_input.value}.ash`;
        isValid = true;
    }
    if (table_title_input.value.length > 80) {
        isValid = false;
    }
    return isValid;
}

// ----------------------------------------------------------------------------------------------------
// FORMATTING TOTAL AMOUNT
function format_total_amount(num) {
    num_arr = num.toString().split("");
    if (num_arr.length < 4) {
        return num;
    }
    let counter = 0;
    let res = [];
    for (let i = num_arr.length - 1; i >= 0; i--) {
        if (counter == 3) {
            break;
        }
        res.push(num_arr[i]);
        counter++;
    }
    let cnt = 0;
    for (let i = num_arr.length - counter - 1; i >= 0; i--) {
        if (cnt % 2 == 0) {
            res.push(",");
        }
        cnt++;
        res.push(num_arr[i]);
    }
    return res.reverse().join("");
}

// ----------------------------------------------------------------------------------------------------
// CONVERTING NUMBER INTO ENGLISH WORDS
function number_to_words(num) {
    var words_0_to_19 = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var words_20_to_90 = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (words_0_to_19[Number(n[1])] || words_20_to_90[n[1][0]] + ' ' + words_0_to_19[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (words_0_to_19[Number(n[2])] || words_20_to_90[n[2][0]] + ' ' + words_0_to_19[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (words_0_to_19[Number(n[3])] || words_20_to_90[n[3][0]] + ' ' + words_0_to_19[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (words_0_to_19[Number(n[4])] || words_20_to_90[n[4][0]] + ' ' + words_0_to_19[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (words_0_to_19[Number(n[5])] || words_20_to_90[n[5][0]] + ' ' + words_0_to_19[n[5][1]]) : '';
    return str;
}

// ----------------------------------------------------------------------------------------------------
// POPULATE DATA FROM DATABASE INTO DOCUMENT
function populate_data_into_document(data_from_db) {
    if (data_from_db == null) {
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
    top_date.value = convert_date_datatype(data_from_db.date.created.$date);
    if (typeof data_from_db.file_path.split("-")[3].split(".")[0] == "undefined"){
        return;
    }
    table_title_input.value = data_from_db.file_path.split("-")[3].split(".")[0];
    cliTextAreaElement.value = format_textarea_data(data_from_db);
    totalSpan.textContent = format_total_amount(data_from_db.total);
    total_in_words.textContent = "Rs. " + number_to_words(data_from_db.total) + " Only";
    modified_date.textContent = convert_date_datatype(data_from_db.date.modified.$date);
    created_date.textContent = convert_date_datatype(data_from_db.date.created.$date);
}


// ----------------------------------------------------------------------------------------------------
// FORMAT TEXTAREA DATA
function format_textarea_data(data_from_db) {
    let description = data_from_db.q_description;
    let finalDescription = [];
    for (let i = 0; i < description.length; i++) {
        let rowData = [];
        row = description[i];
        rowData.push(row.product);
        rowData.push(row.qty);
        rowData.push(row.rate);
        rowData.push(row.amount);
        finalDescription.push(rowData.join("   #   "));
    }
    return finalDescription.join("\n");
}

// ----------------------------------------------------------------------------------------------------
// GET MONGODB DOCUMENT ID OF THE CORRESPONDING QUOTESUITE DOCUMENT
function get_document_id() {
    const document_id = document.querySelector(".document_id span");
    return document_id.textContent;
}

// ----------------------------------------------------------------------------------------------------
// PRODUCT DESCRIPTION VALIDATION
function validate_product_row(qty, rate, amount, rowNum) {
    let isValid = true;
    if (isNaN(qty)) {
        show_alert_and_log(`"Qty column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    if (isNaN(rate)) {
        show_alert_and_log(`"Rate column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    if (isNaN(amount) || amount < 1) {
        show_alert_and_log(`"Amount column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    return isValid;
}

function format_product_description(){
    const cliTextAreaElement = document.querySelector("#cli_textarea");
    const cli_textarea_value = cliTextAreaElement.value;
    try {
        let lines = cli_textarea_value.split("\n");
        for(let i=0;i<lines.length;i++) {
            lines[i] = lines[i].replaceAll("\t","  #  ");
        }
        cliTextAreaElement.value = lines.join("\n");
    } catch (error) {
        show_alert_and_log("Unable to format!");
    }
}
function calculate_rate_qty_amount() {
    format_product_description();
    const cliTextAreaElement = document.querySelector("#cli_textarea");
    const cli_textarea_value = cliTextAreaElement.value;
    try {
        let lines = cli_textarea_value.split("\n");
        for(let i=0;i<lines.length;i++) {
            if (lines[i]==""){
                continue
            }
            row = lines[i].split("#");
            if (row.length>3){
                product = row[0].trim();
                qty = parseInt(row[1].trim());
                rate = parseInt(row[2].trim());
                amount = parseInt(row[3].trim());
                rate = parseFloat(amount/qty).toFixed(2);
            }
            else {
                product = row[0].trim();
                qty = parseInt(row[1].trim());
                amount = parseInt(row[2]).trim();
                rate = parseFloat(amount/qty).toFixed(2);
            }
            modified_row = `${product}  #  ${qty}  #  ${rate}  #  ${amount}`;
            lines[i] = modified_row;
        }
        cliTextAreaElement.value = lines.join("\n");
    } catch (error) {
        show_alert_and_log("Unable to calculate rate!");
    }

}
function validate_product_description() {
    const cliTextAreaElement = document.querySelector("#cli_textarea");
    const cli_textarea_value = cliTextAreaElement.value;
    // const modified_date = document.querySelector("#modified_date");
    const totalSpan = document.querySelector(".total span");

    if (cli_textarea_value == "") {
        show_alert_and_log("Text box cannot be empty!");
        return;
    }

    const data = cli_textarea_value.split("\n");
    let dataArr = [];
    let totalAmount = 0;

    let isValid = false;

    for (let i = 0; i < data.length; i++) {
        if (data[i] == "") {
            continue;
        }

        let rowData = data[i].split("#");
        let rowObj = null;
        for (let j = 0; j < rowData.length; j++) {
            if (rowData.length == 4) {
                const qty = parseFloat(rowData[1].trim());
                const rate = parseFloat(rowData[2].trim());
                const amount = parseFloat(rowData[3].trim());
                if (validate_product_row(qty, rate, amount, i + 1)) {
                    isValid = true;
                    rowObj = {
                        product: rowData[0].trim(),
                        qty: qty,
                        rate: rate,
                        amount: amount
                    }
                }
                else {
                    isValid = false;
                    break;
                }
            }
            else {
                isValid = false;
                show_alert_and_log(`Unable to parse the data!. There should be 4 columns,received less than 4 or more than 4 columns at row: ${i + 1}`);
                break;
            }
        }
        if (isValid) {
            dataArr.push(rowObj);
        }
        else {
            break;
        }
    }
    if (isValid) {
        for (let i = 0; i < dataArr.length; i++) {
            row = dataArr[i];
            totalAmount += row.amount;
        }
        // modified_date.textContent = `${get_current_date(0)}`;
        GLOBAL_DATA_OBJ.q_description = dataArr;
        if (!isNaN(totalAmount)) {
            GLOBAL_DATA_OBJ.total = totalAmount;
            totalSpan.textContent = format_total_amount(totalAmount);
        }
        const total_in_words = document.querySelector(".total_in_words");
        total_in_words.textContent = `Rs. ${number_to_words(totalAmount)} Only`;
        return true;
    }
    return false;
}
// ----------------------------------------------------------------------------------------------------
// HANDLE CLIENT NAME
function handle_client_name() {
    const client_name = document.querySelector("#client_name");
    
    let isValid = false;
    if(validate_client_name()==true) {
        GLOBAL_DATA_OBJ.client_name = client_name.value;
        isValid = true;
    }
    else {
        isValid = false;
    }
    return isValid;
}

// ----------------------------------------------------------------------------------------------------
// HANDLE CLIENT DESCRIPTION
function handle_client_description() {
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
    isValid = validate_client_description();
    return isValid;
}

// ----------------------------------------------------------------------------------------------------
// HANDLE TABLE TITLE
function handle_table_title() {
    return validate_table_title();
}

// ----------------------------------------------------------------------------------------------------
// HANDLE TOP DATE
function handle_top_date() {
    return validate_top_date();
}



// ----------------------------------------------------------------------------------------------------
// STORE CREATED DATE AND MODIFIED DATE IN GLOBAL DATA OBJ
function handle_created_modified_date() {
    const created_date = document.querySelector("#created_date");
    const modified_date = document.querySelector("#modified_date");
    const top_date = document.querySelector("#top_date");
    let isValid = false;
    let created_date_val = created_date.textContent;
    let modified_date_val = modified_date.textContent;
    if (created_date_val != "" && modified_date_val != "") {
        GLOBAL_DATA_OBJ.date.created = top_date.value;
        GLOBAL_DATA_OBJ.date.modified = `${get_current_date(0)}`;

        isValid = true;
    }
    return isValid;
}
// ----------------------------------------------------------------------------------------------------
// LOAD DATA FROM DATABASE (STORED IN HIDDEN INPUT)
function load_data_from_db() {
    try {
        const db_data_element = document.querySelector("#data_from_db");
        db_data = db_data_element.value;
        test_db_data = JSON.parse(db_data);
        db_data = JSON.stringify(test_db_data[0]);
        populate_data_into_document(db_data, true);
    }
    catch (err) {
        console.log("It is new doc page");
        const created_date = document.querySelector("#created_date");
        const modified_date = document.querySelector("#modified_date");
        const top_date = document.querySelector("#top_date");
        top_date.value = get_current_date(0);
        created_date.textContent = top_date.value;
        modified_date.textContent = top_date.value;
    }
}
load_data_from_db();

// ----------------------------------------------------------------------------------------------------
// UPLOAD DATA TO MONGODB DATABASE
function validate_and_save_data() {        
    if ( 
        handle_top_date() && 
        handle_client_name() && 
        handle_client_description() && 
        validate_product_description() && 
        handle_table_title() && 
        handle_created_modified_date()
    ) {        
        console.log(GLOBAL_DATA_OBJ);        
        return true;
    }
    return false;
}

// ----------------------------------------------------------------------------------------------------
// UPLOAD DATA TO MONGODB DATABASE
function upload_to_db() {
    if (validate_and_save_data() == true) {
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
                throw new Error('Network response was not OK');
            }
            return response;
        })
        .then(data => {
            console.log("Document uploaded to db");
        })
        .catch(error => {
            console.error('Error:', error);
        });
        // show_alert_and_log("Your document is successfully saved!","success")
        location.reload();
        // setTimeout(function() {
        //     location.reload();
        // }, 3900);
    }
}

// ----------------------------------------------------------------------------------------------------
// CREATE NEW DOCUMENT ON MONGODB DATABASE
function create_new_doc() {
    if (validate_and_save_data() == true) {
      fetch('/new_document', {
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
        return response.json();
      })
      .then(data => {
        console.log('Data from server:', data);
        window.location.href = `/data/${data}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
// ----------------------------------------------------------------------------------------------------
// SAVE DOCUMENT WITH CTRL + S
function save_document_ctrl_plus_s(e) {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (validate_and_save_data()==true) {
            upload_to_db();
            console.log("document saved");
        }
    }
}
document.addEventListener('keydown', save_document_ctrl_plus_s);

