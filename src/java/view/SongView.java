/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.song.*;

// classes in my project
import dbUtils.*; 

public class SongView {
    public static StringDataList5 allSongAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList5 sdl = new StringDataList5();
        try {
            String sql = "SELECT song_id, song_title "+
                    "FROM song "+"ORDER BY song_id";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData5 sd = new StringData5();
            sd.errorMsg = "Exception thrown in SongView.allSongAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
    public static StringDataList5 someSongAPI(DbConn dbc, String pageNumSong) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList5 sdl = new StringDataList5();
        try {
            String sql = "SELECT song_id, song_title "+
                    "FROM song "+"ORDER BY song_id "+"limit ?, 50";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            int newNum=Integer.parseInt(pageNumSong);
            stmt.setInt(1, newNum);

            ResultSet results = stmt.executeQuery();
            while (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData5 sd = new StringData5();
            sd.errorMsg = "Exception thrown in Songview.someSongAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
public static StringDataList5 getSongById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList5 sdl = new StringDataList5();
        try {
            String sql = "SELECT song_id, song_title "+
                    "FROM song "
                    + "where song_id = ?";

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
            StringData5 sd = new StringData5();
            sd.errorMsg = "Exception thrown in SongView.getSongById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }


}
