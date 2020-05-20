package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.className.*;

// classes in my project
import dbUtils.*;

public class ClassNameView {

    public static StringDataList allClassNameAPI(DbConn dbc) {

        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT game_class_id, class_name "+
                    "FROM game_class ORDER BY game_class_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in ClassNameView.allClassNameAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}