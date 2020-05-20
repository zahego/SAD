// 3308_6_7_8_AjaxCRUD (building from insertDelete good code).

var weaponCRUD = {}; // globally available object

(function () {  // This is an IIFE, an immediately executing (anonymous) function
    //alert("I am an IIFE!");

    weaponCRUD.startInsert = function () {

        ajax('html/insertUpdateWeapon.html', setWeaponInsertUI, 'content');

        function setWeaponInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            //document.getElementById("insertSaveWeaponButton").style.display = "inline";
            document.getElementById("updateSaveWeaponButton").style.display = "none";
            document.getElementById("weaponIdRow").style.display = "none";


        }
    };

    function getWeaponDataFromUI() {

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
        "weaponId": document.getElementById("weaponId").value,
        "weaponName": document.getElementById("weaponName").value,
        "weaponType": document.getElementById("weaponType").value,
        "rarity": document.getElementById("rarity").value,
        "history": document.getElementById("history").value,
        "ability": document.getElementById("ability").value,

            "errorMsg": ""
        };

        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(userInputObj));
    }

    function writeWeaponErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("weaponNameError").innerHTML = jsonObj.weaponName;
        document.getElementById("weaponTypeError").innerHTML = jsonObj.weaponType;
        document.getElementById("rarityError").innerHTML = jsonObj.rarity;
        document.getElementById("historyError").innerHTML = jsonObj.history;
        document.getElementById("abilityError").innerHTML = jsonObj.ability;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;

    }

    weaponCRUD.insertSave = function () {

        console.log("weaponCRUD.insertSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getWeaponDataFromUI();
        var url = "webAPIs/insertWeaponAPI.jsp?jsonDataWeapon=" + myData;
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

            writeWeaponErrorObjToUI(jsonObj);
        }
    };


    weaponCRUD.delete = function (weaponId, icon) {
        if (confirm("Do you really want to delete character with " + weaponId + "? ")) {

            // Calling the DELETE API. 
            var url = "webAPIs/deleteWeaponAPI.jsp?deleteWeaponId=" + weaponId;
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
  

    weaponCRUD.list = function () {
        document.getElementById("content").innerHTML = "";
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2>New Weapon <img src='icons/insert.png' onclick='weaponCRUD.startInsert();'/></h2>";
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        document.getElementById("content").appendChild(dataList);

        ajax('webAPIs/listWeaponAPI.jsp?pageNum='+pageNum0, setListWeaponUI, 'listMsg');

        function setListWeaponUI(httpRequest) {

            console.log("starting weaponCRUD.list (setListWeaponUI) with this httpRequest object (next line)");
            console.log(httpRequest);

            var obj = JSON.parse(httpRequest.responseText);

            if (obj === null) {
                document.getElementById("listMsg").innerHTML = "weaponCRUD.list Error: JSON string evaluated to null.";
                return;
            }

            for (var i = 0; i < obj.webUserList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked 
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.webUserList[i].weaponId;
                obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='weaponCRUD.delete(" + id + ",this)'  />";

                obj.webUserList[i].update = "<img onclick='weaponCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

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
    weaponCRUD.startUpdate = function (weaponId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('html/insertUpdateWeapon.html', setUpdateWeaponUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateWeaponUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSaveWeaponButton").style.display = "none";
            //document.getElementById("updateSaveWeaponButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getWeaponByIdAPI.jsp?weaponUpdateId=" + weaponId, displayWeapon, "recordError");

            function displayWeapon(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                if (obj.webUserList[0].errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.webUserList[0].errorMsg;
                } else if (obj.webUserList[0].weaponId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no weapon with id '" +
                            weaponId + "' in the database";
                } else {
                    var userObj = obj.webUserList;
                        document.getElementById("weaponId").value = userObj[0].weaponId;                    
                        document.getElementById("weaponName").value = userObj[0].weaponName;
                        document.getElementById("weaponType").value = userObj[0].weaponType;
                        document.getElementById("rarity").value = userObj[0].rarity;
                        document.getElementById("history").value = userObj[0].history;
                        document.getElementById("ability").value = userObj[0].ability;

                }
            }
        } // setUpdateWeaponUI
    };

    weaponCRUD.updateSave = function () {

        console.log("weaponCRUD.updateSave was called");
        var myData = getWeaponDataFromUI();
        var url = "webAPIs/updateWeaponAPI.jsp?jsonDataWeaponUpdate=" + myData;
        ajax(url, processWeaponUpdate, "recordError");

        function processWeaponUpdate(httpRequest) {
            console.log("processWeaponUpdate was called here is httpRequest.");
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

            writeWeaponErrorObjToUI(jsonObj);

        }
    };

}());  

