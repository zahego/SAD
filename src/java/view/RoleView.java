package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.role.*;

// classes in my project
import dbUtils.*;

public class RoleView {

    public static StringDataList allRolesAPI(DbConn dbc) {

        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT player_role_id, role_name "+
                    "FROM user_role ORDER BY player_role_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in RoleView.allRolesAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}