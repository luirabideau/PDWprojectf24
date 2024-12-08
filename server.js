/*---------- Created by Lui Rabideau, Xin Lin, Tassia Cocoran, Emma Sharp, and Jessica Bandol ----------*/
/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*------------------------- Lui Rabideau's F2023 ITM352 Assignment 3 Template --------------------------*/
/*-------------------------------------- UHM ITM354 Final Project --------------------------------------*/

var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');
const session = require('express-session');

app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

let userLoggedin = {};

const fs = require('fs');
const { type } = require('os');

//USER DATA STUFF
let user_reg_data = {};
let user_data_filename = __dirname + '/user_data.json'; // takes the information from the user_data.json file

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));


// monitor all requests and make a reservation
app.all('*', function (request, response, next){// this function also makes reservations
  console.log(request.method + ' to ' + request.path);
     // gives the user a cart if the user does not have one
     if (typeof request.session.reservation == 'undefined'){
       request.session.reservation = {};
    }
  next();
});

if (fs.existsSync(user_data_filename)){// if the user data file exists, read it and parse it
    // get the filesize and print it out
    console.log(`${user_data_filename} has ${fs.statSync(user_data_filename).size} characters.`);
    // let user_reg_data = require('./user_data.json');
    let user_reg_data_JSON = fs.readFileSync(user_data_filename, 'utf-8');
    user_reg_data = JSON.parse(user_reg_data_JSON);
} else {
    console.log(`Error! ${user_data_filename} does not exist!`);
}

/*---------------------------------- DATABASE CONNECTION ----------------------------------*/
console.log("Connecting to localhost..."); 
var con = mysql.createConnection({// Actual DB connection occurs here
  host: '127.0.0.1',
  user: "root",
  port: 3306,
  database: "emsync",
  password: ""
});

con.connect(function (err) {// Throws error or confirms connection
  if (err) throw err;
  console.log("Connected!");
});

/*---------------------------------- FUNCTIONS ----------------------------------*/
function isNonNegInt(stringToCheck, returnErrors = false) {
  errors = []; // assume no errors at first
  if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!'); // Check if string is a number value
  if (stringToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
  if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!'); // Check that it is an integer

  return returnErrors ? errors : (errors.length == 0);
}


/*---------------------------------- KAZMAN SQL ----------------------------------*/
function query_DB(POST, response) {
  if (isNonNegInt(POST['low_price']) && isNonNegInt(POST['high_price'])) {// Only query if we got a low and high price
    low = POST['low_price']; // Grab the parameters from the submitted form
    high = POST['high_price'];
    /*---------------------------------- QUERY ----------------------------------*/
    query = "SELECT * FROM Room where price > " + low + " and price < " + high; // Build the query string
    con.query(query, function (err, result, fields) {   // Run the query
      if (err) throw err;
      console.log(result);
      var res_string = JSON.stringify(result);
      var res_json = JSON.parse(res_string);
      console.log(res_json);
    /*---------------------------------- QUERY ----------------------------------*/
    /*---------------------------------- DISPLAY ----------------------------------*/
      // Now build the response: table of results and form to do another query
      response_form = `<form action="homeSQL.html" method="GET">`;
      response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
      response_form += `<td><B>Room#</td><td><B>Hotel#</td><td><B>Type</td><td><B>Price</td></b>`;
      for (i in res_json) {
        response_form += `<tr><td> ${res_json[i].roomNo}</td>`;
        response_form += `<td> ${res_json[i].hotelNo}</td>`;
        response_form += `<td> ${res_json[i].type}</td>`;
        response_form += `<td> ${res_json[i].price}</td></tr>`;
      }
      response_form += "</table>";
      response_form += `<input type="submit" value="Another Query?"> </form>`;
      response.send(response_form);
    });
    /*---------------------------------- DISPLAY ----------------------------------*/
  } else { // If any errors occur
    response.send("Enter some prices doofus!");
  }
}

app.post("/process_query", function (request, response) {
  let POST = request.body;
  query_DB(POST, response);
});

/*---------------------------------- LOGIN/LOGOUT/REGISTER ----------------------------------*/
app.post('/login', function (request, response){// Validates a users login, and redirects page to the page if invalid and to cart if valid
  // Process login form POST and redirect to logged in page if ok, back to login page if not
  let the_username = request.body.username.toLowerCase();
  let the_password = request.body.password;
  if(typeof user_reg_data[the_username] !== 'undefined'){// check if username is in user_data
     if(user_reg_data[the_username].password === the_password){// check if the password matches the password in user_reg_data
        console.log(`${the_username} is logged in!`);
        response.cookie("username", the_username, {expire: Date.now() + 30 * 60 * 1000});// send a username cookie to indicate logged in
        response.cookie("name", user_reg_data[the_username].name, {expire: Date.now() + 30 * 60 * 1000});// make a name cookie
        response.cookie("loggedIn", 1, {expire: Date.now() + 30 * 60 * 1000});// make a logged in cookie
        userLoggedin[the_username] = true;
        let cartCookie = Number(request.body.total);
        if(cartCookie == 0) {
          response.redirect(`./index.html`)
        } else {
          if(user_reg_data[the_username].rank === "1"){
            response.redirect(`./loggedIn1.html`)
            } else {
              response.redirect(`./loggedIn2.html`)}
        }
     } else {
        response.redirect(`./index.html?error=pass`) // redirects if password is wrong
     }
  } else { // else the user does not exist 
     response.redirect(`./index.html?error=user`); // redirects if user DNE
  }
});


// logout function
app.get('/logout', function (request, response){// Redirects user to home page after logging out
  response.redirect(`./index.html`)
});

/*---------------------------------- MAPS SQL ----------------------------------*/

//app.use(session({// Configure the session middleware
//  secret: 'your_secret_key', // Replace with a secure key
//  resave: false,
//  saveUninitialized: true,
//  cookie: { secure: false } // Set to true if using HTTPS
//}));

app.get("/geo", (req, res) => {
  const search = req.query.search; // Use 'search' for query parameter
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
  const offset = (page - 1) * limit;

  if (!search) {
      return res.status(400).send("Search term is required.");
  }

  const query = `
      SELECT Title, Department_Name, Year_Range, Subject, Description, Medium, Language 
      FROM RECORDS 
      WHERE Geo_Location LIKE '%${search}%'
      LIMIT ${limit} OFFSET ${offset};
  `;

  con.query(query, (err, result) => {
      if (err) throw err;
      // Store results in session
      req.session.results = result;
      req.session.search = search;
      // Redirect to geo.html with the query parameters
      res.redirect(`/results.html?search=${encodeURIComponent(search)}&page=${page}`);
  });
});

app.get("/get-session-data", (req, res) => {
  if (!req.session.results || !req.session.search) {
      return res.status(404).json({ error: "No session data available." });
  }
  res.json({
      results: req.session.results, 
      search: req.session.search
  });
  console.log(req.session);
});

/*---------------------------------- PAYROLL STUFF ----------------------------------*/
// Route to retrieve payroll data
app.get('/retrievePayroll', (req, res) => {
  const query = `SELECT * FROM timesheets WHERE Employee_ID = '1000123456'`;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch payroll data' });
          return;
      }
      res.json(results);
  });
});

