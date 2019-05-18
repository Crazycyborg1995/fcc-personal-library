const mongoose = require('mongoose');

let BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: [String],
    min: 1,
    max: 500
  }
});

// BookSchema.static('findAll', function() {
//   return this.aggregate([
//     {
//       $project: {
//         title: 1,
//         commentcount: { $size: '$comments' }
//       }
//     }
//   ])
//     .then(books =>
//       books.map(book => {
//         return Object.assign({}, book, { title });
//       })
//     )
//     .catch(err => console.log(err));
// });

module.exports = mongoose.model('Book', BookSchema);
