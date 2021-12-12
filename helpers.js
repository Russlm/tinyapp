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

//randomization code.
// const generateRandomID= () => {
//   return Math.random().toString(36).slice(7)
// }

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

const urlsForUser = (userID) => {
  // const shortURL =Object.keys(urlDatabase);
  const output = [];
  for (key in urlDatabase) {
    if (urlDatabase[key].userID === userID) {
      output.push(key);
    }
  }
  return output
}

const userURLObjects = (userID) => {
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



console.log(searchEmail('user2@example.com'))
console.log(getIDByEmail('user2@example.com'))

console.log(userURLObjects("user2RandomID"))
console.log(urlsForUser("user2RandomID"))
const generateRandomID= () => {
  function randomString(anysize, charset) {
     let res = '';
     while (anysize--) res += charset[Math.random() * charset.length | 0];
     return res;
   }
   return randomString(6,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
 }

console.log(typeof generateRandomID())
// console.log(urlDatabase['b6UTxQ'].userID)

module.exports = {
  generateRandomID,
  searchEmail,
  getIDByEmail,
  passwordCheck,
  urlsForUser,
  userURLObjects,
  getIDByEmail
}