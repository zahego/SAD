package model.song;

import java.util.ArrayList;
import java.sql.ResultSet;


// The purpose of this class is to have a nice java object that can be converted to JSON 
// to communicate everything necessary to the web page (the array of users plus a possible 
// list level database error message). 
public class StringDataList5 {

    public String dbError = "";
    public ArrayList<StringData5> webUserList = new ArrayList();

    // Default constructor leaves StringDataList objects nicely set with properties 
    // indicating no database error and 0 elements in the list.
    public StringDataList5() {
    }

    // Adds one StringData4element to the array list of StringData4elements
    public void add(StringData5 stringData4) {
        this.webUserList.add(stringData4);
    }

    // Adds creates a StringData4element from a ResultSet (from SQL select statement), 
    // then adds that new element to the array list of StringData4elements.
    public void add(ResultSet results) {
        StringData5 sd = new StringData5 (results);
        this.webUserList.add(sd);
    }
}
