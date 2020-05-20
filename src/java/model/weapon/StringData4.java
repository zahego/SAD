package model.weapon;

import model.webUser.*;
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
public class StringData4 {

    public String weaponId = "";
    public String weaponName = "";
    public String weaponType = "";
    public String rarity = "";
    public String history = "";
    public String ability = "";
    // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData4() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData4(ResultSet results) {
        try {
            this.weaponId = FormatUtils.formatInteger(results.getObject("weapon_id"));
            this.weaponName = FormatUtils.formatString(results.getObject("weapon_name"));
            this.weaponType = FormatUtils.formatString(results.getObject("weapon_type"));
            this.rarity = FormatUtils.formatString(results.getObject("rarity"));
            this.history = FormatUtils.formatString(results.getObject("history"));
            this.ability = FormatUtils.formatString(results.getObject("ability"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.webUser.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.weaponId + this.weaponName + this.rarity + this.history + this.ability;
        return s.length();
    }

    public String toString() {
        return "WeaponID: " + this.weaponId
                + ", weapon name: " + this.weaponName
                + ", weapon type: " + this.weaponType
                + ", rarity: " + this.rarity
                + ", history: " + this.history
                + ", ability: " + this.ability;
    }
}
