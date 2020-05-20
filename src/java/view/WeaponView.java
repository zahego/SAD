package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.weapon.*;

// classes in my project
import dbUtils.*;

public class WeaponView {

    public static StringDataList4 allWeaponAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList4 sdl = new StringDataList4();
        try {
            String sql = "SELECT weapon_id, weapon_name, weapon_type, rarity, history, ability "+
                    "FROM weapon "+"ORDER BY weapon_id";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData4 sd = new StringData4();
            sd.errorMsg = "Exception thrown in Weaponview.allWeaponAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
    public static StringDataList4 someWeaponAPI(DbConn dbc, String pageNum) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList4 sdl = new StringDataList4();
        try {
            String sql = "SELECT weapon_id, weapon_name, weapon_type, rarity, history, ability "+
                    "FROM weapon "+"ORDER BY weapon_id "+"limit ?, 50";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            int newNum=Integer.parseInt(pageNum);
            stmt.setInt(1, newNum);

            ResultSet results = stmt.executeQuery();
            while (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData4 sd = new StringData4();
            sd.errorMsg = "Exception thrown in Weaponview.someWeaponAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
public static StringDataList4 getWeaponById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList4 sdl = new StringDataList4();
        try {
            String sql = "SELECT weapon_id, weapon_name, weapon_type, rarity, history, ability "+
                    "FROM weapon "
                    + "where weapon_id = ?";

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
            StringData4 sd = new StringData4();
            sd.errorMsg = "Exception thrown in WeaponView.getWeaponById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }

}