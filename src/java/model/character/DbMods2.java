package model.character;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods2 {
     public static StringData2 update(StringData2 inputData, DbConn dbc) {

        StringData2 errorMsgs = new StringData2();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else {

            String sql = "UPDATE your_character SET "
                    + "player_id= ?, game_class_id= ?, character_name= ?, character_created_date= ? "
                    + "WHERE character_id= ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setInt(1, ValidationUtils.integerConversion(inputData.playerId));
            pStatement.setInt(2, ValidationUtils.integerConversion(inputData.gameClassId));
            pStatement.setString(3, inputData.characterName); // string type is simple
            pStatement.setDate(4, ValidationUtils.dateConversion(inputData.characterCreatedDate));
            pStatement.setInt(5, ValidationUtils.integerConversion(inputData.characterId));

            

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were updated (expected to update one record).";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid User Role Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update
         public static String delete(String character_id, DbConn dbc) {

        if (character_id == null) {
            return "Programmer error: cannot attempt to delete web_user record that matches null user id";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM your_character WHERE character_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, character_id);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Programmer Error: did not delete the record with game_id " + character_id;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.character.DbMods2.delete(): " + e.getMessage();
        }

        return result;
    }

    private static StringData2 validate(StringData2 inputData) {
        

        StringData2 errorMsgs = new StringData2();
        errorMsgs.playerId = ValidationUtils.integerValidationMsg(inputData.playerId, true);
        errorMsgs.gameClassId = ValidationUtils.integerValidationMsg(inputData.gameClassId, true);
        errorMsgs.characterName = ValidationUtils.stringValidationMsg(inputData.characterName, 45, true);
        errorMsgs.characterCreatedDate = ValidationUtils.dateValidationMsg(inputData.characterCreatedDate, false);


        return errorMsgs;
    } // validate 

    public static StringData2 insert(StringData2 inputData, DbConn dbc) {

        StringData2 errorMsgs = new StringData2();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            // Start preparing SQL statement
            String sql = "INSERT INTO your_character (player_id, game_class_id, character_name, character_created_date) "
                    + "values (?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setInt(1, ValidationUtils.integerConversion(inputData.playerId));
            pStatement.setInt(2, ValidationUtils.integerConversion(inputData.gameClassId));
            pStatement.setString(3, inputData.characterName); // string type is simple
            pStatement.setDate(4, ValidationUtils.dateConversion(inputData.characterCreatedDate));
            

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Character Id. Must use other character id";
            } 

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

} // class