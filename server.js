'use strict';

var express = require('express');
const path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');
var apiRoutes = require('./routes/api.js');
var app = express();
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
var port = process.env.PORT || 3000;
var hbs = require('./handler');
const helmet = require('helmet');
const session = require('express-session');
const Book = require('./models/Book');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

app.use(cors());

// Express Handlebars
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express Sessions
app.use(
  session({
    secret: 'secretKey',
    saveUninitialized: false,
    resave: false
  })
);

//Index page (static HTML)
app.route('/').get(function(req, res) {
  let msg = req.session.msg ? req.session.msg : '';
  req.session.msg = null;
  res.render('index', {
    msg
  });
});

app.route('/books').get(async function(req, res) {
  let books = await Book.find();
  if (!books.length > 0) {
    books = '';
  }
  res.render('books', {
    books
  });
});

app.route('/:id').get(async function(req, res) {
  let book = req.session.book ? req.session.book : '';
  if (!req.session.book) {
    try {
      await Book.findById(req.params.id).then(user => {
        if (user) {
          console.log('book', book);
          book = user;
        }
      });
    } catch {
      book = '';
    }
  }

  req.session.book = null;
  res.render('book', {
    book
  });
});

app.route('/api/comments/:id').post(function(req, res) {
  Book.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: req.body.comment } },
    { new: true }
  )
    .then(book => {
      res.status(201).json(book);
    })
    .catch(err => {
      next(err);
    });
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/404.html'));
});

//Start our server and tests!
app.listen(port, function() {
  console.log('Listening on port ' + port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
