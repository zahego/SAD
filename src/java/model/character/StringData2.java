/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model.character;


import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * character data that the user might type in when they want to 
 * add a new Customer or edit an existing customer.  This String
 * data is "pre-validated" data, meaning they might have typed 
 * in a character string where a number was expected.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData2 {

    public String characterId = "";
    public String playerId = "";
    public String gameClassId = "";
    public String characterName = "";
    public String characterCreatedDate = "";
    public String playerEmail = "";
    public String className = "";
    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData2() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData2(ResultSet results) {
        try {
            this.characterId = FormatUtils.formatInteger(results.getObject("character_id"));
            this.playerId = FormatUtils.formatInteger(results.getObject("player_id"));
            this.gameClassId = FormatUtils.formatInteger(results.getObject("game_class_id"));
            this.characterName = FormatUtils.formatString(results.getObject("character_name"));
            this.characterCreatedDate = FormatUtils.formatDate(results.getObject("character_created_date"));
            this.playerEmail = FormatUtils.formatString(results.getObject("player_email"));
            this.className = FormatUtils.formatString(results.getObject("class_name"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.webUser.StringData2 (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.characterId + this.playerId + this.gameClassId + this.characterName
                + this.characterCreatedDate + this.playerEmail + this.className;;
        return s.length();
    }

    public String toString() {
        return "Character  ID: " + this.characterId
                + ", Player ID: " + this.playerId
                + ", Class ID: " + this.gameClassId
                + ", Character Name: " + this.characterName
                + ", Character created on: " + this.characterCreatedDate
                + ", Email: " + this.playerEmail
                + ", class name: " + this.className;
    }
}
