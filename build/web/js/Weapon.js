function WeaponPgFn(pageNum){
    
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2>New Weapon <img src='icons/insert.png' onclick='weaponCRUD.startInsert();'/></h2>";
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        document.getElementById("content").appendChild(dataList);
    
    var target=document.getElementById("weaponDisplay");
    
    

    
   // var pageNumber=document.getElementById(pageNum).innerHTML;
ajaxCall('webAPIs/listWeaponAPI.jsp?pageNum='+pageNum, setWeaponContent, setError);      
    
    
    
    function setWeaponContent(httpRequest) {
        
                
                console.log("listWeaponResponse - here is the value of httpRequest object (next line)");
                console.log(httpRequest);
               
                

                var obj = JSON.parse(httpRequest.responseText);

                if (obj === null) {
                    target.innerHTML = "listUsersResponse Error: JSON string evaluated to null.";
                    return;
                }
                target.innerHTML = "<br/>"; // clear out old content and add new line spacing
                 
                
                for (var i = 0; i < obj.webUserList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked 
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.webUserList[i].weaponId;
                obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='weaponCRUD.delete(" + id + ",this)'  />";

                obj.webUserList[i].update = "<img onclick='weaponCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

            }
                buildTable(obj.webUserList, obj.dbError, target);
            }
    function setError(httpRequest) {
                console.log("Ajax call was NOT successful.");
                console.log(httpRequest);
                document.getElementById("weaponDisplay").innerHTML = httpRequest.errorMsg;
            }
}


