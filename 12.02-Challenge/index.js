// index.js

const mysql = require('mysql');
const inquirer = require('inquirer');

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'chensley',
  password: '0616',
  database: 'employee_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  start(); // Start the application after establishing a connection
});

// Function to add a new employee
function addEmployee() {
  // Prompt user for employee details
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter employee first name:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter employee last name:',
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter employee role ID:',
      },
    ])
    .then((answers) => {
      connection.query('INSERT INTO employees SET ?', answers, (err, res) => {
        if (err) throw err;
        console.log('Employee added!');
        start(); // Restart the application after adding an employee
      });
    });
}

// Function to view all employees
function viewDepartments() {
  connection.query('SELECT * FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res);
    start(); // Restart the application after viewing departments
  });
}

// Function to view all roles
function viewRoles() {
  connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;
    console.table(res);
    start(); // Restart the application after viewing roles
  });
}

// Function to view all employees
function viewEmployees() {
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    console.table(res);
    start(); // Restart the application after viewing employees
  });
}

// index.js

// ... (other code)

// Function to add a department
function addDepartment(department) {
  connection.query('INSERT INTO departments SET ?', { department_name: department }, (err, res) => {
    if (err) throw err;
    console.log('Department added!');
    start(); // Restart the application after adding a department
  });
}

// Function to add a role
function addRole(role) {
  connection.query(
    'INSERT INTO roles SET ?',
    { title: role.title, salary: role.salary, department_id: role.department_id, id: null },
    (err, res) => {
      if (err) throw err;
      console.log('Role added!');
      start(); // Restart the application after adding a role
    }
  );
}

// Function to add an employee
function addEmployee(employee) {
  connection.query('INSERT INTO employees SET ?', { first_name: employee.first_name, last_name: employee.last_name, role_id: employee.role_id }, (err, res) => {
    if (err) throw err;
    console.log('Employee added!');
    start(); // Restart the application after adding an employee
  });
}

// Function to update an employee role
function updateEmployeeRole(employeeId, roleId) {
  connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [roleId, employeeId], (err, res) => {
    if (err) throw err;
    console.log('Employee role updated!');
    start(); // Restart the application after updating an employee role
  });
}

// ... (other code)

// Main function to prompt the user and handle choices
function start() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit'],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View All Departments':
          viewDepartments();
          break;

        case 'View All Roles':
          viewRoles();
          break;

        case 'View All Employees':
          viewEmployees();
          break;

        case 'Add a Department':
          addDepartment();
          break;

        case 'Add a Role':
          addRole();
          break;

        case 'Add an Employee':
          addEmployee();
          break;

        case 'Update an Employee Role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;

        default:
          console.log('Invalid action');
          start(); // Restart the application for an invalid action
          break;
      }
    });
}
