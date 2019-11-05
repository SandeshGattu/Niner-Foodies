var express = require('express');
var app = express();
var itemModel = require('./item');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fooddata',{ useNewUrlParser: true },
function(err){
              if(err) throw err;
              console.log("MongoDB connected successfully!!");
});

var itemsSchema = mongoose.Schema({
  itemCode:{type:String, required:true, unique: true},
  itemName:String,
  itemCategory:String,
  itemDescription:String,
  itemRating:Number,
  itemImgUrl:String,
},{collection:'itemsData'});
var items = mongoose.model('itemsData', itemsSchema);

exports.getItems = async function(){
  console.log("In getItems");
  return await items.find();
};

exports.getItem = async function(itemCode){
  console.log("In getItems DB: ",itemCode);
  return await items.find({'itemCode':itemCode});
}

exports.getCategories = async function(){
  console.log("in get categories");
  var listOfCategories = [];
  await items.find(function(err,data){
    if(err){
      throw err;
    }else{
      data.forEach(function(item){
        if(!listOfCategories.includes(item.itemCategory)){
          listOfCategories.push(item.itemCategory);
        }
      });
    }
  });
  console.log(listOfCategories);
  return listOfCategories;
}
