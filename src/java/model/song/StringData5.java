package model.song;

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
public class StringData5 {

    public String songId = "";
    public String songTitle = "";
    // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData5() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData5(ResultSet results) {
        try {
            this.songId = FormatUtils.formatInteger(results.getObject("song_id"));
            this.songTitle = FormatUtils.formatString(results.getObject("song_title"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.song.StringData5 (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.songId + this.songTitle;
        return s.length();
    }

    public String toString() {
        return "song id: " + this.songId
                + ", song title: " + this.songTitle;
    }
}
