let url = '/api/books';
let addBook = document.getElementById('add-book');
let deleteBook = document.getElementById('delete-book');
let deleteBooks = document.getElementById('delete-btn');
let searchBook = document.getElementById('search-book');
let addComment = document.getElementById('add-comment');

// ADD BOOK
if (addBook) {
  addBook.addEventListener('submit', e => {
    e.preventDefault();
    let title = document.getElementById('title').value;
    document.getElementById('title').value = '';
    if (!title) {
      return null;
    }
    // let data = {
    //   title
    // };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(book => {
        if (book._id) {
          window.location = `api/books/${book._id}`;
        } else {
          window.location = '/';
        }
      });
  });
}

// DELETE BOOK BY ID
if (deleteBook) {
  deleteBook.addEventListener('submit', e => {
    e.preventDefault();
    let id = document.getElementById('id').value;
    document.getElementById('id').value = '';
    if (!id) {
      return null;
    }
    fetch(url + `/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.msg) {
          window.location = '/';
        }
      });
  });
}

// DELETE ALL BOOKS
if (deleteBooks) {
  deleteBooks.addEventListener('click', e => {
    fetch(url, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        window.location = '/books';
      });
  });
}

// SEARCH BOOK
if (searchBook) {
  searchBook.addEventListener('submit', e => {
    e.preventDefault();
    let id = document.getElementById('search').value;
    if (id) {
      window.location = `/api/books/${id}`;
    }
  });
}

// POST COMMENT
if (addComment) {
  addComment.addEventListener('submit', e => {
    e.preventDefault();
    let id = document.getElementById('book-id').textContent.split(' : ')[1];
    let comment = document.getElementById('comment').value;
    fetch('/api/comments/' + id, {
      method: 'POST',
      body: JSON.stringify({ comment }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        window.location = `/${id}`;
      });
  });
}
