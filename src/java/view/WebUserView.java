package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.webUser.*;

// classes in my project
import dbUtils.*;

public class WebUserView {

    public static StringDataList allUsersAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_id, player_email, player_pswd, player_age, player_registration_date, "+
                    "player_total_transaction, mmo_player.player_role_id, role_name "+
                    "FROM mmo_player, user_role where mmo_player.player_role_id= user_role.player_role_id "+
                    "ORDER BY player_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
    public static StringDataList getUserById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_id, player_email, player_pswd, player_age, player_registration_date, "+
                    "player_total_transaction, mmo_player.player_role_id, role_name "+
                    "FROM mmo_player, user_role where mmo_player.player_role_id= user_role.player_role_id "
                    + "AND player_id = ?";

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
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.getUserById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
     public static StringDataList getUserByEmail(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_id, player_email, player_pswd, player_age, player_registration_date, "+
                    "player_total_transaction, mmo_player.player_role_id, role_name "+
                    "FROM mmo_player, user_role where mmo_player.player_role_id= user_role.player_role_id "
                    + "AND player_email = ?";

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
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.getUserByEmail(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
     public static StringDataList getUserByPswd(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_id, player_email, player_pswd, player_age, player_registration_date, "+
                    "player_total_transaction, mmo_player.player_role_id, role_name "+
                    "FROM mmo_player, user_role where mmo_player.player_role_id= user_role.player_role_id "
                    + "AND player_pswd = ?";

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
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.getUserByPswd(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
     public static StringDataList Search(DbConn dbc, String email, String password) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_id, player_email, player_pswd, player_age, player_registration_date, "+
                    "player_total_transaction, mmo_player.player_role_id, role_name "+
                    "FROM mmo_player, user_role where mmo_player.player_role_id= user_role.player_role_id "
                    + "AND player_email = ? AND player_pswd = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password);


            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.Search(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }

}