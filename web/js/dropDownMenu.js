/*
 * To use this as a drop down menu, set up your HTML like this (see below) where you have a navigantion Link 
 * element with a menu heading inside (like the word "Data" in the example below). 
 * After the menu heading (still in the nav link element), have your submenu div contain whatever 
 * links are to be hidden/shown when the user clicks on the menu heading. 
 * Add non-breaking spaces (&nbsp;) so that the 
 * menu heading is wider than the widest link in the submenu. Otherwise, the menu heading get wider and 
 * narrower when you click to open/close the submenu.
 * 
   <div class="navLink" onclick="toggleChild(this)">&nbsp;&nbsp;&nbsp;&nbsp;Data&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="subMenu">
            <a onclick = "ajaxCall('webAPIs/listUsersAPI.jsp', setUserContent, setError)">Users</a><br/>
            <a onclick = "">Products</a><br/>
            <a onclick = "">Purchases</a>
        </div>
    </div>

* Style the subMenu something like this (see below). The subMenu must have display:none so it starts out hidden. 
* Set the background color of the subMenu (maybe to match its parent (e.g. navLink).
* The rest of the styling is just preference.
     <style>
        .subMenu {
            display:none; 
            background-color:black;
            font-size:0.9em;
            line-height: 1.7em;
            padding-top:0.8ex;
        }
    </style>
 */


function toggleChild(ele) {
    // Note: childNodes[0] is the Menu Heading label, e.g., "Show"
    // childNodes[1] is the next element, the div that we want to hide/show.
    var child = ele.childNodes[1];

    // Tip: JS doesnt understand the initial CSS values (the values 
    // set by style sheet instead of by JS), so don't reverse 
    // the order of the if/else block. In other words, test first for what it's not 
    // initially (as set by the CSS).                       

    if (child.style.display === "block") {
        child.style.display = "none";
    } else {
        child.style.display = "block";
    }
}