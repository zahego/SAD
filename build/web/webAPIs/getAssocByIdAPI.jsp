<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.character.*" %> 
<%@page language="java" import="view.AssocView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    //StringDataList2 list = new StringDataList2();
    CharacterWithPlayerEmailAndClassNameList assocurl = new CharacterWithPlayerEmailAndClassNameList();
    assocurl.yourCharacter = new StringData2();
    assocurl.playerEmail = new model.email.StringDataList();
    assocurl.className = new model.className.StringDataList();

    
    
    String searchId = request.getParameter("characterUpdateId");
    if (searchId == null) {
        assocurl.yourCharacter.errorMsg = "Cannot search for character - 'id' most be supplied";
    } else {

        DbConn dbc = new DbConn();
        assocurl.yourCharacter.errorMsg = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (assocurl.yourCharacter.errorMsg.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call allUsersAPI");
            assocurl.yourCharacter = AssocView.getAssocById(dbc, searchId);
            assocurl.playerEmail = view.EmailView.allEmailAPI(dbc);
            assocurl.className = view.ClassNameView.allClassNameAPI(dbc);


        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(assocurl).trim());
%>