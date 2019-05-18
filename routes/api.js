'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
const Book = require('./../models/Book');

// Basic Config
require('dotenv').config({ path: 'process.env' });

let env = process.env.NODE_ENV || 'production';

if (env === 'development') {
  process.env.MONGODB_URI = process.env.MONGODB_LOCAL;
  console.log('Logged in.........');
} else if (env === 'production') {
  process.env.MONGODB_URI = `mongodb+srv://afsal:${
    process.env.PASSWORD
  }@test-bxj9a.mongodb.net/test?retryWrites=true`;
}

// DB Config
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log('connected on mongodb server'))
  .catch(err => console.log(err));

module.exports = function(app) {
  app
    .route('/api/books')
    .get(async function(req, res) {
      await Book.find()
        .then(books => {
          res.status(200).json(books);
        })
        .catch(err => res.status(404).json({ msg: 'Not Found' }));
    })

    .post(async function(req, res) {
      let title = req.body.title;
      const book = await Book.findOne({ title: title });
      if (book) {
        req.session.msg = 'Title already exists';
        return res.status(200).json({ msg: 'Title already exists' });
      }
      let newBook = new Book({
        title
      });
      newBook
        .save()
        .then(user => {
          if (user) {
            return res.status(201).json(user);
          }
        })
        .catch(err =>
          res.status(400).json({ msg: 'Failed to save. Try again' })
        );
    })

    .delete(function(req, res) {
      Book.remove()
        .then(doc => {
          if (doc) {
            res.status(200).json({ msg: 'successfully deleted' });
          }
          res.status(404).json({ msg: 'Something went wrong' });
        })
        .catch(err => res.status(401).json(err));
    });

  app
    .route('/api/books/:id')
    .get(function(req, res) {
      let { id } = req.params;
      Book.findById(id)
        .then(user => {
          if (user) {
            req.session.book = user;
          }
          res.redirect(`/${id}`);
        })
        .catch(err => res.status(401).json({ msg: 'Invalid ID' }));
    })

    .post(function(req, res) {
      let { id } = req.params;
      Book.findById(id)
        .then(user => {
          if (user) {
            req.session.book = user;
          }
          res.redirect(`/${id}`);
        })
        .catch(err => res.status(401).json({ msg: 'Invalid ID' }));
    })

    .delete(function(req, res) {
      let id = req.params.id;
      Book.findByIdAndDelete(id)
        .then(user => {
          if (user) {
            req.session.msg = 'Successfully deleted';
            res.status(200).json({ msg: 'Successfully deleted' });
          }
          req.session.msg = 'ID not found';
          res.status(200).json({ msg: 'ID not found' });
        })
        .catch(err => {
          req.session.msg = 'Invalid ID';
          res.status(400).json({ msg: 'Invalid ID' });
        });
    });
};
