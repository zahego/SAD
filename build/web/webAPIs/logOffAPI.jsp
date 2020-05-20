<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 


<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
StringDataList listSession=(StringDataList)session.getAttribute("sessionlist");
if(listSession == null){
    String done="You have not logged on to log off";
    Gson gson = new Gson();
    out.print(gson.toJson(done).trim());
}
else{
    session.invalidate();
    String done="You have sucessfully logged off";
     Gson gson = new Gson();
    out.print(gson.toJson(done).trim());
}
%>