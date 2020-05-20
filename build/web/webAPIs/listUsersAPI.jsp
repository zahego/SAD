<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    StringDataList list = new StringDataList();

    DbConn dbc = new DbConn();
    list.dbError = dbc.getErr();
    
  /*   StringDataList listSession=(StringDataList)session.getAttribute("sessionlist");
    if(listSession==null){
        list.dbError ="You have not logged on to show data. Only admin role can see the data. Ex: log in with email: 'hoho@ho.ho' and password 'psw'";
    dbc.close();
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
    
    
}
    else if((!(listSession.webUserList.get(0).playerRoleId).equals("1"))){
        list.dbError ="Data can only be shown to admin";
    dbc.close();
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
    }
    else{*/
     // returns "" if connection is good, else db error msg.

    if (list.dbError.length() == 0) { // if got good DB connection,

        System.out.println("*** Ready to call allUsersAPI");
        list = WebUserView.allUsersAPI(dbc);
    }

      dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
    //}
%>