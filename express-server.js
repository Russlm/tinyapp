//REQUIRE
const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");


//SERVER CONFIG.
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set('view engine', 'ejs');

//DATABASES.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// const newUserID = generateRandomID();

// Testing Paths:

//Prints out the Databases. 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//SENDS USER HELLO
app.get("/", (req, res) => {
  res.send("Hello!");
});

// SENDS USER STANDARD HELLO WORLD 
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// GET REQUESTS 


//SENDS USERS THE URLS DATABASE 
app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase, 
  };
  res.render('urls_index', templateVars);
});

//THIS IS THE SHOW A TINY LINK FUNCTIONALITY 
app.get('/u/:shortURL', (req, res)=> {
  // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]
  const templateVars = {
    username: req.cookies["username"],
    shortURL: shortURL,
    longURL: longURL,
  }
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

//ALT TINY LINK FUNCTIONALITY
app.get('/urls/:shortURL', (req, res)=> {
  // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]
  const templateVars = {
    username: req.cookies["username"],
    shortURL: shortURL,
    longURL: longURL,
  }
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

// register 
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});

//ROUTES THAT UPDATE INFORMATION

//POST REQUESTS 

//works w /new client side; adds new entry to the database.
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[req.body.shortURL] = req.body.longURL
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

//delete a url.
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

//login 
app.post("/login", (req, res) => {
  console.log(req.body.username)
  res.cookie('username', req.body.username)
  res.redirect('/urls')
});

// register 
app.post("/register", (req, res) => {
  users["userRandom3ID"] = {
    id: req.body.username, 
    email: req.body.email, 
    password: req.body.password,
  }

  console.log(users)
  res.redirect('/urls');
});

//EDIT A LINK
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL; 
  console.log('incoming params',shortURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls')
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//update a url.

//FIRST ATTEMPT:
// app.post("/urls/:id", (req, res) => {
//   console.log(req.body);  // Log the POST request body to the console
//   urlDatabase["abc"] = req.body.longURL
//   res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
// });

// app.post("/urls/:shortURL/edit", (req, res) => {
//   console.log(req.body);  // Log the POST request body to the console
//   let shortURL = req.body.shortURL
//   urlDatabase[req.body.shortURL] = req.body.longURL
//   res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
// });