<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page language="java" import="java.sql.*"%>
<%@page language="java" import="dbUtils.DbConn"%> 

<!DOCTYPE html>
<html>
    <head>
        <title>Metadata: Tablename Hard Coded</title>
        <style type="text/CSS">
            body {
                background-color:#DDDDDD;
                font-family: Verdana, Geneva, Sans-Serif; 
            }
            .resultSetFormat {    background-color:#AAAAAA;}
            .resultSetFormat th { background-color:powderblue; padding:5px;}
            .resultSetFormat td { background-color:aliceblue; padding:5px;}
        </style>
    </head>
    <body>
        <%

            DbConn dbc = new DbConn();
            String msg = dbc.getErr();
            if (msg.length() == 0) { // db connection is good

                try { // to create and execute sql
                    
                    //String sql = "SELECT * FROM information_schema.tables WHERE table_schema != 'information_schema'";
                    String sql = "SELECT * FROM information_schema.tables WHERE table_schema = ?";
                    PreparedStatement st = dbc.getConn().prepareStatement(sql);
                    st.setString(1, dbc.getDbName());
                    ResultSet results = st.executeQuery();
                    ResultSetMetaData rsMetaData = results.getMetaData();
                    int numColumns = rsMetaData.getColumnCount();

                    // create an HTML table that shows the most important metadata attributes
                    // of each column from the specified table.
                    msg += ("<table  class='resultSetFormat'><tr>");

                    // NOTE: iterates from 1 .. numberOfColumns.
                    for (int i = 1; i <= numColumns; i++) {
                        msg += "<th>" + rsMetaData.getColumnName(i).toLowerCase() + "</th>";
                    }

                    Object objColVal="";  
                    String strColVal;
                    while (results.next()) {
                        msg += "<tr>";
                        for (int i = 1; i <= numColumns; i++) {
                            objColVal = results.getObject(i);
                            if (objColVal == null) {
                                strColVal="null";
                            } else {
                                strColVal = objColVal.toString();
                            }
                            msg += ("<td>" + strColVal + "</td>");
                        }
                        msg += "</tr>";
                    }
                    msg += ("</table>");
                }// try to create and execute sql
                catch (Exception e) {
                    msg += ("problem creating statement or running query:" + e.getMessage() + "<br/>");

                }
            }
            dbc.close();
        %>
        <h2>List of Tables (Meta Data)</h2>

        <%=msg%> 

    </body>
</html>