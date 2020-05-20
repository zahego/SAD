// 3308_6_7_8_AjaxCRUD (building from insertDelete good code).

var userCRUD = {}; // globally available object

(function () {  // This is an IIFE, an immediately executing (anonymous) function
    //alert("I am an IIFE!");

    userCRUD.startInsert = function () {

        ajax('html/insertUpdateUser.html', setInsertUI, 'content');

        function setInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            //document.getElementById("insertSaveUserButton").style.display = "inline";
            document.getElementById("updateSaveUserButton").style.display = "none";
            document.getElementById("webUserIdRow").style.display = "none";

            // Make ajax call to listUsersAPI. When that data's ready (and all went well), invoke 
            // function listUsersResponse passing the httpReq (response) as well 
            // as the desired target for that response. Otherwise (error making the http 
            // request), invoke the listUsersError function.
            // These functions are in the listUser.js file...
            ajax("webAPIs/getRolesAPI.jsp", setRolePickList, "playerRoleIdError");

            function setRolePickList(httpRequest) {

                console.log("setRolePickList was called, see next line for object holding list of roles");
                var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
                console.log(jsonObj);

                if (jsonObj.dbError.length > 0) {
                    document.getElementById("playerRoleIdError").innerHTML = jsonObj.dbError;
                    return;
                }

                /*  copy/pasting the first entry from the output of my get role API
                 * 
                 {
                 "dbError": "",
                 "roleList": [
                 {
                 "userRoleId": "1",
                 "userRoleType": "Admin",
                 "errorMsg": ""
                 },
                 */

                // function makePickList(list, keyProp, valueProp, selectListId) {
                makePickList(jsonObj.roleList, "playerRoleId", "roleName", "rolePickList");
            }
        }
    };

    function getUserDataFromUI() {

        var ddList = document.getElementById("rolePickList");

        // strip $ and commas from dollar amount before trying to encode user data for update.
        var dollar = stripDollar(document.getElementById("totalTransaction").value);

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
            "playerId": document.getElementById("playerId").value,
            "playerEmail": document.getElementById("playerEmail").value,
        "playerPassword": document.getElementById("playerPassword").value,
        "playerPassword2": document.getElementById("playerPassword2").value,
        "age": document.getElementById("age").value,
        "registrationDate": document.getElementById("registrationDate").value,
        "totalTransaction": dollar,

            // Modification here for role pick list
            "playerRoleId": ddList.options[ddList.selectedIndex].value,

            "roleName": "",
            "errorMsg": ""
        };

        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(userInputObj));
    }

    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("playerEmailError").innerHTML = jsonObj.playerEmail;
        document.getElementById("playerPasswordError").innerHTML = jsonObj.playerPassword;
        document.getElementById("playerPassword2Error").innerHTML = jsonObj.playerPassword2;
        document.getElementById("ageError").innerHTML = jsonObj.age;
        document.getElementById("registrationDateError").innerHTML = jsonObj.registrationDate;
        document.getElementById("totalTransactionError").innerHTML = jsonObj.totalTransaction;
        document.getElementById("playerRoleIdError").innerHTML = jsonObj.playerRoleId;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    userCRUD.insertSave = function () {

        console.log("userCRUD.insertSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getUserDataFromUI();
        var url = "webAPIs/insertUserAPI.jsp?jsonInsertData=" + myData;
        ajax(url, processInsert, "recordError");

        function processInsert(httpRequest) {
            console.log("processInsert was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }

            writeErrorObjToUI(jsonObj);
        }
    };


    userCRUD.delete = function (userId, icon) {
        if (confirm("Do you really want to delete user " + userId + "? ")) {

            // Calling the DELETE API. 
            var url = "webAPIs/deleteUserAPI.jsp?deleteId=" + userId;
            ajax(url, success, "listMsg");

            function success(http) { // API was successfully called (doesnt mean delete worked)
                var obj = JSON.parse(http.responseText);
                if (obj.errorMsg.length > 0) {
                    alert("foreign key error. Delete connection from assoc table to continue. Full error is [" + obj.errorMsg + "]");
                    //document.getElementById("listMsg").innerHTML = obj.errorMsg;
                } else { // everything good, no error means record was deleted

                    // clear any possible previous error message
                    document.getElementById("listMsg").innerHTML = ""; 

                    // delete the <tr> (row) of the clicked icon from the HTML table
                    console.log("icon that was passed into JS function is printed on next line");
                    console.log(icon);

                    // icon's parent is cell whose parent is row 
                    var dataRow = icon.parentNode.parentNode;
                    var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
                    var dataTable = dataRow.parentNode;
                    dataTable.deleteRow(rowIndex);
                }
            }
        }
    };

    userCRUD.list = function () {

        document.getElementById("content").innerHTML = "";
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2 style='color:white'><b>Web Users <b><img style='position:relative; margin-bottom: 2%' src='icons/insert.png' onclick='userCRUD.startInsert();'/></h2>";
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        document.getElementById("content").appendChild(dataList);

        ajax('webAPIs/listUsersAPI.jsp', setListUI, 'listMsg');

        function setListUI(httpRequest) {

            console.log("starting userCRUD.list (setListUI) with this httpRequest object (next line)");
            console.log(httpRequest);

            var obj = JSON.parse(httpRequest.responseText);

            if (obj === null) {
                document.getElementById("listMsg").innerHTML = "userCRUD.list Error: JSON string evaluated to null.";
                return;
            }

            for (var i = 0; i < obj.webUserList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked 
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.webUserList[i].playerId;
                obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='userCRUD.delete(" + id + ",this)'  />";

                obj.webUserList[i].update = "<img onclick='userCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

                // remove a property from each object in webUserList 
                delete obj.webUserList[i].userPassword2;
            }

            // buildTable Parameters: 
            // First:  array of objects that are to be built into an HTML table.
            // Second: string that is database error (if any) or empty string if all OK.
            // Third:  reference to DOM object where built table is to be stored. 
            buildTable(obj.webUserList, obj.dbError, dataList);
        }
    };


// user has clicked on an update icon from the web_user list UI. 
// inject the insert/update web_user UI into the content area and pre-fill 
// that with the web_user data exracted from the database. 
    userCRUD.startUpdate = function (userId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('html/insertUpdateUser.html', setUpdateUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSaveUserButton").style.display = "none";
            //document.getElementById("updateSaveUserButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getUserByIdAPI.jsp?updateId=" + userId, displayUser, "recordError");

            function displayUser(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                if (obj.webUser.errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.webUser.errorMsg;
                } else if (obj.webUser.playerId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no user with id '" +
                            userId + "' in the database";
                } else if (obj.role.dbError.length > 0) {
                    document.getElementById("recordError").innerHTML += "<br/>Error extracting the Role List options from the database: " +
                            obj.role.dbError;
                } else {
                    var userObj = obj.webUser;
                    document.getElementById("playerId").value = userObj.playerId;
                    document.getElementById("playerEmail").value = userObj.playerEmail;
                    document.getElementById("playerPassword").value = userObj.playerPassword;
                    document.getElementById("playerPassword2").value = userObj.playerPassword2;
                    document.getElementById("age").value = userObj.age;
                    document.getElementById("registrationDate").value = userObj.registrationDate;
                    document.getElementById("totalTransaction").value = userObj.totalTransaction;

                    makePickList(obj.role.roleList, // list of key/value objects for role pick list
                            "playerRoleId", // key property name
                            "roleName", // value property name
                            "rolePickList", // id of dom element where to put role pick list
                            userObj.payerRoleId); // key to be selected (role id fk in web_user object)
                }
            }
        } // setUpdateUI
    };

    userCRUD.updateSave = function () {

        console.log("userCRUD.updateSave was called");
        var myData = getUserDataFromUI();
        var url = "webAPIs/updateUserAPI.jsp?jsonDataUpdate=" + myData;
        ajax(url, processUpdate, "recordError");

        function processUpdate(httpRequest) {
            console.log("processUpdate was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fields named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
            console.log("here is JSON object (holds error messages.");
            console.log(jsonObj);

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully updated !!!";
            }

            writeErrorObjToUI(jsonObj);

        }
    };

    // remove commas and $ from user entered dollar amount.
    // private helper function, availble to any functions in the IIFE
    function stripDollar(dollar) {
        dollar = dollar.replace("$", ""); // replace $ with empty string
        dollar = dollar.replace(",", ""); // replace comma with empty string
        return dollar;
    }

}());  // the end of the IIFE

