var express = require('express');
var app = express();
var itemDBModel = require('./itemDB');
var userModel = require('./user');
var userItemModel = require('./userItem');
var userProfileModel = require('./userProfile');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fooddata',{ useNewUrlParser: true },function(err){
  if(err) throw err;
  console.log("MongoDB Successfully connected!!");
});

var userSchema = mongoose.Schema({
  userId : {type:String, required:true, unique: true},
  firstName : String,
  lastName : String,
  email : String,
  password: String
},
{collection:'userData'});

var userItemSchema = mongoose.Schema({
  userId:{type:String, required:true},
  item : {
    itemCode:{type:String, required:true},
    itemName:String,
    itemCategory:String,
    itemDescription:String,
    itemRating:Number,
    itemImgUrl:String,
  },
  rating : String,
  madeIt : String
},{collection:'userItemData'});
var userRatedItemsSchema = mongoose.Schema({
  userId:{type:String, required:true},
  item : {
    itemCode:{type:String, required:true},
    itemName:String,
    itemCategory:String,
    itemDescription:String,
    itemRating:Number,
    itemImgUrl:String,
  },
  rating : String,
  madeIt : String
},{collection:'userRatedItemsData'});


var user = mongoose.model('userData',userSchema);
var userItem = mongoose.model('userItemData',userItemSchema);
var userRatedItems = mongoose.model('userRatedItemsData',userRatedItemsSchema);


exports.getUsers = async function(){
  console.log("in get users");
  var usr=null;
  await user.find(function(err, data){
    if(err) {
      throw err;
    }
    else{
      usr = data;
    }
  });
  return usr;
}

exports.getUser = async function(id){
  console.log("in get user");
  var usr=null;
  await user.find({'userId':id},function(err, data){
    if(err) {
      throw err;
    }
    else{
      usr = data;
    }
  });
  return usr;
}

exports.getUserProfile =async function(userId){
  if(userItem){
      console.log(await userItem.find({"userId": userId}));
      return new userProfileModel(userId, await userItem.find({"userId": userId}));

  }
}

exports.removeItem = async function(userId,itemCode){
  console.log("You are in removeItem userDB");
  if(userItem){
    console.log(userId+" : "+itemCode);
    var item =await userItem.find({'userId':userId, 'item.itemCode':itemCode}).remove();
  }
}

exports.addItem = async function(userId, uItem){
  console.log("in addItem userDB",uItem.item[0].sellerId);
  if(userItem){
    console.log(userId+" : "+uItem);
    var item = new userItem({
      'userId' : userId,
      'item' : {
        'itemCode':uItem.item[0].itemCode,
        'itemName':uItem.item[0].itemName,
        'itemCategory':uItem.item[0].itemCategory,
        'itemDescription':uItem.item[0].itemDescription,
        'itemRating':uItem.item[0].itemRating,
        'itemImgUrl':uItem.item[0].itemImgUrl,

      },
      'rating' : uItem.rating,
      'madeIt' : uItem.madeIt
    });
    await item.save(function(err){
      if(err) console.log(err);
      console.log("userItem saved successfully!!");
    });
  }
}

exports.updateItem = async function(userId, uItem){
  console.log("in updateItem userDB");
  if(userItem){
    console.log(userId+" : "+uItem);
    await userItem.update({'userId':userId, 'item.itemCode':uItem.item[0].itemCode},{'rating' :uItem.rating,'madeIt' :uItem.madeIt},function(err,data){
      if(err) console.log(err);
      console.log("Data modified: ",data.nModified);
      console.log("userItem updated successfully!!");
    });
  }
}
exports.getUserRatedItems = async function(userId){
  if(userRatedItems){
    console.log("in userRatedItems!!!",userId);
    var ratedItems = null;
    await userRatedItems.find({'userId':userId},function(err, data){
      if(err){
        console.log(err);
      }
      else{
        ratedItems = data;
      }
    });
    return ratedItems;
  }
}

exports.removeUserRatedItems = async function(userId, itemCode){
  if(userRatedItems){
    await userRatedItems.remove({'userId':userId,'item.itemCode':itemCode});
  }
}

exports.addUserRatedItem = async function(userId, uItem){
  if(userRatedItems){
    await userRatedItems.findOneAndUpdate({'userId':userId,'item.itemCode':uItem.item[0].itemCode},{
      'userId' : userId,
      'item' : {
        'itemCode':uItem.item[0].itemCode,
        'itemName':uItem.item[0].itemName,
        'itemCategory':uItem.item[0].itemCategory,
        'itemDescription':uItem.item[0].itemDescription,
        'itemRating':uItem.item[0].itemRating,
        'itemImgUrl':uItem.item[0].itemImgUrl,

      },
      'rating' : uItem.rating,
      'madeIt' : uItem.madeIt
    },{upsert:true},function(err,data){
      if(err) console.log(err);
      else console.log("successfully updated the rating!!");
    });
}
}
