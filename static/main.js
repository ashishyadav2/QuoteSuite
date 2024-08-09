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

function updateDate(mode) {
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
function formatDate(date) {
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
function updateTopDate(mode) {
    const top_date = document.querySelector("#top_date");
    if(mode==0) {
        top_date.value = updateDate(0);
    }
    else{
        top_date.value = updateDate();
    }
}

function validateCliTextarea(cliTextArea) {
    if(cliTextArea=="") {
        genAlertAndLog("Text box cannot be empty!")
    }
}

function genAlertAndLog(message) {
    console.error(message);
    // window.alert(message);    
}

function validateCliTextareaAdv(qty,rate,amount,rowNum) {
    let isValid = true;
    if(isNaN(qty)) {
        genAlertAndLog(`"Qty column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    if(isNaN(rate)) {
        genAlertAndLog(`"Rate column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    if(isNaN(amount)||amount<0) {
        genAlertAndLog(`"Amount column should be a number at row: ${rowNum}!"`);
        isValid = false;
    }
    return isValid;
}
function cliUpdate() {
    const cliTextAreaElement = document.querySelector("#cli_textarea");
    const cliTextArea = cliTextAreaElement.value;
    const modified_date = document.querySelector("#modified_date");

    validateCliTextarea(cliTextArea);
    const totalSpan = document.querySelector(".total span");
    
    const data = cliTextArea.split("\n");
    let dataArr = [];
    let tempDataArr = [];
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
                if (validateCliTextareaAdv(qty,rate,amount,i+1)) {
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
                genAlertAndLog(`Unable to parse the data!. There should be 4 columns,received less than 4 or more than 4 columns at row: ${i+1}`);
                break;                
            }
        }
        if(isValid) {
            tempDataArr.push(rowObj);
        }
        else {
            break;
        }
    }
    let s = ""
    if(isValid) {
        for(let i=0;i<tempDataArr.length;i++) {
            row = tempDataArr[i];
            totalAmount+=row.amount;
                dataArr.push(tempDataArr[i]);
            }
        modified_date.textContent = `${updateDate(0)}`;
        GLOBAL_DATA_OBJ.q_description = dataArr;
        tempDataArr = [];
        if(!isNaN(totalAmount)) {
            GLOBAL_DATA_OBJ.total = totalAmount;
            totalSpan.textContent = formatAmount(totalAmount);
        }
        const total_in_words = document.querySelector(".total_in_words");
        total_in_words.textContent = `Rs. ${inWords(totalAmount)} Only`;
        return true;
    }
    return false;
}
function formatAmount(num) {
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
function inWords (num) {
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

// let saved_data = localStorage.getItem(getDocumentId());
// if(saved_data==null) {
//     genAlertAndLog(`Document is not stored locally with document id: ${getDocumentId()}`);
// }
// else {
//     populate_data(saved_data,false)
// }
function populate_data(saved_data,isFromServer){
    if (!isFromServer) {
        // saved_data = localStorage.getItem(getDocumentId());
    }
    if(saved_data==null) {
        // genAlertAndLog(`Document is not stored locally with document id: ${getDocumentId()}`);
        return
    }
    saved_data = JSON.parse(saved_data);
    const client_name = document.querySelector("#client_name");
    const client_description = document.querySelector("#client_description");
    const top_date = document.querySelector("#top_date");
    const table_title_input = document.querySelector("#table_title_input");
    const cliTextAreaElement = document.querySelector("#cli_textarea");
    const totalSpan = document.querySelector(".total span");
    const total_in_words = document.querySelector(".total_in_words");
    const modified_date = document.querySelector("#modified_date");
    const created_date = document.querySelector("#created_date");
    
    client_name.value = saved_data.client_name;
    client_description.value = saved_data.client_description;
    top_date.value = saved_data.date.created;
    table_title_input.value = saved_data.file_path.split("-")[3].split(".")[0];
    cliTextAreaElement.value = loadTextAreaData(saved_data,isFromServer);
    totalSpan.textContent = formatAmount(saved_data.total);
    total_in_words.textContent = "Rs. "+inWords(saved_data.total)+ " Only";
    modified_date.textContent = saved_data.date.modified;
    created_date.textContent = saved_data.date.created;
}
function loadTextAreaData(saved_data,isFromServer) {
    if (isFromServer==true){
        // let saved_data = localStorage.getItem(getDocumentId());
        // saved_data = JSON.parse(saved_data);
    }
    let description = saved_data.q_description;
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
function getDocumentId() {
    const document_id = document.querySelector(".document_id span");
    return document_id.textContent;
}
function serializeAllData() {        
    if (handleTopDateValidation() && handleClientName() && handleClientDescription() && cliUpdate()&& handleTableTitle() && handleCreatedModifiedDate() && validateLocalFiles() ) {        
        console.log(GLOBAL_DATA_OBJ);
        // localStorage.setItem(getDocumentId(),JSON.stringify(GLOBAL_DATA_OBJ));
        // console.log("Data saved locally");
        return true;
    }
    return false;
}
setInterval(serializeAllData,350000);
function handleClientName() {
    const client_name = document.querySelector("#client_name");
    
    let isValid = false;
    if(client_name.value=="") {
        genAlertAndLog("Client name cannot be empty!");
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

function handleTableTitle() {
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
function handleTopDateValidation() {
    const top_date = document.querySelector("#top_date");
    if(top_date.value==""){
        genAlertAndLog("Date should not be empty!")
        return false;
    }
    return true;
}
function handleCreatedModifiedDate() {
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
        genAlertAndLog("Cannot store more than 10 files locally!");
        return false;
    }
    return true;
}
function load_from_db() {
    const db_data_element = document.querySelector("#data_from_db");
    db_data = db_data_element.value;
    test_db_data = JSON.parse(db_data);
    db_data = JSON.stringify(test_db_data[0]);
    populate_data(db_data,true);
}
load_from_db();
function upload_to_db() {
     if (serializeAllData()==true) {
         const document_id = getDocumentId();
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