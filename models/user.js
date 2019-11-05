var user = function(userId,firstName,lastName,email,password,address,city,state,zipcode,country){
  userModel = {
    userId : userId,
    firstName : firstName,
    lastName : lastName,
    email : email,
    password:password,
    address:address,
    city:city,
    state:state,
    zipcode:zipcode,
    country:country
  }
  return userModel;
}

module.exports.user = user;
