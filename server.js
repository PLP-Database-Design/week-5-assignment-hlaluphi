import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory's path
const __dirname = path.dirname(__filename);

// Create an express app
const app = express();

// Load environment variables from a .env file
dotenv.config();

// Connection to the Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// test the connection
db.connect((err) => {
  //connection is not succesful
  if (err) {
    console.error('Error connecting to MYSQL', err);
    return;
  }

  //connection is succesful
  console.log('Connected to MYSQL as id:', db.threadId);
});


// setting the view engine to EJS
app.set('view engine', 'ejs');

// setting the directory for the views
app.set('views', path.join(__dirname, 'views'));




// Question 1).

// Retrieve all patients:

app.get('/all-patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving all patients');
    }
    
    if (results.length === 0) {
      return res.status(404).send('No patients found');
    }
    
    res.status(200).render('data', { data: results });
  });
});


// Question 2).

// Retrieve all providers:

app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving all providers');
    }
    
    if (results.length === 0) {
      return res.status(404).send('No providers found');
    }
    
    res.status(200).render('data', { data: results });
  });
});


// Question 3). 

// Filter patients by First Name:

app.get('/filter-patients/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      return res.status(500).send('Error filtering patients by First Name');
    }
    
    if (results.length === 0) {
      return res.status(404).send('No patients found with the given first name');
    }
    
    res.status(200).render('data', { data: results });
  });
});


//Question 4).

//Retrieve all providers by their specialty:

app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving all providers by their specialty ',err);
    }
    if (results.length === 0) {
      return res.status(404).send('No providers found for the given specialty');
    }

    res.status(200).render('data', { data: results });
  });
});



// Start and listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  // Show the server's URL in the console
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Print a message to the console
  console.log('sending message to the browser...');

  // Define a route for the home page
  app.get('/', (req, res) => {
    // Send a response to the browser
    res.send('server started successfully!');
  });

});