/*---------------------------------- GRIEVANCES STUFF ----------------------------------*/
// Route to retrieve grievances data
app.get('/retrieveGrievances', (req, res) => {
  const query = `SELECT * FROM grievance WHERE Employee_ID = '1000123456'`;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch grievance data' });
          return;
      }
      res.json(results);
  });
});

/*---------------------------------- EVALUATION STUFF ----------------------------------*/
// Route to retrieve evaluation data
app.get('/retrieveEvaluation', (req, res) => {
  const query = `SELECT * FROM evaluation WHERE Employee_ID = '1000123456'`;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch evalution data' });
          return;
      }
      res.json(results);
  });
});


/*---------------------------------- UPCOMING TRAINING STUFF ----------------------------------*/
// Route to retrieve training data
app.get('/retrieveUpcomingtraining', (req, res) => {
  const query = `SELECT * FROM training WHERE Training_date > CURDATE();`;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch training data' });
          return;
      }
      res.json(results);
  });
});


/*---------------------------------- PAST TRAINING STUFF ----------------------------------*/
// Route to retrieve training data
app.get('/retrievePasttraining', (req, res) => {
  const query = `SELECT * FROM training WHERE Training_date < CURDATE();`;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch training data' });
          return;
      }
      res.json(results);
  });
});





/*---------------------------------- REPORTS STUFF START ----------------------------------*/


// Demographic; Q1
app.get('/retrieveGenderratio', (req, res) => {
  const query = `SELECT gender,
                COUNT(*) AS count,
                ROUND((COUNT(*) / (SELECT COUNT(*) FROM employee) * 100), 2) AS percentage
                FROM employee
                WHERE Term_Date IS NULL
                GROUP BY gender;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch genderratio data' });
          return;
      }
      res.json(results);
  });
});

// Demographic; Q2
app.get('/retrieveGenderratiodept', (req, res) => {
  const query = `SELECT Dept_Hire, gender, COUNT(*) AS count, ROUND((COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY Dept_Hire) * 100), 2) AS percentage FROM employee WHERE Term_Date IS NULL GROUP BY Dept_Hire, gender ORDER BY Dept_Hire, gender;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch genderratiodept data' });
          return;
      }
      res.json(results);
  });
});

