package model.weapon;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods4 {
    public static StringData4 update(StringData4 inputData, DbConn dbc) {

        StringData4 errorMsgs = new StringData4();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else {

            String sql = "UPDATE weapon SET "
                    + "weapon_name= ?, weapon_type= ?, rarity= ?, history= ?, ability= ? "
                    + "WHERE weapon_id= ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setString(1, inputData.weaponName); // string type is simple
            pStatement.setString(2, inputData.weaponType);
            pStatement.setString(3, inputData.rarity);
            pStatement.setString(4, inputData.history);
            pStatement.setString(5, inputData.ability);
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.weaponId));


            

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
                errorMsgs.errorMsg = "Invalid Weapon Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That weapon name is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update
     public static String delete(String weapon_id, DbConn dbc) {

        if (weapon_id == null) {
            return "Programmer error: cannot attempt to delete web_user record that matches null user id";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM weapon WHERE weapon_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, weapon_id);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Programmer Error: did not delete the record with game_id " + weapon_id;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage();
        }

        return result;
    }

    /*
    Returns a "StringData4" object that is full of field level validation
    error messages (or it is full of all empty strings if inputData
    totally passed validation.  
     */
    private static StringData4 validate(StringData4 inputData) {

        StringData4 errorMsgs = new StringData4();

        /* Useful to copy field names from StringData4 as a reference
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
        errorMsgs.weaponName = ValidationUtils.stringValidationMsg(inputData.weaponName, 45, true);
        errorMsgs.weaponType = ValidationUtils.stringValidationMsg(inputData.weaponType, 45, true);
        errorMsgs.rarity = ValidationUtils.stringValidationMsg(inputData.rarity, 45, true);
        errorMsgs.history = ValidationUtils.stringValidationMsg(inputData.history, 300, true);
        errorMsgs.ability = ValidationUtils.stringValidationMsg(inputData.ability, 45, true);

        return errorMsgs;
    } // validate 

    public static StringData4 insert(StringData4 inputData, DbConn dbc) {

        StringData4 errorMsgs = new StringData4();
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
            String sql = "INSERT INTO weapon (weapon_name, weapon_type, rarity, history, ability) "
                    + "values (?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.weaponName); // string type is simple
            pStatement.setString(2, inputData.weaponType);
            pStatement.setString(3, inputData.rarity);
            pStatement.setString(4, inputData.history);
            pStatement.setString(5, inputData.ability);

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
                errorMsgs.errorMsg = "Invalid Weapon Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That weapon name is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

} // class