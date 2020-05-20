package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.game_class.*;

// classes in my project
import dbUtils.*;

public class OtherView {

    public static StringDataList3 allUsersAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList3 sdl = new StringDataList3();
        try {
            String sql = "SELECT game_class_id, class_name, class_description, attack, defense, "+
                    "magic, stealth, speed, crit "+
                    "FROM game_class "+"ORDER BY game_class_id";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData3 sd = new StringData3();
            sd.errorMsg = "Exception thrown in OtherView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
public static StringDataList3 getOtherById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList3 sdl = new StringDataList3();
        try {
            String sql = "SELECT game_class_id, class_name, class_description, attack, defense, "+
                    "magic, stealth, speed, crit "+
                    "FROM game_class "
                    + "where game_class_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData3 sd = new StringData3();
            sd.errorMsg = "Exception thrown in OtherView.getOtherById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }

}