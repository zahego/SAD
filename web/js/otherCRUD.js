// 3308_6_7_8_AjaxCRUD (building from insertDelete good code).

var otherCRUD = {}; // globally available object

(function () {  // This is an IIFE, an immediately executing (anonymous) function
    //alert("I am an IIFE!");

    otherCRUD.startInsert = function () {

        ajax('html/insertUpdateOther.html', setOtherInsertUI, 'content');

        function setOtherInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            //document.getElementById("insertSaveOtherButton").style.display = "inline";
            document.getElementById("updateSaveOtherButton").style.display = "none";
            document.getElementById("gameClassIdRow").style.display = "none";


        }
    };

    function getOtherDataFromUI() {

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
        "gameClassId": document.getElementById("gameClassId").value,
        "className": document.getElementById("className").value,
        "classDescription": document.getElementById("classDescription").value,
        "attack": document.getElementById("attack").value,
        "defense": document.getElementById("defense").value,
        "magic": document.getElementById("magic").value,
        "stealth": document.getElementById("stealth").value,
        "speed": document.getElementById("speed").value,
        "crit": document.getElementById("crit").value,

            "errorMsg": ""
        };

        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(userInputObj));
    }

    function writeOtherErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("classNameError").innerHTML = jsonObj.className;
        document.getElementById("classDescriptionError").innerHTML = jsonObj.classDescription;
        document.getElementById("attackError").innerHTML = jsonObj.attack;
        document.getElementById("defenseError").innerHTML = jsonObj.defense;
        document.getElementById("magicError").innerHTML = jsonObj.magic;
        document.getElementById("stealthError").innerHTML = jsonObj.stealth;
        document.getElementById("speedError").innerHTML = jsonObj.speed;
        document.getElementById("critError").innerHTML = jsonObj.crit;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;

    }

    otherCRUD.insertSave = function () {

        console.log("otherCRUD.insertSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getOtherDataFromUI();
        var url = "webAPIs/insertOtherAPI.jsp?jsonDataOther=" + myData;
        ajax(url, processOtherInsert, "recordError");

        function processOtherInsert(httpRequest) {
            console.log("processOtherInsert was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }

            writeOtherErrorObjToUI(jsonObj);
        }
    };


    otherCRUD.delete = function (gameClassId, icon) {
        if (confirm("Do you really want to delete character with " + gameClassId + "? ")) {

            // Calling the DELETE API. 
            var url = "webAPIs/deleteOtherAPI.jsp?deleteOtherId=" + gameClassId;
            ajax(url, success, "listMsg");

            function success(http) { // API was successfully called (doesnt mean delete worked)
                var obj = JSON.parse(http.responseText);
                if (obj.errorMsg.length > 0) {
                alert("foreign key error. Delete connection from assoc table to continue. Full error is [" + obj.errorMsg + "]");

//                    document.getElementById("listMsg").innerHTML = obj.errorMsg;
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

    otherCRUD.list = function () {

        document.getElementById("content").innerHTML = "";
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2 style='color:white'><b>New Game Class <b><img style='position:relative; margin-bottom: 2%' src='icons/insert.png' onclick='userCRUD.startInsert();'/></h2>";
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        document.getElementById("content").appendChild(dataList);

        ajax('webAPIs/listOtherAPI.jsp', setListOtherUI, 'listMsg');

        function setListOtherUI(httpRequest) {

            console.log("starting otherCRUD.list (setListOtherUI) with this httpRequest object (next line)");
            console.log(httpRequest);

            var obj = JSON.parse(httpRequest.responseText);

            if (obj === null) {
                document.getElementById("listMsg").innerHTML = "otherCRUD.list Error: JSON string evaluated to null.";
                return;
            }

            for (var i = 0; i < obj.webUserList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked 
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.webUserList[i].gameClassId;
                obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='otherCRUD.delete(" + id + ",this)'  />";

                obj.webUserList[i].update = "<img onclick='otherCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

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
    otherCRUD.startUpdate = function (gameClassId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('html/insertUpdateOther.html', setUpdateOtherUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateOtherUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSaveOtherButton").style.display = "none";
            //document.getElementById("updateSaveOtherButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getOtherByIdAPI.jsp?gameClassUpdateId=" + gameClassId, displayOther, "recordError");

            function displayOther(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                if (obj.webUserList[0].errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.webUserList[0].errorMsg;
                } else if (obj.webUserList[0].gameClassId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no character with id '" +
                            gameClassId + "' in the database";
                } else {
                    var userObj = obj.webUserList;
                        document.getElementById("gameClassId").value = userObj[0].gameClassId;                    
                        document.getElementById("className").value = userObj[0].className;
                        document.getElementById("classDescription").value = userObj[0].classDescription;
                        document.getElementById("attack").value = userObj[0].attack;
                        document.getElementById("defense").value = userObj[0].defense;
                        document.getElementById("magic").value = userObj[0].magic;
                        document.getElementById("stealth").value = userObj[0].stealth;
                        document.getElementById("defense").speed = userObj[0].speed;
                        document.getElementById("crit").value = userObj[0].crit;

                }
            }
        } // setUpdateOtherUI
    };

    otherCRUD.updateSave = function () {

        console.log("otherCRUD.updateSave was called");
        var myData = getOtherDataFromUI();
        var url = "webAPIs/updateOtherAPI.jsp?jsonDataOtherUpdate=" + myData;
        ajax(url, processAssocUpdate, "recordError");

        function processAssocUpdate(httpRequest) {
            console.log("processAssocUpdate was called here is httpRequest.");
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

            writeOtherErrorObjToUI(jsonObj);

        }
    };

}());  

