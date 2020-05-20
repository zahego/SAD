function setAssocDeleteContent(httpRequest) {

                        console.log("listOtherResponse - here is the value of httpRequest object (next line)");
                        console.log(httpRequest);

                        var dataList = document.createElement("div");
                        dataList.id = "dataList"; // this is for styling the HTML table.
                        document.getElementById("content").innerHTML = "";
                        document.getElementById("content").appendChild(dataList);

                        var obj = JSON.parse(httpRequest.responseText);

                        if (obj === null) {
                            dataList.innerHTML = "listUOtherResponse Error: JSON string evaluated to null.";
                            return;
                        }

                        for (var i = 0; i < obj.webUserList.length; i++) {

                            // add a property to each object in webUserList - a span tag that when clicked 
                            // invokes a JS function call that passes in the web user id that should be deleted
                            // from the database and a reference to itself (the span tag that was clicked)
                            var id = obj.webUserList[i].characterId;
                            obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='callAssocDeleteAPI(" + id + ",this)'  />";
                             
                        }

                        // buildTable Parameters: 
                        // First:  array of objects that are to be built into an HTML table.
                        // Second: string that is database error (if any) or empty string if all OK.
                        // Third:  reference to DOM object where built table is to be stored. 
                        buildTable(obj.webUserList, obj.dbError, dataList);

            }
            
                    function callAssocDeleteAPI(id, icon) {
                        if (confirm("Do you really want to delete game class number " + id + "? ")) {
                            console.log("icon that was passed into JS function is printed on next line");
                            console.log(icon);
                     ajaxCall("webAPIs/deleteAssocAPI.jsp?deleteAssocId=" + id, AssocAPISuccess, AssocAPIError);

                    function AssocAPISuccess(httpReq) { // function is local to callDeleteAPI
                        var obj = JSON.parse(httpReq.responseText);
                        alert("Web API success. Message is [" + obj.errorMsg + "] -- empty string means success.");
                    }

                    function AssocAPIError(httpReq) { // function is local to callDeleteAPI
                        alert("Web API failure. Message is [" + httpReq.errorMsg + "]");
                    }
                             }
                            var dataRow = icon.parentNode.parentNode;
                            var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
                            var dataTable = dataRow.parentNode;
                            dataTable.deleteRow(rowIndex);
                        

                    }