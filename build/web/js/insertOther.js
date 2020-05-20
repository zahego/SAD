/* It is very useful to copy/paste the data obtained by running the insert API
 directly (like what i did below). This will let you know the exact field names
 that you used in your StringData (java object - because gson uses these when it 
 converts java object to JSON). Use these exact field names in your javascript code.
 
 {
 "webUserId": "",
 "userEmail": "Input is required",
 "userPassword": "Input is required",
 "userPassword2": "",
 "birthday": "",
 "membershipFee": "",
 "userRoleId": "Please enter an dollar amount",
 "userRoleType": "",
 "errorMsg": "Please try again"
 }
 */

function setOtherRegisterContent(httpRequest) {

    // Place the inserttUser html snippet into the content area.
    console.log("Ajax call was successful.");
    document.getElementById("content").innerHTML = httpRequest.responseText;

    // Make ajax call to listUsersAPI. When that data's ready (and all went well), invoke 
    // function listUsersResponse passing the httpReq (response) as well 
    // as the desired target for that response. Otherwise (error making the http 
    // request), invoke the listUsersError function.
    // These functions are in the listUser.js file...
}


function insertOther() {
    console.log("insert class was called");

    // create a user object from the values that the user has typed into the page.
    var userInputObj = {
        "gameClassId": "",
        "className": document.getElementById("className").value,
        "classDescription": document.getElementById("classDescription").value,
        "attack": document.getElementById("attack").value,
        "defense": document.getElementById("defense").value,
        "magic": document.getElementById("magic").value,
        "stealth": document.getElementById("stealth").value,
        "speed": document.getElementById("speed").value,
        "crit": document.getElementById("crit").value,

        // Modification here for role pick list
        "errorMsg": ""
    };
    console.log(userInputObj);

    // build the url for the ajax call. Remember to escape the user input object or else 
    // you'll get a security error from the server. JSON.stringify converts the javaScript
    // object into JSON format (the reverse operation of what gson does on the server side).
    var myData = escape(JSON.stringify(userInputObj));
    var url = "webAPIs/insertOtherAPI.jsp?jsonDataOther=" + myData;
    ajaxCall(url, processOtherInsert, processOtherInsertHttpError);

    function processOtherInsert(httpRequest) {
        console.log("processInsert was called here is httpRequest.");
        console.log(httpRequest);

        // the server prints out a JSON string of an object that holds field level error 
        // messages. The error message object (conveniently) has its fiels named exactly 
        // the same as the input data was named. 
        var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("classNameError").innerHTML = jsonObj.className;
        document.getElementById("classDescriptionError").innerHTML = jsonObj.classDescription;
        document.getElementById("attackError").innerHTML = jsonObj.attack;
        document.getElementById("defenseError").innerHTML = jsonObj.defense;
        document.getElementById("magicError").innerHTML = jsonObj.magic;
        document.getElementById("stealthError").innerHTML = jsonObj.stealth;
        document.getElementById("speedError").innerHTML = jsonObj.speed;
        document.getElementById("critError").innerHTML = jsonObj.crit;;

        if (jsonObj.errorMsg.length === 0) { // success
            jsonObj.errorMsg = "Record successfully inserted !!!";
        }
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    function processOtherInsertHttpError(httpRequest) {
        console.log("processInsertHttpError was called here is httpRequest.");
        console.log(httpRequest);
        document.getElementById("recordError").innerHTML = httpRequest.errorMsg;
    }
}


