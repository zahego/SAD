package model.className;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * data associated with a single role in the database.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {

    public String gameClassId = "";   // Foreign Key
    public String className = ""; // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string.
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.gameClassId = FormatUtils.formatInteger(results.getObject("game_class_id"));
            this.className = FormatUtils.formatString(results.getObject("class_name"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.className.StringData (the constructor that takes a ResultSet): "
                    + e.getMessage();
        }
    }

    public String toString() {
        return ", Game Class ID: " + this.gameClassId
                + ", Class Name: " + this.className;
    }
}