var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var md5 = require('MD5');

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
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ... ");
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

app.post('/login', function(req, res) {
    var data = {
        email: req.body.email,
        password: req.body.password
    }
    var query = "SELECT * FROM users WHERE email= " + mysql.escape(data.email) + " AND password= " + mysql.escape(data.password) + "";

    connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        res.json({ success: true, msg: 'User Exist', email: rows[0].email, password: rows[0].password });
    })
});


app.delete('/users/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE from ?? WHERE ??=?";
    var table = ["users", "id", id];
    query = mysql.format(query, table);

    connection.query(query, function(err, rows) {
        if (err) {
            res.json({ success: false, msg: "Error delete in mysql query" });
        } else {
            res.json({ success: true, msg: "Succes delete data" });
        }
    });
});

app.put('/users/update', function(req, res) {
    var data = {
        email: req.body.email,
        password: md5(req.body.password),
        name: req.body.name
    };

    var query = "UPDATE ?? SET ? WHERE ?? = ?";
    var table = ["users", data, "email", data.email];
    query = mysql.format(query, table);
    console.log(query);
    connection.query(query, function(err, rows) {
        if (err) {
            res.json({ success: false, msg: "Error update in mysql query" });
        } else {
            res.json({ success: true, msg: "User updated" });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});