package model.weapon;

import java.util.ArrayList;
import java.sql.ResultSet;


// The purpose of this class is to have a nice java object that can be converted to JSON 
// to communicate everything necessary to the web page (the array of users plus a possible 
// list level database error message). 
public class StringDataList4 {

    public String dbError = "";
    public ArrayList<StringData4> webUserList = new ArrayList();

    // Default constructor leaves StringDataList objects nicely set with properties 
    // indicating no database error and 0 elements in the list.
    public StringDataList4() {
    }

    // Adds one StringData4element to the array list of StringData4elements
    public void add(StringData4 stringData4) {
        this.webUserList.add(stringData4);
    }

    // Adds creates a StringData4element from a ResultSet (from SQL select statement), 
    // then adds that new element to the array list of StringData4elements.
    public void add(ResultSet results) {
        StringData4 sd = new StringData4 (results);
        this.webUserList.add(sd);
    }
}
