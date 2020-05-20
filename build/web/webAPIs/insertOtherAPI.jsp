<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.DbConn" %>
<%@page language="java" import="model.game_class.*" %>

<%@page language="java" import="com.google.gson.*" %>



<%

    // This is the object we get from the GSON library.
    // This object knows how to convert betweeb these two formats: 
    //    POJO (plain old java object) 
    //    JSON (JavaScript Object notation)
    Gson gson = new Gson();

    DbConn dbc = new DbConn();
    StringData3 errorMsgs = new StringData3();

    String jsonInsertData = request.getParameter("jsonDataOther");
    if (jsonInsertData == null) {
        errorMsgs.errorMsg = "Cannot insert -- no data was received";
        System.out.println(errorMsgs.errorMsg);
    } else {
        System.out.println("jsonInsertDataOther is " + jsonInsertData);
        errorMsgs.errorMsg = dbc.getErr();
        if (errorMsgs.errorMsg.length() == 0) { // means db connection is ok
            System.out.println("otherInsert.jsp ready to insert");
            
            // Must use gson to convert JSON (that the user provided as part of the url, the jsonInsertData. 
            // Convert from JSON (JS object notation) to POJO (plain old java object).
            StringData3 insertData = gson.fromJson(jsonInsertData, StringData3.class);
            
            // this method takes the user's input data as input and outputs an error message object (with same field names).
            errorMsgs = DbMods3.insert(insertData, dbc); // this is the form level message
        }
    }

    out.print(gson.toJson(errorMsgs).trim());
    dbc.close();
%>

