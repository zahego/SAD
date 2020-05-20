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

            String tableName = "mmo_player";
            
            DbConn dbc = new DbConn();
            String msg = dbc.getErr();
            if (msg.length() == 0) { // db connection is good

                try { // to create and execute sql

                    // select all columns from tableName (but no rows) because
                    // we are not interested in the data, just the metadata.
                    String sql = "SELECT * FROM " + tableName + " WHERE 0=1";
                    PreparedStatement st = dbc.getConn().prepareStatement(sql);
                    ResultSet results = st.executeQuery();
                    ResultSetMetaData rsMetaData = results.getMetaData();
                    int numberOfColumns = rsMetaData.getColumnCount();

                    // create an HTML table that shows the most important metadata attributes
                    // of each column from the specified table.
                    msg += ("<table  class='resultSetFormat'><tr><th>column name</th><th>type</th>"
                            + "<th>display size</th><th>precision</th><th>scale</th><th>autoIncrement</th></tr>");

                    for (int i = 1; i <= numberOfColumns; i++) {
                        msg += ("<tr><td>" + rsMetaData.getColumnName(i) + "</td>");
                        msg += ("<td>" + rsMetaData.getColumnTypeName(i) + "</td>");
                        msg += ("<td>" + rsMetaData.getColumnDisplaySize(i) + "</td>");
                        msg += ("<td>" + rsMetaData.getPrecision(i) + "</td>");
                        msg += ("<td>" + rsMetaData.getScale(i) + "</td>");
                        msg += ("<td>" + rsMetaData.isAutoIncrement(i) + "</td></tr>");
                    }
                    msg += ("</table>");
                } // try to create and execute sql
                catch (Exception e) {
                    msg += ("problem creating statement or running query:" + e.getMessage() + "<br/>");

                }
            }
            dbc.close();
        %>
        <h2>Meta Data for Table: <%=tableName%></h2>

        <%=msg%>

    </body>
</html>