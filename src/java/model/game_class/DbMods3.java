package model.game_class;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods3 {
    public static StringData3 update(StringData3 inputData, DbConn dbc) {

        StringData3 errorMsgs = new StringData3();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else {

            String sql = "UPDATE game_class SET "
                    + "class_name= ?, class_description= ?, attack= ?, defense= ?, magic= ?, stealth= ?, speed= ?, crit= ? "
                    + "WHERE game_class_id= ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setString(1, inputData.className); // string type is simple
            pStatement.setString(2, inputData.classDescription);
            pStatement.setInt(3, ValidationUtils.integerConversion(inputData.attack));
            pStatement.setInt(4, ValidationUtils.integerConversion(inputData.defense));
            pStatement.setInt(5, ValidationUtils.integerConversion(inputData.magic));
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.stealth));
            pStatement.setInt(7, ValidationUtils.integerConversion(inputData.speed));
            pStatement.setInt(8, ValidationUtils.integerConversion(inputData.crit));
            pStatement.setInt(9, ValidationUtils.integerConversion(inputData.gameClassId));


            

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
     public static String delete(String game_class_id, DbConn dbc) {

        if (game_class_id == null) {
            return "Programmer error: cannot attempt to delete web_user record that matches null user id";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM game_class WHERE game_class_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, game_class_id);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Programmer Error: did not delete the record with game_id " + game_class_id;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage();
        }

        return result;
    }

    /*
    Returns a "StringData3" object that is full of field level validation
    error messages (or it is full of all empty strings if inputData
    totally passed validation.  
     */
    private static StringData3 validate(StringData3 inputData) {

        StringData3 errorMsgs = new StringData3();

        /* Useful to copy field names from StringData3 as a reference
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
        errorMsgs.className = ValidationUtils.stringValidationMsg(inputData.className, 45, true);
        errorMsgs.classDescription = ValidationUtils.stringValidationMsg(inputData.classDescription, 100, true);
        errorMsgs.attack = ValidationUtils.integerValidationMsg(inputData.attack, false);
        errorMsgs.defense = ValidationUtils.integerValidationMsg(inputData.defense, false);
        errorMsgs.magic = ValidationUtils.integerValidationMsg(inputData.magic, false);
        errorMsgs.stealth = ValidationUtils.integerValidationMsg(inputData.stealth, false);
        errorMsgs.speed = ValidationUtils.integerValidationMsg(inputData.speed, false);
        errorMsgs.crit = ValidationUtils.integerValidationMsg(inputData.crit, false);

        return errorMsgs;
    } // validate 

    public static StringData3 insert(StringData3 inputData, DbConn dbc) {

        StringData3 errorMsgs = new StringData3();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
                       String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
                    "web_user.user_role_id, user_role_type "+
                    "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id " + 
                    "ORDER BY web_user_id ";
             */
            // Start preparing SQL statement
            String sql = "INSERT INTO game_class (class_name, class_description, attack, defense, magic, stealth, speed, crit) "
                    + "values (?,?,?,?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.className); // string type is simple
            pStatement.setString(2, inputData.classDescription);
            pStatement.setInt(3, ValidationUtils.integerConversion(inputData.attack));
            pStatement.setInt(4, ValidationUtils.integerConversion(inputData.defense));
            pStatement.setInt(5, ValidationUtils.integerConversion(inputData.magic));
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.stealth));
            pStatement.setInt(7, ValidationUtils.integerConversion(inputData.speed));
            pStatement.setInt(8, ValidationUtils.integerConversion(inputData.crit));
            

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
                errorMsgs.errorMsg = "Invalid User Role Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

} // class