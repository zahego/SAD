function findUserFn(id) {
    var target = document.getElementById("userInfoHere");

    ajaxCall("webAPIs/getUserByIdAPI.jsp?updateId=" + id, displayUser, displayUserError);

    function displayUser(httpRequest) {
        var obj = JSON.parse(httpRequest.responseText);
        if (obj.webUserList.length === 0) {
            target.innerHTML = "There is no user with id '" + id + "' in the database";
        } else if (obj.webUserList[0].errorMsg.length > 0) {
            target.innerHTML = "Error extracting the Web User from the database: "+obj.webUserList[0].errorMsg;
        } else {
            target.innerHTML = "<h4>Player Profile</h4>";
            target.innerHTML += "Player Id: " + obj.webUserList[0].playerId;
            target.innerHTML += "<br/>Email: " + obj.webUserList[0].playerEmail;
            target.innerHTML += "<br/>Age: " + obj.webUserList[0].age;
            target.innerHTML += "<br/>REgistration date: " + obj.webUserList[0].registrationDate;
            target.innerHTML += "<br/>Role Id: " + obj.webUserList[0].playerRoleId;
            target.innerHTML += "<br/>Role Name: "+ obj.webUserList[0].roleName;
            
           
        }
    }

    function displayUserError(httpRequest) {
        target.innerHTML = "Error trying to make the API call: " + httpRequest.errorMsg;
    }
}