// Demographic; Q3
app.get('/retrieveAgegroup', (req, res) => {
  const query = `SELECT CASE WHEN TIMESTAMPDIFF(YEAR, BDate, CURDATE()) BETWEEN 21 AND 35 THEN '21-35' WHEN TIMESTAMPDIFF(YEAR, BDate, CURDATE()) BETWEEN 36 AND 59 THEN '36-59' WHEN TIMESTAMPDIFF(YEAR, BDate, CURDATE()) >= 60 THEN '60+' END AS age_range, COUNT(*) AS count FROM employee WHERE Term_Date IS NULL GROUP BY age_range ORDER BY age_range;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch agegroup data' });
          return;
      }
      res.json(results);
  });
});

// Demographic; Q4
app.get('/retrieveAgegroupdept', (req, res) => {
  const query = `SELECT e.Dept_Hire, CASE WHEN TIMESTAMPDIFF(YEAR, e.BDate, CURDATE()) BETWEEN 21 AND 35 THEN '21-35' WHEN TIMESTAMPDIFF(YEAR, e.BDate, CURDATE()) BETWEEN 36 AND 59 THEN '36-59' WHEN TIMESTAMPDIFF(YEAR, e.BDate, CURDATE()) >= 60 THEN '60+' END AS age_range, COUNT(*) AS count FROM employee e WHERE Term_Date IS NULL GROUP BY e.Dept_Hire, age_range ORDER BY e.Dept_Hire, age_range;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch agegroupdept data' });
          return;
      }
      res.json(results);
  });
});

// Demographic; Q5
app.get('/retrieveJobtype', (req, res) => {
  const query = `SELECT Employee_Type_Name, COUNT(*) AS count FROM employee WHERE Term_Date IS NULL GROUP BY Employee_Type_Name ORDER BY count DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch jobtype data' });
          return;
      }
      res.json(results);
  });
});

// Demographic; Q6
app.get('/retrieveJobtypedept', (req, res) => {
  const query = `WITH department_job_types AS ( SELECT d.Dept_Hire, t.Employee_Type_Name FROM (SELECT DISTINCT Dept_Hire FROM employee) d CROSS JOIN (SELECT DISTINCT Employee_Type_Name FROM employee) t ) SELECT dj.Dept_Hire, dj.Employee_Type_Name, COUNT(e.Employee_ID) AS count FROM department_job_types dj LEFT JOIN employee e ON dj.Dept_Hire = e.Dept_Hire AND dj.Employee_Type_Name = e.Employee_Type_Name AND e.Term_Date IS NULL GROUP BY dj.Dept_Hire, dj.Employee_Type_Name ORDER BY dj.Dept_Hire ASC, dj.Employee_Type_Name ASC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch jobtypedept data' });
          return;
      }
      res.json(results);
  });
});



// Turnover; Q1
app.get('/retrieveRetentiondept', (req, res) => {
  const query = `SELECT Dept_Hire, AVG(TIMESTAMPDIFF(MONTH, Hire_Date, Term_Date)) AS average_retention_months FROM employee WHERE Term_Date IS NOT NULL GROUP BY Dept_Hire ORDER BY average_retention_months DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch retentiondept data' });
          return;
      }
      res.json(results);
  });
});

// Turnover; Q2
app.get('/retrieveRetentionjobtype', (req, res) => {
  const query = `SELECT Employee_Type_Name, AVG(TIMESTAMPDIFF(MONTH, Hire_Date, Term_Date)) AS average_retention_months FROM employee WHERE Term_Date IS NOT NULL GROUP BY Employee_Type_Name ORDER BY average_retention_months DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch retentionjobtype data' });
          return;
      }
      res.json(results);
  });
});

// Turnover; Q3
app.get('/retrieveRetentionjobtypedept', (req, res) => {
  const query = `SELECT Dept_Hire, Employee_Type_Name, AVG(TIMESTAMPDIFF(MONTH, Hire_Date, Term_Date)) AS average_retention_months FROM employee WHERE Term_Date IS NOT NULL GROUP BY Dept_Hire, Employee_Type_Name ORDER BY Dept_Hire, average_retention_months DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch retentionjobtypedept data' });
          return;
      }
      res.json(results);
  });
});

// Turnover; Q4
app.get('/retrieveTermjobtype', (req, res) => {
  const query = `SELECT t.Term_Type, COUNT(e.Term_Type) AS terminated_count FROM (SELECT DISTINCT Term_Type FROM employee WHERE Term_Type IS NOT NULL UNION SELECT 'end_of_contract' UNION SELECT 'Retirement' UNION SELECT 'Resignation' UNION SELECT 'poor_evaluation') t LEFT JOIN employee e ON t.Term_Type = e.Term_Type WHERE e.Term_Type IS NOT NULL OR e.Term_Type IS NULL GROUP BY t.Term_Type ORDER BY terminated_count DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch termjobtype data' });
          return;
      }
      res.json(results);
  });
});

