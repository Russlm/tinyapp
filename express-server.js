const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.set('view engine', 'ejs');

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


//SENDS USER HELLO
app.get("/", (req, res) => {
  res.send("Hello!");
});

// SENDS USER STANDARD HELLO WORLD 
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//SENDS USERS THE URLS DATABASE 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render('urls_index', templateVars);
});


app.get('/u/:shortURL', (req, res)=> {
  // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
  }
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//ROUTES THAT UPDATE INFORMATION 

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
  console.log(res.body.username)
  // res.cookie("username" )
  res.redirect('/urls')
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

app.get('/urls/:shortURL', (req, res)=> {
  // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
  }
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL; 
  console.log('incoming params',shortURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls')
});



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});