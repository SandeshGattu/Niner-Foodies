var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var itemModel = require('../models/itemDB.js');
var userDBModel = require('../models/userDB.js');
var userItemModel = require('../models/userItem.js');
var userProfileModel = require('../models/userProfile.js');
var profileController = require('./profileController.js');

router.use(profileController);
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/',function(req,res){
  var username = "";
  if(req.session.theUser != undefined){
    username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
  }
  res.render('index',{username:username});
})
.get('/signIn',function(req,res){
  var username = "";
  if(req.session.theUser != undefined){
    username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
  }
  res.render("login",{username:username,error:""});
})
.post('/login',urlencodedParser, async function(req, res){
  try{
    var error = "";
    var validationError = "";
    var username = "";
    var userId = req.body.userId;
    var password = req.body.password;

    req.check('userId')
    .notEmpty()
    .withMessage('UserID cant be empty');
    req.check('password')
    .notEmpty()
    .withMessage('Password should not be empty!')
    .isLength({ min: 8})
    .withMessage('Password should contains atleast 8 charecters ');

    validationError = req.validationErrors();
    if(validationError){
     res.render("login",{username:username,error:validationError[0].msg});
   }
   else{
     var user = await userDBModel.getUser(userId);
     if(req.session.theUser != undefined){
       username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
     }
     if(user.length == 0){
       error = " wrong UserID";
     }
     else if(user[0].userId != userId || user[0].password != password){
       error = "Incorrect UserId/Password ";
     }
     if(error.length != 0){
       res.render('login',{
         username:username,
         error:error
       });
     }
     else{
       req.session.theUser = user[0];
       req.session.currentUserProfile = await userDBModel.getUserProfile(user[0].userId);
       var currentUserProfile = req.session.currentUserProfile;
       if(req.session.currentUserProfile.length == 0){
         res.render('noData');
       }
       res.redirect("/myItems");
     }
   }

  }
  catch(err){
    console.log("login error: ");
    console.log(err);
  }
})
.get('/signOut', function(req, res){
  req.session.theUser = undefined;
  req.session.currentProfile = undefined;
  res.redirect("/");
})
.get('/register',function(req,res){
  var username = "";
  if(req.session.theUser != undefined){
    username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
  }
  res.render('register',{username:username});
})
.get('/catalog',async function(req,res){

  try{
    username="";
    if(req.session.theUser != undefined){
      username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
    }

    var itemModel = require('../models/itemDB.js');
    var listOfCategories = await itemModel.getCategories();
    var listOfItems = await itemModel.getItems();
    if(listOfCategories.length == 0 || listOfItems.length == 0){
      res.render('noData');
    }

    var data ={
      list:listOfCategories,
      items:listOfItems
    }
    res.render('catalog',{
      data:data,
      username:username
    });
  }
  catch(err){
    console.log("in catalog controller: ",err);
  }
})
.get('/about',function(req,res){
  var username = "";
  if(req.session.theUser != undefined){
    username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
  }
  res.render('about',{username:username});
})
.get('/contactUs',function(req,res){
  var username = "";
  if(req.session.theUser != undefined){
    username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
  }
  res.render('contact',{username:username});
})
.get('/catalog/item/:id',async function(req,res){
  try{
    var url = req.url;
    var id = req.params.id;
    var viewItem =await itemModel.getItem(id);
    console.log("/catalog/item/:id : ",viewItem);
    var username = "";
    var rating = "";
    madeIt = "";
    if(req.session.theUser != undefined){
      username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
      var userProfile = req.session.currentUserProfile;

      userProfile.userItems.forEach(function(item){
        if(item.item.itemCode === viewItem[0].itemCode){
          rating = item.rating;
        }
      });

      var ratedItems = await userDBModel.getUserRatedItems(req.session.theUser.userId);
      if(ratedItems != null){
        ratedItems.forEach(function(item){
          if(item.item.itemCode === viewItem[0].itemCode){
            rating = item.rating;
          }
        });
      }

    }

    if(viewItem.length!=0){
    console.log(url);
    res.render('item',{
      item:viewItem[0],
      url:url,
      username:username,
      rating:rating
    });
    }
    else{
      res.render('404');
    }
  }
  catch(err){
    console.log("in items error: ");
    console.log(err);
  }
})

.get('/feedback',async function(req,res){

  try{
    var itemId = req.query.itemCode;
    var action = req.query.action;
    var viewItem =await itemModel.getItem(itemId);

    if(viewItem.length==0){
      res.render('404');
    }else{
      var username = "";
      if(req.session.theUser != undefined){
        username = req.session.theUser.firstName + " " + req.session.theUser.lastName;
        var userProfile = req.session.currentUserProfile;
        var userItems = userProfile.userItems;
        counter=0;

        userItems.forEach(function(item){
          if(item.item.itemCode === itemId){
            counter+=1;
          }
        });

        if(counter == 0 && action == "update"){
          res.redirect('/myItems');
        }
        var madeIt = "No";
        var rating = 0;

        userItems.forEach(function(item){
          if(item.item.itemCode === viewItem[0].itemCode){
            madeIt = item.madeIt;
            rating = item.rating;
          }
        });

        var ratedItems = await userDBModel.getUserRatedItems(req.session.theUser.userId);
        if(ratedItems != null){
          ratedItems.forEach(function(item){
            if(item.item.itemCode === viewItem[0].itemCode){
              rating = item.rating;
              madeIt = item.madeIt;
            }
          });
        }

      }

      res.render('feedback',{
        item:viewItem[0],
        username:username,
        madeIt:madeIt,
        rating:rating
      });
    }
  }
  catch(err){
    console.log("in items error: ");
    console.log(err);
  }

})

.post('/update',urlencodedParser,async function(req,res){

  try{
    var rating = req.body.rating;
    var madeIt = req.body.madeIt;
    var itemCode = req.body.itemCode;

    req.check('rating')
    .notEmpty().withMessage("Rating cannot be empty!!")
    .isNumeric().isIn(['1','2','3','4','5']).withMessage("rating should be a numeric value between 0-5");

    req.check('madeIt')
    .notEmpty().withMessage("madeIt cannot be empty!!")
    .isAlpha().isIn(['Yes','No']).withMessage("madeIt should be Yes or No");

    validationError = req.validationErrors();
    if(validationError){
      console.log("validation errors : ",validationError);
     res.redirect('/myItems');
   }
   else{
     var item =await itemModel.getItem(itemCode);
     item.itemRating = rating;

     req.session.currentUserProfile =await userDBModel.getUserProfile(req.session.theUser.userId);
     var userItem = await userItemModel.userItem(item,rating,madeIt);
     console.log("In update error check!!!!!",userItem);

     var itemPresent = false;
     for(var i=0; i< req.session.currentUserProfile.userItems.length; i++){
       if(req.session.currentUserProfile.userItems[i].item.itemCode === itemCode){
         console.log("item already present!!");
         itemPresent= true;
       }
     }
     if(itemPresent){
       var updatedItem = await userDBModel.updateItem(req.session.theUser.userId, userItem);
       res.redirect('/myItems');
     }
     else{
       await userDBModel.addUserRatedItem(req.session.theUser.userId, userItem);
       res.redirect('/myItems');
     }
   }

  }
  catch(err){
    console.log("in update errror!! : ",err);
  }

})
.get('*',function(req,res){
  res.render('404');
});

module.exports = router;
