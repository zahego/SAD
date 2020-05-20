<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.DbConn" %>
<%@page language="java" import="model.weapon.*" %>

<%@page language="java" import="com.google.gson.*" %>



<%

    Gson gson = new Gson();

    DbConn dbc = new DbConn();
    StringData4 errorMsgs = new StringData4();

    String jsonInsertData = request.getParameter("jsonDataWeapon");
    if (jsonInsertData == null) {
        errorMsgs.errorMsg = "Cannot insert -- no data was received";
        System.out.println(errorMsgs.errorMsg);
    } else {
        System.out.println("jsonInsertDataWeapon is " + jsonInsertData);
        errorMsgs.errorMsg = dbc.getErr();
        if (errorMsgs.errorMsg.length() == 0) { // means db connection is ok
            System.out.println("insertWeaponAPI.jsp ready to insert");
            
            // Must use gson to convert JSON (that the user provided as part of the url, the jsonInsertData. 
            // Convert from JSON (JS object notation) to POJO (plain old java object).
            StringData4 insertData = gson.fromJson(jsonInsertData, StringData4.class);
            
            // this method takes the user's input data as input and outputs an error message object (with same field names).
            errorMsgs = DbMods4.insert(insertData, dbc); // this is the form level message
        }
    }

    out.print(gson.toJson(errorMsgs).trim());
    dbc.close();
%>

