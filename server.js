const express = require('express');
const session = require('express-session');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const passport = require('passport');
const path = require('path');
const db = require('./models/db/db_config');

const app = express();


app.set('view engine', 'hbs');
express.static(path.join(__dirname, './views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


const port = 3000;

app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});

app.post('/login', (req, res) => {

});

//This route handler is the "home page" of the server. It selects the resources
//and products from the respective tables to send the home.handlebars
app.get('/list', function(req, res, next) {
    var context = {};

    if(req.query.valid == "false") {
      context.error = "true";
    }

    mysql.pool.query('SELECT * FROM resources', function(err, rows, fields) {
       if(err) {
         next(err);
         return;
       }
      var parameters = [];
      for(var p in rows) {
         parameters.push({"name": rows[p].name, "quantity": rows[p].quantity});
      }
      context.list = parameters;

      mysql.pool.query('SELECT * FROM products', function(err, rows, fields) {
        if(err) {
           next(err);
           return;
        }
  
        var parameters = [];
  
        for(var p in rows) {
        parameters.push({"name": rows[p].name, "quantity": rows[p].quantity});
        }
  
        context.product_list = parameters;
        res.render('list', context);
      });   
  });
});

//This route handler displays the form to add a resource.
app.get('/new-resource', function(req, res, next){
    res.render('newResource');
});

 //This route handler handles new resource submissions
app.post('/new-resource', urlencodedParser, function(req, res, next) {
  var context = {};
  var inputPassed = "true"
  //Input Validation to ensure that two resources of same name do not get added.
  //Problem: List is not updated once redirects (have to do another get to '/' to see new resource)
  //  Possible Reason: The selecting is happening before the insertion has completed.
  mysql.pool.query(`SELECT id FROM resources WHERE name = "${req.body.resource_name}"`, function(err, rows, fields) {
      if(err) {
        next(err);
        return;
      }
      //If input validation passes, do this
      if(rows.length == 0) {
          mysql.pool.query("INSERT INTO resources (`name`, `quantity`) VALUES (?,?)", 
                          [req.body.resource_name, req.body.quantity], function(err, result) {
              if(err) {
                next(err);
                return;
              }
          });
      }
      else {
        inputPassed = "false"
      }
      res.redirect('/list?valid=' + inputPassed);
  });
});

//This route handler displays the form for creating a new product
app.get('/new-product',function(req,res,next){
  var context = {};

  //This query grabs the resource names from the resource table
  //In the html, it displays each resource name as a label for a number
  //input (quantity). This is where the user will fill out what resources go
  //into which products. If there is no number filled out for a resource, it 
  //is assumed that there are 0 resources of that type needed.
  mysql.pool.query('SELECT name FROM resources', function(err, rows, fields) {
      if(err) {
        next(err);
        return;
      }
     var parameters = [];
     for(var p in rows) {
        parameters.push({"name": rows[p].name});
     }
     context.inventoryType = parameters;
     res.render('newProduct', context);
  });
});

//This route handler handles the new product form
app.post('/new-product', function(req, res, next) {
  var context = {};
  var inputPassed = "true"

  //Input Validation to ensure no duplicate names
  //Problem: Need to send some message to user that input not accepted.
  mysql.pool.query(`SELECT id FROM products WHERE name = "${req.body.name}"`, function(err, rows, fields) {
    if(err) {
      next(err);
      return;
    }

    //If input validation passes, do this
    if(rows.length == 0) {
      mysql.pool.query("INSERT INTO products (`name`, `quantity`) VALUES (?,?)", 
                      [req.body.name, req.body.quantity], function(err, result) {
          if(err) {
            next(err);
            return;
          }

          const resources = Object.entries(req.body);

          for(x in resources) {

            //Make sure key isnt name or quantity, also dont insert when resource[x][1] = ""(means none of that type)
            if(resources[x][0] != "name" && resources[x][0] != "quantity" && resources[x][1] != "") {
              mysql.pool.query(`INSERT INTO resource_product(productId, resourceId, resource_quantity)` +
                              `VALUES ((SELECT id FROM products WHERE name = "${req.body.name}"),` +
                                      `(SELECT id FROM resources WHERE name = "${resources[x][0]}"), ?)`,
                                        [resources[x][1]], function(err, result) {
                   if(err) {
                    next(err);
                    return;
                  }
              });
            }
          }
        });
    }
    else {
      inputPassed = "false"
    }
   res.redirect('/list?valid=' + inputPassed);
  });
});

app.get('/reset-resources-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS resources", function(err){
      var createString = "CREATE TABLE resources(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "quantity INT NOT NULL)"; 
      mysql.pool.query(createString, function(err){
        res.redirect('/list');
      })
    });
  });

  app.get('/reset-products-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS products", function(err){
      var createString = "CREATE TABLE products(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "quantity INT NOT NULL)"; 
      mysql.pool.query(createString, function(err){
        res.redirect('/list');
      })
    });
  });

  app.get('/reset-resource-product-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS resource_product", function(err){
      var createString = "CREATE TABLE resource_product(" +
      "productId INT," +
      "resourceId INT," +
      "resource_quantity INT NOT NULL," +
      "PRIMARY KEY (productId, resourceId)," +
      "FOREIGN KEY (productId) REFERENCES products(id)" +
         "ON DELETE CASCADE," + 
      "FOREIGN KEY (resourceId) REFERENCES resources(id)" +
         "ON DELETE CASCADE)"; 
      mysql.pool.query(createString, function(err){
        res.redirect('/list');
      })
    });
  });


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});