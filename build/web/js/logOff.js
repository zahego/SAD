function logoffFn () {
    
 var target = document.getElementById("msgId");
 var URL = "webAPIs/logOffAPI.jsp";
 ajaxCall (URL, processLogoff, processHttpError);
 


function processLogoff(httpRequest) { // this function defined inside of logonFn, local to logonFn

 target.innerHTML = httpRequest.responseText;
 }

 function processHttpError(httpRequest) { // this fn is also private/local to logonFn, good coding style
 target.innerHTML = "LogOff API call failed: " + httpRequest.errorMsg;
 }
}

