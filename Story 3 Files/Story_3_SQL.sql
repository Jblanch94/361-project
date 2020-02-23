
-- Set Up an Employee Table in Database --
CREATE TABLE employee(
	id int(11) AUTO_INCREMENT,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	employee_ID int(8) NOT NULL UNIQUE, --different ID from entry id; employee ID # used in company
	start_date date NOT NULL,
	status varchar(255) NOT NULL,
	PRIMARY KEY(id));

-- Add to Employee Table --
INSERT INTO employee(first_name, last_name, employee_ID, start_date, status) VALUES (:inFirstName, :inLastName, :inEID, :inStartDate, :inStatus);

-- Delete from Employee Table --
DELETE FROM employee WHERE employee_ID = :inEID;
--We can choose some other combination of fields to delete by, but employee ID should be unique to each entry
--Also, the actual deltion will be done by the user interface, so it should easily be able to grab the employee ID

-- Populate List of Employee Entries --
SELECT * FROM employee;
--This gets all data from the entries, but we can specify fields if we don't want all
--id will probably not be displayed by user interface, but it will still want to retrieve it so interface can use it behind the scenes
--Filtering is not mentioned in story, but can be added by making different queries for different filters, or by dynamically making query based on filter(s)