package model.webUser;

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
public class StringData {

    public String playerId = "";
    public String playerEmail = "";
    public String playerPassword = "";
    public String playerPassword2 = "";
    public String age = "";
    public String registrationDate = "";
    public String totalTransaction = "";   // Foreign Key
    public String playerRoleId = "";
    public String roleName = "";
    // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.playerId = FormatUtils.formatInteger(results.getObject("player_id"));
            this.playerEmail = FormatUtils.formatString(results.getObject("player_email"));
            this.playerPassword = FormatUtils.formatString(results.getObject("player_pswd"));
            this.age = FormatUtils.formatInteger(results.getObject("player_age"));
            this.registrationDate = FormatUtils.formatDate(results.getObject("player_registration_date"));
            this.totalTransaction = FormatUtils.formatDollar(results.getObject("player_total_transaction"));
            this.playerRoleId = FormatUtils.formatInteger(results.getObject("player_role_id"));
            this.roleName = FormatUtils.formatString(results.getObject("role_name"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.webUser.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.playerId + this.playerEmail + this.playerPassword + this.playerPassword2 + this.age
                + this.registrationDate + this.totalTransaction + this.playerRoleId+this.roleName;
        return s.length();
    }

    public String toString() {
        return "PlayerID: " + this.playerId
                + ", Email: " + this.playerEmail
                + ", Password: " + this.playerPassword
                + ", Password2: " + this.playerPassword2
                + ", Age: " + this.age
                + ", Registration on: " + this.registrationDate
                + ", Transaction: " + this.totalTransaction
                + ", User Role ID: " + this.playerRoleId
                + ", Role Name: " + this.roleName;
    }
}
