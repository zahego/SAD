package model.role;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * data associated with a single role in the database.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {

    public String playerRoleId = "";   // Foreign Key
    public String roleName = ""; // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string.
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.playerRoleId = FormatUtils.formatInteger(results.getObject("player_role_id"));
            this.roleName = FormatUtils.formatString(results.getObject("role_name"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.role.StringData (the constructor that takes a ResultSet): "
                    + e.getMessage();
        }
    }

    public String toString() {
        return ", player Role Id: " + this.playerRoleId
                + ", Role Name: " + this.roleName;
    }
}