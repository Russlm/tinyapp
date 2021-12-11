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

console.log(searchEmail('user2@example.com'))