const bcrypt = require('bcryptjs');


const generateRandomID= () => {
  function randomString(anysize, charset) {
     let res = '';
     while (anysize--) res += charset[Math.random() * charset.length | 0];
     return res;
   }
   return randomString(6,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
 }

const searchEmail= (email,database) => {
  data = Object.values(database);
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

const getIDByEmail = (email,database) => {
  data = Object.values(database);
  console.log('database input into the getIDByEmail fn:',data);
  for (let element of data) {
    console.log("element email is", element.email)
    console.log("compared email is", email)
    if(email === element.email) {
      console.log('element is', element )
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

const urlsForUser = (userID, database) => {
  // const shortURL =Object.keys( database);
  const output = [];
  for (key in urlDatabase) {
    if ( database[key].userID === userID) {
      output.push(key);
    }
  }
  return output
}

const userURLObjects = (userID, database) => {
  // const shortURL =Object.keys( database);
  const output = {};
  for (let shortURL in  database) {
    console.log(shortURL)
    console.log('userid is ', )
    if ( database[shortURL].userID === userID) {
      output[shortURL] =  database[shortURL].longURL;
      console.log('shortURL is', shortURL, 'output now is', output)
    }
  }
  return output
}

//#region

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

//#endregion

// console.log(searchEmail('user2@example.com'))
// console.log(getIDByEmail('user2@example.com'))

// console.log(userURLObjects("user2RandomID"))
// console.log(urlsForUser("user2RandomID"))


// console.log(typeof generateRandomID())
// console.log(urlDatabase['b6UTxQ'].userID)

module.exports = {
  generateRandomID,
  searchEmail,
  getIDByEmail,
  passwordCheck,
  urlsForUser,
  userURLObjects,
}