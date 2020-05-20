package model.webUser;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods {
         public static StringData update(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else {

            String sql = "UPDATE mmo_player SET "
                    + "player_email= ?, player_pswd= ?, player_age= ?, player_registration_date= ?, player_total_transaction= ?, player_role_id= ? "
                    + "WHERE player_id= ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.playerEmail); // string type is simple
            pStatement.setString(2, inputData.playerPassword);
            pStatement.setInt(3, ValidationUtils.integerConversion(inputData.age));
            pStatement.setDate(4, ValidationUtils.dateConversion(inputData.registrationDate));
            pStatement.setBigDecimal(5, ValidationUtils.decimalConversion(inputData.totalTransaction));
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.playerRoleId));
            pStatement.setInt(7, ValidationUtils.integerConversion(inputData.playerId));

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

    public static String delete(String player_id, DbConn dbc) {

        if (player_id == null) {
            return "Programmer error: cannot attempt to delete web_user record that matches null user id";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM mmo_player WHERE player_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, player_id);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Programmer Error: did not delete the record with player_id " + player_id;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage();
        }

        return result;
    }

    /*
    Returns a "StringData" object that is full of field level validation
    error messages (or it is full of all empty strings if inputData
    totally passed validation.  
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        /* Useful to copy field names from StringData as a reference
    public String webUserId = "";
    public String userEmail = "";
    public String userPassword = "";
    public String userPassword2 = "";
    public String birthday = "";
    public String membershipFee = "";
    public String userRoleId = "";   // Foreign Key
    public String userRoleType = ""; // getting it from joined user_role table.
         */
        // Validation
        errorMsgs.playerEmail = ValidationUtils.stringValidationMsg(inputData.playerEmail, 45, true);
        errorMsgs.playerPassword = ValidationUtils.stringValidationMsg(inputData.playerPassword, 45, true);

        if (inputData.playerPassword.compareTo(inputData.playerPassword2) != 0) { // case sensative comparison
            errorMsgs.playerPassword2 = "Both passwords must match";
        }

        errorMsgs.age = ValidationUtils.integerValidationMsg(inputData.age, false);
        errorMsgs.registrationDate = ValidationUtils.dateValidationMsg(inputData.registrationDate, false);
        errorMsgs.totalTransaction = ValidationUtils.decimalValidationMsg(inputData.totalTransaction, false);
        errorMsgs.playerRoleId = ValidationUtils.integerValidationMsg(inputData.playerRoleId, true);

        return errorMsgs;
    } // validate 

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { 
            String sql = "INSERT INTO mmo_player (player_email, player_pswd, player_age, player_registration_date, player_total_transaction, player_role_id) "
                    + "values (?,?,?,?,?,?)";

            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setString(1, inputData.playerEmail);
            pStatement.setString(2, inputData.playerPassword);
            pStatement.setInt(3, ValidationUtils.integerConversion(inputData.age));
            pStatement.setDate(4, ValidationUtils.dateConversion(inputData.registrationDate));
            pStatement.setBigDecimal(5, ValidationUtils.decimalConversion(inputData.totalTransaction));
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.playerRoleId));

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
                errorMsgs.errorMsg = "Invalid Player Role Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

} // class