<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.song.*" %> 
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="view.SongView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    StringDataList5 list = new StringDataList5();
    DbConn dbc = new DbConn();
    list.dbError = dbc.getErr();
      StringDataList listSession=(StringDataList)session.getAttribute("sessionlist");
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
    else{
     // returns "" if connection is good, else db error msg.

     
     
    String searchPageNum = request.getParameter("pageNumSong");
    if (searchPageNum == null) {
        list.dbError = "Cannot search for page - 'page number' most be supplied";
    }
    else{
    if (list.dbError.length() == 0) { // if got good DB connection,

        System.out.println("*** Ready to call allUsersAPI");
        list = SongView.someSongAPI(dbc, searchPageNum);
    }
    /*if(list!=null){
        smallerlist=
    }*/
    

      dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
    }
%>