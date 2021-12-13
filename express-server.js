//REQUIRES.

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')
const  {
  generateRandomID,
  getIDByEmail,
  urlsForUser,
  userURLObjects,
} = require('./helpers')

//SERVER CONFIG.
 
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['key1337'],
}));

//DATABASES.

const urlDatabase = {
    b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "userRandomID"
    },
    asdf3D: {
        longURL: "https://reddit.com",
        userID: "userRandomID"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "userRandomID"
    }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync( "purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
}
 
// ------ WEBPAGE ROUTES: ------- //

//Redirects "/" to /urls.
app.get("/", (req, res) => {
  if(!req.session.user_id) {

    res.redirect('/login')
  }
  res.redirect('/urls')
});



// does tinyURL to longURL redirection.
app.get('/u/:id', (req, res) => {
  const id = req.params.id;
  if(!urlDatabase[id]) {
    res.status(404);
    res.send("Error 404: Page not Found.")
  }
  res.redirect(urlDatabase[id].longURL);
});
 

// /urls GET and POST Routes. 

// /urls GET route.
app.get("/urls", (req, res) => {
  const user = users[req.session.user_id]
  const personalURLs = userURLObjects(req.session.user_id, urlDatabase)
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: value 
    urls: personalURLs, 
  };
  if(!req.session.user_id) {
    res.status(403);
    res.send("Error 403: Please Login or Register First.")
  }
  res.render('urls_index', templateVars);
});

// /urls POST route.
app.post("/urls", (req, res) => {
  const newLink = generateRandomID();
  if(!req.session.user_id) {
    res.status(403);
    res.send('invalid path. please login.')
  }
  if(req.body.longURL) {
    // res.status(403);
    // res.send('please fill in the url field.')
    console.log('longurl is is true')
  }

  urlDatabase[newLink] = {longURL: req.body.longURL, userID: req.session.user_id}
  res.redirect("/urls"); 
});

// /urls/new GET route.
app.get("/urls/new", (req, res) => {//--> use recieved cookie here. (userid.)
  const user = users[req.session.user_id] //-> take recieved cookie and find object.
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: vlaue 
    urls: urlDatabase, 
  };
  if(!req.session.user_id) {
    res.redirect('/login');
  }
  res.render("urls_new", templateVars);

});

 

// /urls/new GET and POST routes.

// /register GET route.
app.get("/register", (req, res) => {
  const templateVars = {
    userId: req.session.user_id,
    user: users[req.session.user_id]
  };
  if(req.session.user_id) {
    res.redirect('/urls');
  }
  res.render("register", templateVars);
});


// /register POST route.
app.post("/register", (req, res) => {
  const newUserID = generateRandomID();
  const userID = getIDByEmail(req.body.email, users)

  //if empty data fields:
  if(!req.body.password || !req.body.email) {
    res.status(400);
    res.send('Please make sure email or password are filled out correctly. 🤨');
  }

  // if email matches email in database: 
  if(userID) {
    res.status(400);
    res.send('Email in use. 😅')
  }
  //create user:
  hashedPassword = bcrypt.hashSync(req.body.password, 10)
  users[newUserID] = {
    id: newUserID, 
    email: req.body.email, 
    password: hashedPassword,
  }
  // req.session.user_id = newUserID;
  req.session.user_id = newUserID; 
  res.redirect('/urls');
});

 

// /login GET and POST routes.


// /login GET route.

app.get("/login", (req, res) => {
  const templateVars = {
    userID: req.session.user_id,
    user: users[req.session.user_id]
  };
  if(req.session.user_id) {
    res.redirect('/urls');
  }
  res.render("login", templateVars);
});


// /login POST route.
app.post("/login", (req, res) => {
  const userID = getIDByEmail(req.body.email, users);
  //if email is correct:
  if(userID) {
    //if password is correct:
    if(bcrypt.compareSync(req.body.password, userID.password)) {
      //issue new cookie.
      req.session.user_id = userID.id;
      res.redirect('/urls');
    } else {
      res.status(403)
    res.send('invalid password. ')
    }
  } else {
    res.status(403)
    res.send('invalid email. Maybe look at the register page instead?')
  }

});

// /logout POST route. Used in the Header bar Logout button.

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


// /urls/:shortURL GET and POST routes.

// /urls/:shortURL GET route.
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const personalURLs = userURLObjects(req.session.user_id, urlDatabase) 
  const user = users[req.session.user_id] 
  if(!req.session.user_id) {
    res.status(403);
    res.redirect('/urls');
  }
  if(!urlDatabase[shortURL]) {
    res.status(403);
    res.send("Please make a shortURL before trying to view it.");
  }
  if(urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403)
    res.send("Verboten. Don't change someone else's links.")
  }
  
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: vlaue 
    shortURL,
    personalURLs,
  };
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

// /urls/:shortURL POST route.
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if(!req.session.user_id) {
    res.status(403);
    res.redirect('/urls');
  }
  if(!urlDatabase[shortURL]) {
    res.status(403);
    res.send("Error 403: Please make a shortURL before trying to view it.");
  }
  if(urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403)
    res.send("Error 403: Verboten. Don't change someone else's links.")
  }
  if(!req.body.longURL) {
    res.status(403);
    res.send('please fill out the http field.')
  }
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_id}
  res.redirect('/urls')
});

// Delete button route.
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if(urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403);
    res.send("Verboten. Don't change someone else's links.")
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});


//SERVER INITIALIZATION: 
app.listen(PORT, () => {
});