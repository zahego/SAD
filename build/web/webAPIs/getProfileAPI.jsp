<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 


<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
StringDataList listSession=(StringDataList)session.getAttribute("sessionlist");
if(listSession== null){
    listSession.dbError="you are not logged in, log in to show profile";}
    Gson gson = new Gson();
    out.print(gson.toJson(listSession).trim());

%>