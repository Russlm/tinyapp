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

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "user2RandomID"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "user2RandomID"
  }
};

const searchEmail= (email) => {
  let data = Object.values(users);
  console.log(data);
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
  console.log(data);
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

const generateRandom= () => {
  return Math.random().toString(36).slice(6)
}


// console.log(searchEmail('user2@example.com'))
// console.log(getIDByEmail('user2@example.com'))

console.log(shortURLsforUser("user2RandomID"))
// console.log(urlDatabase['b6UTxQ'].userID)