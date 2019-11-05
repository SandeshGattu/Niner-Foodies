var userItem = function(item,rating,madeIt){

  userItemModel = {
    item : item,
    rating : rating,
    madeIt : madeIt
  }
  return userItemModel;
}


userItem.prototype.getItem = function(){
  return this.item;
}
userItem.prototype.getrating = function(){
  return this.rating;
}
userItem.prototype.getMadeIt = function(){
  return this.madeIt;
}



userItem.prototype.setItem = function(item){
  this.item = item;
}
userItem.prototype.setrating = function(rating){
  this.rating = rating;
}
userItem.prototype.setMadeIt = function(madeIt){
  this.madeIt = madeIt;
}

module.exports.userItem = userItem;
