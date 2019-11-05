var express = require('express');
var app = module.exports = express();
var itemModel = require('../models/itemDB.js');
var userDBModel = require('../models/userDB.js');
var userItemModel = require('../models/userItem.js');
var userProfileModel = require('../models/userProfile.js');

const path = require('path');

app.set('views', path.join(__dirname, '../views'));
app.set('view engine','ejs');

app.get('/myItems',async function(req,res){

  try{


    var theUser = req.session.theUser;
    if( theUser == undefined){

      res.render('myItems', {
          userId: "",
          userItems: "",
          username : ""
      });

    }

      else if(theUser != null || theUser != undefined){
        var user = req.session.theUser;
        req.session.currentUserProfile =await userDBModel.getUserProfile(user.userId);
        var currentUserProfile = req.session.currentUserProfile;
        var action = req.query.action;

        if(action == undefined){
          res.render('myItems',{
            success:true,
            userId: user.userId,
            username: user.firstName + " " + user.lastName,
            userItems: currentUserProfile.userItems
          });
        }
        else if(action == "delete"){
          var itemCode = req.query.itemCode;
          console.log("In delete action : ",itemCode);

          await userDBModel.removeItem(user.userId,itemCode);
          res.redirect('/myItems');
        }

        else if(action == "save"){
          var itemCode = req.query.itemCode;
          console.log("In SAVE action : ",itemCode);
          var itemPresent = false;
          var itemPresentInRated = false;

          for(var i=0; i< req.session.currentUserProfile.userItems.length; i++){
            if(req.session.currentUserProfile.userItems[i].item.itemCode === itemCode){

              console.log("item already present!!");
              itemPresent= true;
            }
          }


          if(!itemPresent){
            var item =await itemModel.getItem(itemCode);
            var ratedItems = await userDBModel.getUserRatedItems(user.userId);
            var itemPresent = false;
            var userItem = null;
            for(var j=0; j< ratedItems.length; j++){
              if(ratedItems[j].item.itemCode == itemCode){
                itemPresent = true;
                var itemInclude = [];
                itemInclude[0] = ratedItems[j].item;
                userItem =  userItemModel.userItem(itemInclude,ratedItems[j].rating,ratedItems[j].madeIt);
                console.log("item present!!: ",userItem);
                await userDBModel.removeUserRatedItems(user.userId,itemCode);
              }
            }
            if(!itemPresent){
              userItem = userItemModel.userItem(item,0,"No");
            }

            await userDBModel.addItem(user.userId, userItem);
          }
          res.redirect('/myItems');
          }
      }
  }
  catch(err){
    console.log("in items error: ");
    console.log(err);
  }

  })
  .get('/myItems',async function(req, res){

    try{


      var theUser = req.session.theUser;
      if( theUser == undefined){

        res.render('myItems', {
            userId: "",
            userItems: "",
            username : ""
        });

      }

        else if(theUser != null || theUser != undefined){
          var user = req.session.theUser;
          req.session.currentUserProfile =await userDBModel.getUserProfile(user.userId);
          var currentUserProfile = req.session.currentUserProfile;
          var action = req.query.action;
          var ratedItems = await userDBModel.getUserRatedItems(user.userId);
          console.log("in rate items : user defined",ratedItems);
          var userItems = [];
          if(ratedItems != null){
            var userItems = ratedItems;
          }
          if(action == undefined){
            res.render('myItems',{
              success:true,
              userId: user.userId,
              username: user.firstName + " " + user.lastName,
              userItems: userItems
            });
          }
        }
    }
    catch(err){
      console.log("in items error: ");
      console.log(err);
    }

  });
