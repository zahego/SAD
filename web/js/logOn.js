function logonFn (emailId, pwId/*, msgId*/) {
    
 var target = document.getElementById("msgId");
 var emailUserInput = escape(document.getElementById(emailId).value);
 var pwUserInput = escape(document.getElementById(pwId).value); // escape cleans user input
 var URL = "webAPIs/logOnAPI.jsp?email=" + emailUserInput + "&password=" + pwUserInput;
 ajaxCall (URL, processLogon, processHttpError);
 


function processLogon(httpRequest) { // this function defined inside of logonFn, local to logonFn
 console.log("this is object "+httpRequest.responseText);
 var obj = JSON.parse(httpRequest.responseText);

 target.innerHTML = "<br/>";
 if (obj.webUserList.length === 0) {
     if(emailUserInput===null||pwUserInput===null){
         target.innerHTML = "Missing email or password imput";}
     else{
 target.innerHTML = "There is no user with email '" + emailUserInput + "' and that password in the database or you have left an input field blank ";}
} else if (obj.webUserList[0].errorMsg.length > 0) {
 target.innerHTML += "Connection was success, however, the Logon API supplied this error message: " + +obj.webUserList[0].errorMsg;
 } else {
 target.innerHTML += "<br/>Welcome Web User number " + obj.webUserList[0].playerId + ", here's your detail: ";
 target.innerHTML += "<br/>"; // clear out old content and add new line spacing
                buildTable(obj.webUserList, obj.dbError, target);
 }
 }

 function processHttpError(httpRequest) { // this fn is also private/local to logonFn, good coding style
 target.innerHTML = "LogOn API call failed: " + httpRequest.errorMsg;
 }
}



