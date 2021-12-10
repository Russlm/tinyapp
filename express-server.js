//REQUIRE

//#region
const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

//#endregion

//SERVER CONFIG.

//#region
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set('view engine', 'ejs');

//#endregion


//DATABASES.

//#region
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

//randomization code.
const generateRandomID = () => {
  return Math.random().toString(36).slice(7)
}

//#endregion


// Testing Paths:

//#region
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

//#endregion


// GET REQUESTS ////

//#region

//show all links. 

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = { 
    user: userId, // -> object with id: value, password: value, email: vlaue 
    urls: urlDatabase, 
  };
  console.log('get urls', users[req.cookies["user_id"]])
  console.log('templateVars being sent', templateVars)
  res.render('urls_index', templateVars);
});


//create a new link.

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = { 
    user: userId, // -> object with id: value, password: value, email: vlaue 
    urls: urlDatabase, 
  };
  res.render("urls_new", templateVars);

});

//register.

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["user_id"],
  };
  res.render("register", templateVars);
});


//show an individual link. 

app.get('/urls/:shortURL', (req, res)=> {
  // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] 
  const userId = req.cookies["user_id"] 
  const templateVars = { 
    user: userId, // -> object with id: value, password: value, email: vlaue 
    urls: urlDatabase, 
  };
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

//#endregion 


//POST REQUESTS 

//#region

//works w /new client side; adds new entry to the database.
app.post("/urls", (req, res) => {
  const newUserID = generateRandomID();
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[newUserID] = req.body.longURL
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

//delete a url.
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

//login.
app.post("/login", (req, res) => {
  console.log(req.body.username)
  res.cookie('user_id', req.body[user_id])
  res.redirect('/urls')
});

//register.
app.post("/register", (req, res) => {
  const newUserID = generateRandomID();
  console.log(newUserID)
  users[newUserID] = {
    id: newUserID, 
    email: req.body.email, 
    password: req.body.password,
  }
  res.cookie('user_id', newUserID); 
  console.log(users);
  res.redirect('/urls');
});

//edit a link.

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL; 
  console.log('incoming params',shortURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls')
});

//#endregion


//SERVER OPERATION 

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//OLD TEST CODE.

//#region

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

// app.get('/u/:shortURL', (req, res)=> {
//   // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
//   let shortURL = req.params.shortURL;
//   let longURL = urlDatabase[shortURL]
//   const templateVars = {
//     uusername: req.cookies["user_id"],
//     user: users[req.cookies["user_id"]],
//     shortURL: shortURL,
//     longURL: longURL,
//   }
//   res.render('urls_show', templateVars);
//   // res.end('This is our test string.' + shortURL)
// });

//#endregion

