const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

//SENDS URERS THE URLS DATABASE 
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase["abc"] = req.body.longURL
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
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

// app.post("/urls/:shortURL/delete", (req, res) => {
//   let shortURL = req.params.shortURL;
//   let longURL = urlDatabase[shortURL]
//   delete longURL;
// });

app.get('/urls/:shortURL', (req, res)=> {
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





app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});