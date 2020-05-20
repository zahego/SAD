function findOtherFn(id) {
    var target = document.getElementById("classInfoHere");

    ajaxCall("webAPIs/getOtherByIdAPI.jsp?id=" + id, displayUser, displayUserError);

    function displayUser(httpRequest) {
        var obj = JSON.parse(httpRequest.responseText);
        if (obj.webUserList.length === 0) {
            target.innerHTML = "There is no class with id '" + id + "' in the database";
        } else if (obj.webUserList[0].errorMsg.length > 0) {
            target.innerHTML = "Error extracting the Class from the database: "+obj.webUserList[0].errorMsg;
        } else {
            target.innerHTML = "<h4>Class Profile</h4>";
            target.innerHTML += "Class ID: " + obj.webUserList[0].gameClassId;
            target.innerHTML += "<br/>Class Name: " + obj.webUserList[0].className;
            target.innerHTML += "<br/>Description: " + obj.webUserList[0].classDescription;
            target.innerHTML += "<br/>Attack: " + obj.webUserList[0].attack;
            target.innerHTML += "<br/>Defense: " + obj.webUserList[0].defense;
            target.innerHTML += "<br/>Magic: "+ obj.webUserList[0].magic;
            target.innerHTML += "<br/>Stealth: " + obj.webUserList[0].stealth;
            target.innerHTML += "<br/>Speed: " + obj.webUserList[0].speed;
            target.innerHTML += "<br/>Crit: "+ obj.webUserList[0].crit;

        }
    }

    function displayUserError(httpRequest) {
        target.innerHTML = "Error trying to make the API call: " + httpRequest.errorMsg;
    }
}
