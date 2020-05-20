package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.email.*;

// classes in my project
import dbUtils.*;

public class EmailView {

    public static StringDataList allEmailAPI(DbConn dbc) {

        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_id, player_email "+
                    "FROM mmo_player ORDER BY player_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in EmailView.allEmailAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}