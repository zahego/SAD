<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.DbConn" %>
<%@page language="java" import="model.game_class.*" %>
<%@page language="java" import="com.google.gson.*" %>

<%

    // This is the object we get from the GSON library.
    // This object knows how to convert between: 
    //    POJO (plain old java object) <-> JSON (JavaScript Object notation - a String)
    Gson gson = new Gson();

    DbConn dbc = new DbConn();
    StringData3 errorMsgs = new StringData3();

    String jsonUpdateData = request.getParameter("jsonDataOtherUpdate");
    if (jsonUpdateData == null) {
        errorMsgs.errorMsg = "Cannot update -- need 'jsonDataOtherUpdate' as URL parameter";
        System.out.println(errorMsgs.errorMsg);
    } else {
        System.out.println("jsonDataOtherUpdate is " + jsonUpdateData);
        errorMsgs.errorMsg = dbc.getErr();
        if (errorMsgs.errorMsg.length() == 0) { // means db connection is ok
            System.out.println("updateOtherAPI.jsp - ready to update");
            
            // Must use gson to convert JSON (that the user provided as part of the url, the jsonUpdateData. 
            // Convert from JSON (JS object notation) to POJO (plain old java object).
            StringData3 updateData = gson.fromJson(jsonUpdateData, StringData3.class);
            
            // this method takes the user's input data as input and outputs an error message object (with same field names).
            errorMsgs = DbMods3.update(updateData, dbc); // this is the form level message
        }
    }

    out.print(gson.toJson(errorMsgs).trim());
    dbc.close();
%>

