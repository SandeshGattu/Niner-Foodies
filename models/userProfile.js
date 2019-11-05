var userProfile = function(userId, userItems){

  this.userId = userId;
  this.userItems = userItems;


  this.addItem = function(userItem){
    console.log("Add userItem in:");
    this.userItems.push(userItem);
  };


  this.removeItem = function(itemCode){
    console.log("Removing userItem:");
    for(var i=0;i<this.userItems.length;i++){
      if(itemCode == this.userItems[i].item.itemCode){
        this.userItems.splice(i,1);
        break;
      }
    }
  };


  this.updateItem = function(userItem){
    console.log("Update userItem",userItem.item.itemCode);
    for(var i = 0; i < this.userItems.length; i++ ){
      console.log("You are in updateItem forloop: ",this.userItems[i].item.itemCode);
      if(userItem.item.itemCode == this.userItems[i].item.itemCode){
        this.userItems[i].item = userItem.item;
        this.userItems[i].rating = userItem.rating;
        this.userItems[i].madeIt = userItem.madeIt;
      }
    }
  };


  this.getItems = function(){
    return this.userItems;
  };


  this.emptyProfile = function(){
    console.log("Empty the profile");
    this.user = null;
    this.userItems = null;
  };
}

module.exports = userProfile;
