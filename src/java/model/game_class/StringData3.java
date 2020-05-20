
package model.game_class;


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
public class StringData3 {

    public String gameClassId = "";
    public String className = "";
    public String classDescription = "";
    public String attack = "";
    public String defense = "";
    public String magic = "";   // Foreign Key
    public String stealth = ""; 
    public String speed = "";
    public String crit = "";// getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData3() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData3(ResultSet results) {
        try {
            this.gameClassId = FormatUtils.formatInteger(results.getObject("game_class_id"));
            this.className = FormatUtils.formatString(results.getObject("class_name"));
            this.classDescription = FormatUtils.formatString(results.getObject("class_description"));
            this.attack = FormatUtils.formatInteger(results.getObject("attack"));
            this.defense = FormatUtils.formatInteger(results.getObject("defense"));
            this.magic = FormatUtils.formatInteger(results.getObject("magic"));
            this.stealth = FormatUtils.formatInteger(results.getObject("stealth"));
            this.speed = FormatUtils.formatInteger(results.getObject("speed"));
            this.crit = FormatUtils.formatInteger(results.getObject("crit"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.otherView.StringData3 (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.gameClassId + this.className + this.classDescription + this.attack
                + this.defense + this.magic + this.stealth + this.speed + this.crit;
        return s.length();
    }

    public String toString() {
        return "class ID: " + this.gameClassId
                + ", class name: " + this.className
                + ", description: " + this.classDescription
                + ", ATK: " + this.attack
                + ", DEF: " + this.defense
                + ", MAG: " + this.magic
                + ", HID: " + this.stealth
                + ", SPD: " + this.speed
                + ", CRT: " + this.crit;
    }
}
