// 3308_6_7_8_AjaxCRUD (building from insertDelete good code).

var assocCRUD = {}; // globally available object

(function () {  // This is an IIFE, an immediately executing (anonymous) function
    //alert("I am an IIFE!");

    assocCRUD.startInsert = function () {

        ajax('html/insertUpdateAssoc.html', setAssocInsertUI, 'content');

        function setAssocInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            //document.getElementById("insertSaveUserButton").style.display = "inline";
            document.getElementById("updateSaveAssocButton").style.display = "none";
            document.getElementById("characterIdRow").style.display = "none";

            ajax("webAPIs/getPlayerEmailAPI.jsp", setPlayerEmailPickList, "playerIdEmailError");
            ajax("webAPIs/getClassNameAPI.jsp", setClassNamePickList, "gameClassIdNameError");

            function setPlayerEmailPickList(httpRequest) {

                console.log("setPlayerEmailPickList was called, see next line for object holding list of roles");
                var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
                console.log(jsonObj);

                if (jsonObj.dbError.length > 0) {
                    document.getElementById("playerIdEmailError").innerHTML = jsonObj.dbError;
                    return;
                }

                makePickList(jsonObj.emailList, "playerId", "playerEmail", "emailPickList");
            }
            function setClassNamePickList(httpRequest) {

                console.log("setClassNamePickList was called, see next line for object holding list of roles");
                var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
                console.log(jsonObj);

                if (jsonObj.dbError.length > 0) {
                    document.getElementById("gameClassIdNameError").innerHTML = jsonObj.dbError;
                    return;
                }

                makePickList(jsonObj.classNameList, "gameClassId", "className", "classPickList");
            }
        }
    };

    function getAssocDataFromUI() {

        var ddList = document.getElementById("emailPickList");
        var ddList = document.getElementById("classPickList");

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
        "characterId": document.getElementById("characterId").value,
        //"playerId": ddList.options[ddList.selectedIndex].value,
        //"gameClassId": ddList.options[ddList.selectedIndex].value,
        "playerId": document.getElementById("emailPickList").value,
        "gameClassId": document.getElementById("classPickList").value,
        "characterName": document.getElementById("characterName").value,
        "characterCreatedDate": document.getElementById("characterCreatedDate").value,
        
        


            "errorMsg": ""
        };

        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(userInputObj));
    }

    function writeAssocErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("playerIdEmailError").innerHTML = jsonObj.playerId;
        document.getElementById("gameClassIdNameError").innerHTML = jsonObj.gameClassId;
        document.getElementById("characterNameError").innerHTML = jsonObj.characterName;
        document.getElementById("characterCreatedDateError").innerHTML = jsonObj.characterCreatedDate;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;

    }

    assocCRUD.insertSave = function () {

        console.log("assocCRUD.insertSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getAssocDataFromUI();
        var url = "webAPIs/insertAssocAPI.jsp?jsonDataAssoc=" + myData;
        ajax(url, processAssocInsert, "recordError");

        function processAssocInsert(httpRequest) {
            console.log("processAssocInsert was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }

            writeAssocErrorObjToUI(jsonObj);
        }
    };


    assocCRUD.delete = function (characterId, icon) {
        if (confirm("Do you really want to delete character with " + characterId + "? ")) {

            // Calling the DELETE API. 
            var url = "webAPIs/deleteAssocAPI.jsp?deleteAssocId=" + characterId;
            ajax(url, success, "listMsg");

            function success(http) { // API was successfully called (doesnt mean delete worked)
                var obj = JSON.parse(http.responseText);
                if (obj.errorMsg.length > 0) {
                    document.getElementById("listMsg").innerHTML = obj.errorMsg;
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

    assocCRUD.list = function () {

        document.getElementById("content").innerHTML = "";
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2 style='color:white'><b>New Character <b><img style='position:relative; margin-bottom: 2%' src='icons/insert.png' onclick='userCRUD.startInsert();'/></h2>";;
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        document.getElementById("content").appendChild(dataList);

        ajax('webAPIs/listAssocAPI.jsp', setListAssocUI, 'listMsg');

        function setListAssocUI(httpRequest) {

            console.log("starting assocCRUD.list (setListAssocUI) with this httpRequest object (next line)");
            console.log(httpRequest);

            var obj = JSON.parse(httpRequest.responseText);

            if (obj === null) {
                document.getElementById("listMsg").innerHTML = "assocCRUD.list Error: JSON string evaluated to null.";
                return;
            }

            for (var i = 0; i < obj.webUserList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked 
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.webUserList[i].characterId;
                obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='assocCRUD.delete(" + id + ",this)'  />";

                obj.webUserList[i].update = "<img onclick='assocCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

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
    assocCRUD.startUpdate = function (characterId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('html/insertUpdateAssoc.html', setUpdateAssocUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateAssocUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSaveAssocButton").style.display = "none";
            //document.getElementById("updateSaveAssocButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getAssocByIdAPI.jsp?characterUpdateId=" + characterId, displayAssoc, "recordError");

            function displayAssoc(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                if (obj.yourCharacter.errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.yourCharacter.errorMsg;
                } else if (obj.yourCharacter.characterId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no character with id '" +
                            characterId + "' in the database";
                } else if (obj.playerEmail.dbError.length > 0) {
                    document.getElementById("recordError").innerHTML += "<br/>Error extracting the player Email List options from the database: " +
                            obj.playerEmail.dbError;
                }else if (obj.className.dbError.length > 0) {
                    document.getElementById("recordError").innerHTML += "<br/>Error extracting the class Name List options from the database: " +
                            obj.className.dbError;
                }else {
                    var userObj = obj.yourCharacter;
                        document.getElementById("characterId").value = userObj.characterId;  
                        makePickList(obj.playerEmail.emailList, // list of key/value objects for role pick list
                            "playerId", // key property name
                            "playerEmail", // value property name
                            "emailPickList", // id of dom element where to put role pick list
                            userObj.playerId); // key to be selected (role id fk in web_user object)
                        makePickList(obj.className.classNameList, // list of key/value objects for role pick list
                            "gameClassId", // key property name
                            "className", // value property name
                            "classPickList", // id of dom element where to put role pick list
                            userObj.gameClassId); // key to be selected (role id fk in web_user object)
                        //document.getElementById("playerId").value = userObj[0].playerId;
                        //document.getElementById("gameClassId").value = userObj[0].gameClassId;
                        document.getElementById("characterName").value = userObj.characterName;
                        document.getElementById("characterCreatedDate").value = userObj.characterCreatedDate;

                }
            }
        } // setUpdateAssocUI
    };

    assocCRUD.updateSave = function () {

        console.log("assocCRUD.updateSave was called");
        var myData = getAssocDataFromUI();
        var url = "webAPIs/updateAssocAPI.jsp?jsonDataAssocUpdate=" + myData;
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

            writeAssocErrorObjToUI(jsonObj);

        }
    };

}());  

