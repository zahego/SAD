<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    StringDataList list = new StringDataList();
    
    //parameter is in the URL in logOn.jsp
    String email =request.getParameter("email");
    String pswd = request.getParameter("password");
    if (email == null && pswd == null) {
        list.dbError = "Please input email and password";
    }
    if (email == null || pswd == null) {
        list.dbError = "Email or password missing, enter either to operate";
    } 
    else {

        DbConn dbc = new DbConn();
        list.dbError = dbc.getErr(); 

        
         if (list.dbError.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call allUsersAPI");
            list =WebUserView.Search(dbc, email, pswd);
            session.setAttribute("sessionlist", list);
         }
            
      

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
%>