

function setAssocRegisterContent(httpRequest) {

    // Place the inserttUser html snippet into the content area.
    console.log("Ajax call was successful.");
    document.getElementById("content").innerHTML = httpRequest.responseText;

    ajaxCall("webAPIs/getPlayerEmailAPI.jsp", setPlayerEmailPickList, emailPickListError);
    ajaxCall("webAPIs/getClassNameAPI.jsp", setClassNamePickList, classNamePickListError);

}

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

function emailPickListError(httpRequest) {
    console.log("emailPickListError was called. here is httpRequest.");
    console.log(httpRequest);
    document.getElementById("playerIdEmailError").innerHTML = httpRequest.errorMsg;
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

function classNamePickListError(httpRequest) {
    console.log("classNamePickListError was called. here is httpRequest.");
    console.log(httpRequest);
    document.getElementById("gameClassIdNameError").innerHTML = httpRequest.errorMsg;
}


function insertAssoc() {
    console.log("insert class was called");
    
        var ddList = document.getElementById("emailPickList");
        var ddList = document.getElementById("classPickList");


    // create a user object from the values that the user has typed into the page.
    var userInputObj = {
        "characterId": "",
        //shouldn't use ddList.options[ddList.selectedIndex].value since it will take array value instead of column value
        //"playerId": ddList.options[ddList.selectedIndex].value,
        //"gameClassId": ddList.options[ddList.selectedIndex].value,
        "playerId": document.getElementById("emailPickList").value,
        "gameClassId": document.getElementById("classPickList").value,
        "characterName": document.getElementById("characterName").value,
        "characterCreatedDate": document.getElementById("characterCreatedDate").value,

        // Modification here for role pick list
        "errorMsg": ""
    };
    console.log(userInputObj);

    // build the url for the ajax call. Remember to escape the user input object or else 
    // you'll get a security error from the server. JSON.stringify converts the javaScript
    // object into JSON format (the reverse operation of what gson does on the server side).
    var myData = escape(JSON.stringify(userInputObj));
    var url = "webAPIs/insertAssocAPI.jsp?jsonDataAssoc=" + myData;
    ajaxCall(url, processAssocInsert, processAssocInsertHttpError);

    function processAssocInsert(httpRequest) {
        console.log("processInsert was called here is httpRequest.");
        console.log(httpRequest);

        // the server prints out a JSON string of an object that holds field level error 
        // messages. The error message object (conveniently) has its fiels named exactly 
        // the same as the input data was named. 
        var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("playerIdEmailError").innerHTML = jsonObj.playerId;
        document.getElementById("gameClassIdNameError").innerHTML = jsonObj.gameClassId;
        document.getElementById("characterNameError").innerHTML = jsonObj.characterName;
        document.getElementById("characterCreatedDateError").innerHTML = jsonObj.characterCreatedDate;
        if (jsonObj.errorMsg.length === 0) { // success
            jsonObj.errorMsg = "Record successfully inserted !!!";
        }
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    function processAssocInsertHttpError(httpRequest) {
        console.log("processInsertHttpError was called here is httpRequest.");
        console.log(httpRequest);
        document.getElementById("recordError").innerHTML = httpRequest.errorMsg;
    }
}


