function SongPgFn(pageNumSong){
    var target=document.getElementById("songDisplay");
    
   // var pageNumber=document.getElementById(pageNum).innerHTML;
ajaxCall('webAPIs/listSongAPI.jsp?pageNumSong='+pageNumSong, setSongContent, setError);      
    
    
    
    function setSongContent(httpRequest) {
                
                console.log("listSongResponse - here is the value of httpRequest object (next line)");
                console.log(httpRequest);

                var obj = JSON.parse(httpRequest.responseText);

                if (obj === null) {
                    target.innerHTML = "listSongResponse Error: JSON string evaluated to null.";
                    return;
                }
                target.innerHTML = "<br/>"; // clear out old content and add new line spacing
                buildTable(obj.webUserList, obj.dbError, target);
            }
    function setError(httpRequest) {
                console.log("Ajax call was NOT successful.");
                console.log(httpRequest);
                document.getElementById("songDisplay").innerHTML = httpRequest.errorMsg;
            }
}


