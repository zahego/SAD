
function setRegisterContent(httpRequest) {

    // Place the inserttUser html snippet into the content area.
    console.log("Ajax call was successful.");
    document.getElementById("content").innerHTML = httpRequest.responseText;

    // Make ajax call to listUsersAPI. When that data's ready (and all went well), invoke 
    // function listUsersResponse passing the httpReq (response) as well 
    // as the desired target for that response. Otherwise (error making the http 
    // request), invoke the listUsersError function.
    // These functions are in the listUser.js file...
    ajaxCall("webAPIs/getRolesAPI.jsp", setRolePickList, rolePickListError);
}

function setRolePickList(httpRequest) {

    console.log("setRolePickList was called, see next line for object holding list of roles");
    var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
    console.log(jsonObj);

    if (jsonObj.dbError.length > 0) {
        document.getElementById("playerRoleIdError").innerHTML = jsonObj.dbError;
        return;
    }
    makePickList(jsonObj.roleList, "playerRoleId", "roleName", "rolePickList");

}

function rolePickListError(httpRequest) {
    console.log("rolePickListError was called. here is httpRequest.");
    console.log(httpRequest);
    document.getElementById("playerRoleIdError").innerHTML = httpRequest.errorMsg;
}

function insertUser() {
    console.log("insert user was called");

    var ddList = document.getElementById("rolePickList");
   

    // create a user object from the values that the user has typed into the page.
    var userInputObj = {
        "playerId": "",
        "playerEmail": document.getElementById("playerEmail").value,
        "playerPassword": document.getElementById("playerPassword").value,
        "playerPassword2": document.getElementById("playerPassword2").value,
        "age": document.getElementById("age").value,
        "registrationDate": document.getElementById("registrationDate").value,
        "totalTransaction": document.getElementById("totalTransaction").value,

        // Modification here for role pick list

        "playerRoleId": ddList.options[ddList.selectedIndex].value,

        "roleName": "",
        "errorMsg": ""
    };
    console.log(userInputObj);

    // build the url for the ajax call. Remember to escape the user input object or else 
    // you'll get a security error from the server. JSON.stringify converts the javaScript
    // object into JSON format (the reverse operation of what gson does on the server side).
    var myData = escape(JSON.stringify(userInputObj));
    var url = "webAPIs/insertUserAPI.jsp?jsonInsertData=" + myData;
    ajaxCall(url, processInsert, processInsertHttpError);

    function processInsert(httpRequest) {
        console.log("processInsert was called here is httpRequest.");
        console.log(httpRequest);

        // the server prints out a JSON string of an object that holds field level error 
        // messages. The error message object (conveniently) has its fiels named exactly 
        // the same as the input data was named. 
        var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("playerEmailError").innerHTML = jsonObj.playerEmail;
        document.getElementById("playerPasswordError").innerHTML = jsonObj.playerPassword;
        document.getElementById("playerPassword2Error").innerHTML = jsonObj.playerPassword2;
        document.getElementById("ageError").innerHTML = jsonObj.age;
        document.getElementById("registrationDateError").innerHTML = jsonObj.registrationDate;
        document.getElementById("totalTransactionError").innerHTML = jsonObj.totalTransaction;
        document.getElementById("playerRoleIdError").innerHTML = jsonObj.playerRoleId;

        if (jsonObj.errorMsg.length === 0) { // success
            jsonObj.errorMsg = "Record successfully inserted !!!";
        }
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    function processInsertHttpError(httpRequest) {
        console.log("processInsertHttpError was called here is httpRequest.");
        console.log(httpRequest);
        document.getElementById("recordError").innerHTML = httpRequest.errorMsg;
    }
}


