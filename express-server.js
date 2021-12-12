//REQUIRES.

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
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// urlDatabase[shortURL].longURL how to do this 
// how do i use userid in the urlDatabase

const urlDatabase = {
    b6UTxQ: {
        longURL: "https://www.tsn.ca",
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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
//#endregion

//HELPER FUNCTIONS. 

//#region

//randomization code.
const generateRandomID= () => {
  return Math.random().toString(36).slice(7)
}

const searchEmail= (email) => {
  data = Object.values(users);
  console.log('database input into the searchEmail fn:', data);
  for (let element of data) {
    console.log("element email is", element.email)
    console.log("compared email is", email)
    if(email === element.email) {
      return true;
    }
  }
  return false;
}

const getIDByEmail = (email) => {
  data = Object.values(users);
  console.log('database input into the getIDByEmail fn:',data);
  for (let element of data) {
    console.log("element email is", element.email)
    console.log("compared email is", email)
    if(email === element.email) {
      return element;
    }
  }
  return false;
}

const passwordCheck = (id, password) => {
  if(password === id.password) {
    return true;
  }
  return false;
}

const keysforUser = (userID) => {
  const shortURL =Object.keys(urlDatabase);
  const output = {};
  for (shortURL in urlDatabase) {
    if (shortURL.userID === userID) {
      output(userID) = shortURL;
    }
  }
}

const shortURLsforUser = (userID) => {
  // const shortURL =Object.keys(urlDatabase);
  const output = {};
  for (let shortURL in urlDatabase) {
    console.log(shortURL)
    console.log('userid is ', )
    if (urlDatabase[shortURL].userID === userID) {
      output[shortURL] = urlDatabase[shortURL].longURL;
      console.log('shortURL is', shortURL, 'output now is', output)
    }
  }
  return output
}
//#endregion

//DEV GET REQUESTS:

//#region

//Prints out the URL Database. 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Prints out the User Database.
app.get("/users.json", (req, res) => {
  res.json(users);
});

//Sends User Hello.
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Sends User Hello Word.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//#endregion


// GET REQUESTS ////

//#region

//show all links. 

app.get("/urls", (req, res) => {
  console.log('cookie data working with in urls',req.cookies['email'])
  const user = users[req.cookies["user_id"]]
  const personalURLs = shortURLsforUser(req.cookies['user_id'])
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: vlaue 
    urls: personalURLs, 
  };
  // if(!req.cookies["user_id"]) {
  //   res.redirect('/login');
  // }
  console.log('templateVars being used by /urls', templateVars)
  res.render('urls_index', templateVars);
});


//create a new link.

app.get("/urls/new", (req, res) => {//--> use recieved cookie here. (userid.)
  console.log('/urls/new')
  const user = users[req.cookies["user_id"]] //-> take recieved cookie and find object.
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: vlaue 
    urls: urlDatabase, 
  };
  if(!req.cookies["user_id"]) {
    res.redirect('/login');
  }
  console.log('templateVars being sent from urls/new', templateVars);
  res.render("urls_new", templateVars);

});

//register.

app.get("/register", (req, res) => {
  const templateVars = {
    userId: req.cookies["user_id"],
    user: users[req.cookies["user_id"]]
  };
  console.log('/register req.cookies =', req.cookies["user_id"])
  if(req.cookies["user_id"]) {
    res.redirect('/urls');
  }
  console.log('templateVars being sent from urls/new', templateVars);
  console.log('newly issued login cookie from /register:', req.cookies)
  res.render("register", templateVars);
});

//login.

app.get("/login", (req, res) => {
  const templateVars = {
    userID: req.cookies["user_id"],
    user: users[req.cookies["user_id"]]
  };
  if(req.cookies["user_id"]) {
    res.redirect('/urls');
  }
  console.log('templateVars being sent from /login', templateVars)
  res.render("login", templateVars);
});

//show an individual link. 

app.get('/urls/:shortURL', (req, res) => {
  // res.send('You requested to see ' + urlDatabase[req.params.shortURL])
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] 
  const user = users[req.cookies["user_id"]] 
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: vlaue 
    urls: urlDatabase,
    longURL,
    shortURL 
  };
  console.log('cookie sourced userID:', req.cookies["user_id"])
  console.log('user object:', users[req.cookies["user_id"]])
  console.log('templateVars being sent', templateVars)
  res.render('urls_show', templateVars);
  // res.end('This is our test string.' + shortURL)
});

//#endregion 


//POST REQUESTS 

//#region

//works w /new client side; adds new entry to the database.
app.post("/urls", (req, res) => {
  const newUserID = generateRandomID();
  if(!req.cookies["user_id"]) {
    res.status(403);
    res.send('invalid path. please login.')
  }

  urlDatabase[newUserID] = {longURL: req.body.longURL, userID: req.cookies["user_id"]}
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

//delete a url.
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

//login.
app.post("/login", (req, res) => {
  console.log('candidate email is: ', req.body.email)
  console.log('candidate password is: ', req.body.password)
  const isValidEmail = searchEmail(req.body.email);
  const userID = getIDByEmail(req.body.email);
  if(isValidEmail) {
    if(passwordCheck(userID, req.body.password)) {
      res.cookie('user_id', userID.id);
      res.redirect('/urls');
    } else {
      res.status(403)
    res.send('invalid password. ')
    }
  } else {
    res.status(403)
    res.send('invalid email.')
  }

});

//logout. 

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
  console.log(req.body.email);
});

//register.
app.post("/register", (req, res) => {
  const newUserID = generateRandomID();
  console.log(newUserID)
  if(!req.body.password || !req.body.email) {
    res.status(400);
    res.send('Please make sure email or password are filled out correctly. 🤨');
  }

  // if email matches email in database. 
  if(searchEmail(req.body.email)) {
    res.status(400);
    res.send('Email in use. 😅')
  }
  users[newUserID] = {
    id: newUserID, 
    email: req.body.email, 
    password: req.body.password,
  }
  res.cookie('user_id', newUserID); 
  console.log(users);
  res.redirect('/urls');
});

//show and edit a link. --> related to urls_show.ejs

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL; 
  console.log('incoming params',shortURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls')
});

//#endregion


//SERVER INITIALIZATION: 

//#region

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//#endregion



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

