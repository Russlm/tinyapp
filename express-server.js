//REQUIRES.

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')
const  {
  generateRandomID,
  searchEmail,
  getIDByEmail,
  passwordCheck,
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
 

//HELPER FUNCTIONS. 

//randomization code.

// const generateRandomID= () => {
//   function randomString(anysize, charset) {
//      let res = '';
//      while (anysize--) res += charset[Math.random() * charset.length | 0];
//      return res;
//    }
//    return randomString(6,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
//  }

// const searchEmail= (email) => {
//   data = Object.values(users);
//   console.log('database input into the searchEmail fn:', data);
//   for (let element of data) {
//     console.log("element email is", element.email)
//     console.log("compared email is", email)
//     if(email === element.email) {
//       return true;
//     }
//   }
//   return false;
// }

// const getIDByEmail = (email) => {
//   data = Object.values(users);
//   console.log('database input into the getIDByEmail fn:',data);
//   for (let element of data) {
//     console.log("element email is", element.email)
//     console.log("compared email is", email)
//     if(email === element.email) {
//       return element;
//     }
//   }
//   return false;
// }

// const passwordCheck = (id, password) => {
//   if(password === id.password) {
//     return true;
//   }
//   return false;
// }

// const urlsForUser = (userID) => {
//   // const shortURL =Object.keys(urlDatabase);
//   const output = [];
//   for (key in urlDatabase) {
//     if (urlDatabase[key].userID === userID) {
//       output.push(key);
//     }
//   }
//   return output
// }

// const userURLObjects = (userID) => {
//   // const shortURL =Object.keys(urlDatabase);
//   const output = {};
//   for (let shortURL in urlDatabase) {
//     console.log(shortURL)
//     console.log('userid is ', )
//     if (urlDatabase[shortURL].userID === userID) {
//       output[shortURL] = urlDatabase[shortURL].longURL;
//       console.log('shortURL is', shortURL, 'output now is', output)
//     }
//   }
//   return output
// }
 

//DEV GET REQUESTS:

 

//Prints out the URL Database. 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Prints out the User Database.
app.get("/users.json", (req, res) => {
  res.json(users);
});

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
  // const longURL = urlDatabase[id].longURL;
  console.log('id is:', id)
  if(!urlDatabase[id]) {
    res.status(404);
    res.send("Error 404: Page not Found.")
  }
  console.log('urlDatabase is', urlDatabase)
  console.log('urlDatabase[id] is:', urlDatabase[id])
  res.redirect(urlDatabase[id].longURL);
});
 

// /urls GET and POST Routes. 

// /urls GET route.
app.get("/urls", (req, res) => {
  const user = users[req.session.user_id]
  const personalURLs = userURLObjects(req.session.user_id, urlDatabase)
  const templateVars = { 
    user: user, // -> object with id: value, password: value, email: vlaue 
    urls: personalURLs, 
  };
  if(!req.session.user_id) {
    res.status(403);
    // res.send("Error 403: Please Login or Register First.")
    res.redirect('/login')
  }
  console.log('templateVars being used by /urls', templateVars)
  res.render('urls_index', templateVars);
});

// /urls POST route.
app.post("/urls/new", (req, res) => {
  const newLink = generateRandomID();
  console.log( 'newLink = generateRandomID()', newLink)

  console.log(newLink)
  if(!req.session.user_id) {
    res.status(403);
    res.send('invalid path. please login.')
  }
  
  console.log('urlDatabase before addition is', urlDatabase);
  urlDatabase[newLink] = {longURL: req.body.longURL, userID: req.session.user_id}
  console.log('urlDatabase after addition is', urlDatabase);
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

 

// /urls/new GET route.
  
// /urls/new GET route.
app.get("/urls/new", (req, res) => {//--> use recieved cookie here. (userid.)
  console.log('/urls/new')
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
  console.log('/register req.cookies =', req.session.user_id)
  if(req.session.user_id) {
    res.redirect('/urls');
  }
  console.log('templateVars being sent from urls/new', templateVars);
  console.log('newly issued login cookie from /register:', req.cookies)
  res.render("register", templateVars);
});


// /register POST route.
app.post("/register", (req, res) => {
  const newUserID = generateRandomID();
  console.log(newUserID)

  //if empty data fields:
  if(!req.body.password || !req.body.email) {
    res.status(400);
    res.send('Please make sure email or password are filled out correctly. 🤨');
  }

  // if email matches email in database: 
  if(searchEmail(req.body.email, urlDatabase)) {
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
  console.log(users);
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
  console.log('templateVars being sent from /login', templateVars)
  res.render("login", templateVars);
});


// /login POST route.
app.post("/login", (req, res) => {
  console.log('candidate email is: ', req.body.email)
  console.log('candidate password is: ', req.body.password)
  const isValidEmail = searchEmail(req.body.email, users);
  const userID = getIDByEmail(req.body.email, users);
  //if email is correct:
  if(isValidEmail) {
    //if password is correct:
    if(bcrypt.compareSync(req.body.password, userID.password)) {
      //issue new cookie.
      req.session.user_id = userID.id;
      console.log('req.session.user_id is:', )
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
  console.log(req.body.email);
});


// /urls/:shortURL GET and POST routes.


// /urls/:shortURL GET route.
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const personalURLs = userURLObjects(req.session.user_id, urlDatabase) 
  console.log("personalURLS", personalURLs)
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
  console.log('cookie sourced userID:', req.session.user_id)
  console.log('user object:', users[req.session.user_id])
  console.log('templateVars being sent', templateVars)
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
  console.log(`Example app listening on port ${PORT}!`);
});