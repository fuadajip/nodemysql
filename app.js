var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
// Body parser midleware
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(bodyParser.json());

const PORT = 3030;

//Create connection to mysql

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api_nodemysql'
});

connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});


app.get("/", function(req, res) {
    connection.query('SELECT * from users', function(err, rows, fields) {
        connection.end();
        if (!err)
            res.json({ rows });
        else
            console.log('Error while performing Query.');
    });
});

app.post("/register", function(req, res) {
    var data = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    };


    connection.query("INSERT INTO users set ? ", data, function(err, rows) {
        if (err) throw err;
        res.json({ success: true, msg: 'Insert Success' });
        console.log('Insert Success');
    })
})

app.use('/login', function(req, res) {
    var data = {
        email: req.body.email,
        password: req.body.password
    }


    var query = "SELECT * FROM users WHERE email= " + mysql.escape(data.email) + " AND password= " + mysql.escape(data.password) + "";
    console.log(query);
    connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        res.json({ success: true, msg: 'Ada Users', email: rows[0].email, password: rows[0].password });
    })
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});