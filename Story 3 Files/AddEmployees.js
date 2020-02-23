/********************************************************
*********************************************************
** Javascript for Adding an Employee to Table
*********************************************************
********************************************************/



/***********************************
* Function to Get Data from Form
***********************************/
function getEmployeeData()
{
  data.first_name = document.getElementById("first_name");
  data.last_name = document.getElementById("last_name");
  data.employee_ID = document.getElementById("employee_ID");
  data.start_date = document.getElementById("start_date");
  data.status = document.getElementById("status");
}

//Code based on that found on w3schools.com

/**********************************
* Create A Connection to Database
***********************************/

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


/************************
* Add Employee to Table
************************/

//query to add entry
var sql = "INSERT INTO employee(first_name, last_name, employee_ID, start_date, status) VALUES (?, ?, ?, ?, ?);";

//array to hold data
var data = {};

//add data capturing to Submit button of form
document.getElementById("addEmployee").addEventListener("click", getEmployeeData);

//send add query
con.query(sql, data, function (err, result) {
  if(err)
      {
          throw err;
      }
      else
      {
        alert("Employee Successfully Added to Database");

        //refresh page
        location.reload();
      }
  });

