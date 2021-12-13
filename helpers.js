const generateRandomID = () => {
  const randomString = (anysize, charset) => {
    let res = '';
    while (anysize--) res += charset[Math.random() * charset.length | 0];
    return res;
  };
  return randomString(6,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
};

const getIDByEmail = (email,database) => {
  let data = Object.values(database);
  for (let element of data) {
    console.log(email);
    console.log(element.email);
    if (email === element.email) {
      return element;
    }
  }
  return false;
};
const searchID = (email,database) => {
  let data = Object.values(database);
  for (let element of data) {
    if (email === element.email) {
      return element.id;
    }
  }
  return false;
};

const passwordCheck = (id, password) => {
  if (password === id.password) {
    return true;
  }
  return false;
};

const urlsForUser = (userID, database) => {
  const output = [];
  for (let key in database) {
    if (database[key].userID === userID) {
      output.push(key);
    }
  }
  return output;
};

const userURLObjects = (userID, database) => {
  const output = {};
  for (let shortURL in  database) {
    if (database[shortURL].userID === userID) {
      output[shortURL] =  database[shortURL].longURL;
    }
  }
  return output;
};

//#endregion

// console.log(searchEmail('user2@example.com'))
// console.log(getIDByEmail('user2@example.com'))

// console.log(userURLObjects("user2RandomID"))
// console.log(urlsForUser("user2RandomID"))


// console.log(typeof generateRandomID())
// console.log(urlDatabase['b6UTxQ'].userID)

module.exports = {
  generateRandomID,
  getIDByEmail,
  passwordCheck,
  urlsForUser,
  userURLObjects,
  searchID,
};