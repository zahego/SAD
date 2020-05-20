package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.character.*;

// classes in my project
import dbUtils.*;

public class AssocView {

    public static StringDataList2 allUsersAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList2 sdl = new StringDataList2();
        try {
            String sql = "SELECT character_id, your_character.player_id, your_character.game_class_id, character_name, character_created_date, "+
                    "player_email, class_name "+
                    "FROM your_character, mmo_player, game_class where your_character.player_id= mmo_player.player_id AND your_character.game_class_id=game_class.game_class_id " +
                    "ORDER BY your_character.character_id";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData2 sd = new StringData2();
            sd.errorMsg = "Exception thrown in assocView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
    public static StringData2 getAssocById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringData2 sd = new StringData2();
        try {
            String sql ="SELECT character_id, your_character.player_id, your_character.game_class_id, character_name, character_created_date, "+
                    "player_email, class_name "+
                    "FROM your_character, mmo_player, game_class where your_character.player_id = mmo_player.player_id AND your_character.game_class_id = game_class.game_class_id "
                    + "AND character_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sd = new StringData2(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in WebUserView.getUserById(): " + e.getMessage();
        }
        return sd;
    }

}

