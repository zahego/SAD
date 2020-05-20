<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.weapon.*" %> 
<%@page language="java" import="view.WeaponView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    StringDataList4 list = new StringDataList4();
    
    String searchId = request.getParameter("weaponUpdateId");
    if (searchId == null) {
        list.dbError = "Cannot search for class - 'id' most be supplied";
    } else {

        DbConn dbc = new DbConn();
        list.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (list.dbError.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call getWeaponById");
            list = WeaponView.getWeaponById(dbc, searchId);
        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
%>