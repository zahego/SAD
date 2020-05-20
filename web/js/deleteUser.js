function setDeleteContent(httpRequest) {

                        console.log("listUsersResponse - here is the value of httpRequest object (next line)");
                        console.log(httpRequest);

                        var dataList = document.createElement("div");
                        dataList.id = "dataList"; // this is for styling the HTML table.
                        document.getElementById("content").innerHTML = "";
                        document.getElementById("content").appendChild(dataList);

                        var obj = JSON.parse(httpRequest.responseText);

                        if (obj === null) {
                            dataList.innerHTML = "listUsersResponse Error: JSON string evaluated to null.";
                            return;
                        }

                        for (var i = 0; i < obj.webUserList.length; i++) {

                            // add a property to each object in webUserList - a span tag that when clicked 
                            // invokes a JS function call that passes in the web user id that should be deleted
                            // from the database and a reference to itself (the span tag that was clicked)
                            var id = obj.webUserList[i].playerId;
                            obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='callDeleteAPI(" + id + ",this)'  />";
                            obj.webUserList[i].update = "<img src='icons/update.png'  onclick='updatetUser(" + id + ")'  />";
                             
                            // remove a property from each object in webUserList 
                            delete obj.webUserList[i].userPassword2;
                        }

                        // buildTable Parameters: 
                        // First:  array of objects that are to be built into an HTML table.
                        // Second: string that is database error (if any) or empty string if all OK.
                        // Third:  reference to DOM object where built table is to be stored. 
                        buildTable(obj.webUserList, obj.dbError, dataList);

            }
            
                    function callDeleteAPI(id, icon) {
                        if (confirm("Do you really want to delete user " + id + "? ")) {
                            console.log("icon that was passed into JS function is printed on next line");
                            console.log(icon);
                     ajaxCall("webAPIs/deleteUserAPI.jsp?deleteId=" + id, APISuccess, APIError);

                    function APISuccess(httpReq) { // function is local to callDeleteAPI
                        var obj = JSON.parse(httpReq.responseText);
                        alert("Web API success. Message is [" + obj.errorMsg + "] -- empty string means success.");
                    }

                    function APIError(httpReq) { // function is local to callDeleteAPI
                        alert("Web API failure. Message is [" + httpReq.errorMsg + "]");
                    }
                             }
                            var dataRow = icon.parentNode.parentNode;
                            var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
                            var dataTable = dataRow.parentNode;
                            dataTable.deleteRow(rowIndex);
                        

                    }