// Turnover; Q5
app.get('/retrieveTermjobtypedept', (req, res) => {
  const query = `SELECT d.Dept_Hire, t.Term_Type, COUNT(e.Term_Type) AS terminated_count FROM (SELECT DISTINCT Dept_Hire FROM employee) d CROSS JOIN (SELECT DISTINCT Term_Type FROM employee WHERE Term_Type IS NOT NULL) t LEFT JOIN employee e ON d.Dept_Hire = e.Dept_Hire AND t.Term_Type = e.Term_Type WHERE e.Term_Type IS NOT NULL OR e.Term_Type IS NULL GROUP BY d.Dept_Hire, t.Term_Type ORDER BY d.Dept_Hire, terminated_count DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch termjobtypedept data' });
          return;
      }
      res.json(results);
  });
});

// Turnover; Q6
app.get('/retrieveTermrate6mo', (req, res) => {
  const query = `WITH last_six_months AS ( SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n.num MONTH), '%Y-%m') AS term_month FROM (SELECT 0 AS num UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) n ) SELECT m.term_month, COUNT(e.Term_Date) AS terminated_count, ROUND((COUNT(e.Term_Date) / (SELECT COUNT(*) FROM employee) * 100), 2) AS termination_rate_percentage FROM last_six_months m LEFT JOIN employee e ON DATE_FORMAT(e.Term_Date, '%Y-%m') = m.term_month WHERE e.Term_Date IS NULL OR e.Term_Date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY m.term_month ORDER BY m.term_month ASC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch termrate6mo data' });
          return;
      }
      res.json(results);
  });
});

// Turnover; Q7
app.get('/retrieveTermgrievance', (req, res) => {
  const query = `SELECT e.Employee_ID, CONCAT(e.FName, ' ', e.LName) AS Employee_Name, COUNT(g.Employee_ID) AS grievance_count FROM employee e LEFT JOIN grievance g ON e.Employee_ID = g.Employee_ID WHERE e.Term_Date IS NOT NULL GROUP BY e.Employee_ID, e.FName, e.LName ORDER BY grievance_count DESC;
                `;
  con.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch termgrievance data' });
          return;
      }
      res.json(results);
  });
});



/*---------------------------------- REPORTS STUFF END ----------------------------------*/






/*---------------------------------- INFO STUFF ----------------------------------*/

// POST endpoint to handle form submission
app.post('/retrieveInfo', (req, res) => {
  const { table, employeeID } = req.body;

  // Validate inputs
  if (!table || !employeeID) {
      return res.status(400).send('Table and Employee ID are required.');
  }

  // Store the query results for the frontend
  const query = `SELECT * FROM ${table} WHERE Employee_ID = ?`;

  con.query(query, [employeeID], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Database query failed.');
      }

      // Save query results in a global variable (use sessions or a database for production)
      app.locals.queryResults = results;

      // Redirect to results.html
      res.redirect('/results.html');
  });
});

// Endpoint to provide query results
app.get('/getResults', (req, res) => {
  res.json(app.locals.queryResults || []);
});

// Serve results.html
app.get('/results.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'results.html'));
});

/*---------------------------------- SEARCH SQL ----------------------------------*/
app.post("/executeSearch", (req, res) => {
  const search = req.body.searchInput;
  const type = req.body.searchType;
  const format = req.body.format;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
  const offset = (page - 1) * limit;

  console.log(format);

  const query = `
    SELECT Title, Department_Name, Year_Range, Subject, Description, Medium, Language 
    FROM RECORDS WHERE ${type} LIKE '%${search}%' AND Medium = '${format}' 
    LIMIT ${limit} OFFSET ${offset};
  `;

  con.query(query, (err, result) => {
    if (err) throw err;
    // Store results in session
    req.session.results = result;
    req.session.search = search;
    // Redirect to results.html with the query parameters
    res.redirect(`/results.html?search=${encodeURIComponent(search)}&page=${page}`);
  });
});


/*---------------------------------- ADHOC SQL ----------------------------------*/
let queryResults = []; // Declare a global variable properly

// Endpoint to handle form submissions
app.post('/adhoc', (req, res) => {
  const query = req.body.query; // Extract "query" from the form input

  // Execute the query
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error executing query.');
    }

    queryResults = results; // Store results for the results2.html page
    res.redirect('/results2.html'); // Redirect to the results page AFTER results are ready
  });
});

// Endpoint to retrieve query results
app.get('/getAdhocResults', (req, res) => {
  res.json(queryResults || []); // Send stored query results
});



/*----------------------------------- ROUTING -----------------------------------*/
app.all('*', function (request, response, next) {// This must be at the end!
  console.log(request.method + ' to ' + request.path);
  next();
});

app.listen(8080, () => console.log(`listening on port 8080`));















