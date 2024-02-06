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
  start();
}) 

// Function to view all employees
function viewDepartments() {
  connection.query('SELECT * FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res);
    start(); 
  });
}

// Function to view all roles
function viewRoles() {
  let query = 'SELECT roles.id, roles.title, departments.department_name, roles.salary ';
  query += 'FROM roles INNER JOIN departments ON roles.department_id = departments.id';

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}


// Function to view all employees
function viewEmployees() {
  let query = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary ';
  query += 'FROM employees ';
  query += 'INNER JOIN roles ON employees.role_id = roles.id ';
  query += 'INNER JOIN departments ON roles.department_id = departments.id';

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Function to add a department
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department_name',
      message: 'Enter the name of the new department:',
    }
  ]).then((answers) => {
    connection.query('INSERT INTO departments SET ?', {
      department_name: answers.department_name
    }, (err, res) => {
      if (err) throw err;
      console.log('Department added!');
      start();
    });
  });
}

// Function to add a role
function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the role salary:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter the department ID for this role:',
    }
  ]).then((role) => {
    connection.query(
      'INSERT INTO roles SET ?', 
      { title: role.title, salary: role.salary, department_id: role.department_id },
      (err, res) => {
        if (err) throw err;
        console.log('Role added!');
        start();
      }
    );
  });
}

// Function to add an employee
function addEmployee() {
  inquirer.prompt([
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
    {
      type: 'input',
      name: 'manager_id',
      message: 'Enter the manager ID for this employee (leave blank if none):',
      default: null
    }
  ]).then((employee) => {
    if (employee.manager_id === '') {
      employee.manager_id = null;
    }
    connection.query('INSERT INTO employees SET ?', employee, (err, res) => {
      if (err) throw err;
      console.log('Employee added!');
      start();
    });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employee_id',
      message: 'Enter the ID of the employee whose role you want to update:',
    },
    {
      type: 'input',
      name: 'new_role_id',
      message: 'Enter the new role ID for the employee:',
    }
  ]).then((answers) => {
    connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answers.new_role_id, answers.employee_id], (err, res) => {
      if (err) throw err;
      console.log('Employee role updated!');
      start();
    });
  });
}

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
