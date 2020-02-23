/***************************************************************
****************************************************************
** Javascript for Handling Making a List of Employees in Table
** and Deleting Employees from Said Table
****************************************************************
***************************************************************/



/************************************************
* Create Start of A Table To Display Employees
************************************************/
//main variable used to navigate document and holds location of current node being manipulated
var adder = document.body;

//commonly used DOM navigation functions
var moveToChild = function()
{
  adder = adder.firstElementChild;
}

var moveToSibling = function()
{
  adder = adder.nextElementSibling;
}

var moveToParent = function()
{
  adder = adder.parentNode;
}

/*******************************
* Delete Button Functionality
********************************/

/* Delete Function */
var deleteEmployee = function()
{
  //confirmation box
  if(confirm("Do you really want to delete this employee?"))
  {
    //if Yes chosen, delete entry
    var delete_sql = "DELETE FROM employee WHERE employee_ID = ?;"
    var data = [this.id]; //capture employee_ID stored earlier

    con.query(delete_sql, data, function(error, results){
        if(error)
        {
          alert("Deletion Unsuccessful");
        }
        else
        {
          alert("Deletion Successful");

          //refresh page to update list
          location.reload();
        }
    });
  }
}


/*********************************
** Add Table to the Document
*********************************/
//create table
adder.appendChild(document.createElement("table"));

//<script> tag
moveToChild();

//<table> tag
moveToSibling();
adder.style.border = "5px solid black";
adder.style.background = "rgb(153, 102, 51)";
adder.style.width = "50%";
adder.style.margin = "auto";
//add theader
adder.appendChild(document.createElement("thead"));

//<thead> tag
moveToChild();
//add theader row
adder.appendChild(document.createElement("tr"));

//<tr> tag
moveToChild();
//add cells to header row
adder.appendChild(document.createElement("th"));
adder.appendChild(document.createElement("th"));
adder.appendChild(document.createElement("th"));
adder.appendChild(document.createElement("th"));
adder.appendChild(document.createElement("th"));
adder.appendChild(document.createElement("th"));

//move through <th> tags
//add header text
moveToChild();
adder.textContent = "First Name";
adder.style.padding = "3px";
moveToSibling();
adder.textContent = "Last Name";
adder.style.padding = "3px";
moveToSibling();
adder.textContent = "Employee ID";
adder.style.padding = "3px";
moveToSibling();
adder.textContent = "Start Date";
adder.style.padding = "3px";
moveToSibling();
adder.textContent = "Status";
adder.style.padding = "3px";

//head back to <table>
moveToParent();
moveToParent();
moveToParent();
//add tbody
adder.appendChild(document.createElement("tbody"));
//move to <tbody>
moveToChild();
moveToSibling();

//variable to keep track of number of rows
var rowNum = 0;

//function to add a row and fill it with data
//called to create each row from returned entries
function addTableRow(inArray)
{
  //add body row and five cells to row
  adder.appendChild(document.createElement("tr"));

  moveToChild();

  //move to new row
  var i = rowNum;
  while(i > 0)
  {
    moveToSibling();

    i--;
  }

  //add cells
  adder.appendChild(document.createElement("td"));
  adder.appendChild(document.createElement("td"));
  adder.appendChild(document.createElement("td"));
  adder.appendChild(document.createElement("td"));
  adder.appendChild(document.createElement("td"));
  adder.appendChild(document.createElement("td"));

  //add data
  moveToChild(); //First Name <td>
  adder.textContent = inArray.first_name;
  adder.style.textAlign = "center";
  moveToSibling(); //Last Name <td>
  adder.textContent = inArray.last_name;
  adder.style.textAlign = "center";
  moveToSibling(); //Employee ID <td>
  adder.textContent = inArray.employee_ID;
  adder.style.textAlign = "center";
  moveToSibling(); //Start Date <td>
  adder.textContent = inArray.start_date;
  adder.style.textAlign = "center";
  moveToSibling(); //Status <td>
  adder.textContent = inArray.status;
  adder.style.textAlign = "center";

  moveToSibling(); //Delete Button <td>
  adder.appendChild(document.createElement("button"));
  moveToChild(); //move to Delete Button
  adder.type = "button";
  adder.textContent = "Delete";
  adder.id = inArray.employee_ID; //store the Employee ID of row in button for later use
  adder.addEventListener("click", deleteEmployee); //add delete functionality

  //move back to <tbody>
  moveToParent();
  moveToParent();
  moveToParent();

  rowNum = rowNum + 1;
}




/*****************************************************************************************
* Sample Data to Test Above Function Without Needing to Connect to External Database
* <comment out or delete for final version>
*****************************************************************************************/

var array1 = {};
array1.first_name = "Vinni";
array1.last_name = "Yasi";
array1.employee_ID = 666;
array1.start_date = "07/12/1989";
array1.status = "All Good";

var array2 = {};
array2.first_name = "Mala";
array2.last_name = "Boyd";
array2.employee_ID = 609;
array2.start_date = "2/1/2020";
array2.status = "All Good";

addTableRow(array1);
addTableRow(array2);
addTableRow(array1);


/************************************
* Get Entries From Employee Table
************************************/

//Code based on that found on w3schools.com

//Create A Connection to Database

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "P5rSCKr0ev",
  password: "eDF6gmAyA0",
  database: "P5rSCKr0ev"
});


con.connect(function(err) {
  if (err) throw err;
  //console.log("Connected!");
});


//Get Contents of Employee Table on Employee List Page of UI
  
//array to hold results from query
var context = {};

//query to get contents of Employee table
var sql = "SELECT * FROM employee;";

//query table and display on page
con.query(sql, function (err, result) {
  if(err)
      {
          throw err;
      }
      else
      {
        //set context to results from query (ie.the Employee entries)
      	context = results;
		
        //build a row for each entry
        for (x in context)
        {
          addTableRow(x);
        }
      }
  });
