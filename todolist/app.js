// jshint esversion:6

// Info In Readme about g-i-s / getImageurl

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const getImageurl = require(__dirname + "/g-i-s.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = {
  name: String,
  //imangeurl: String
};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
  name: "Add a new List with the Edit tab",
  //imangeurl: getImageurl.getImageurl("Milk")
});

const Item2 = new Item({
  name: "Click the list you want in the nav",
  //imangeurl: getImageurl.getImageurl("Eggs")
});
const Item3 = new Item({
  name: "Add/Remove a item",
  //imangeurl: getImageurl.getImageurl("Eggs")
});

const Item4 = new Item({
  name: "Delete list in the Edit tab",
  //imangeurl: getImageurl.getImageurl("Pepper")
});

const Item5 = new Item({
  name: "Empty list will reinstate default list",
  //imangeurl: getImageurl.getImageurl("Pepper")
});

const defaultItems = [Item1, Item2, Item3, Item4, Item5];


const listSchema = {
  name:String,
  items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  const dbList = [];

  List.find({},function(err,foundList){
    foundList.forEach(function(list){
      dbList.push(list.name);
      //console.log(dbList);
    });
  });

  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
     Item.insertMany(defaultItems, function(err){
       if(err){
         console.log(err);
       }else{
         console.log("Successfully added default items to the database");
       }
     });
     res.redirect("/");
   } else{
      const day = date.getDate();
      //console.log(dbList);

      res.render("list", {listTitle: "Today", newListItems:foundItems, currentDay:day, dbNavList:dbList});
   }
  });

});

app.post("/", function(req,res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

      const item = new Item({
      name: itemName,
      //imangeurl: message
    });

    if(listName === "Today"){
      item.save();
      res.redirect("/");
    }else{
      List.findOne({name:listName}, function(err,foundList){
        //foundList.items.push(item);
        let x = foundList.items;
        x.push(item);

        foundList.save();
        res.redirect("/" + listName);
      });
    }

});

app.post("/create", function(req,res){
  const newList = req.body.newList;

  res.redirect("/" + newList);

});

app.post("/deleteList", function(req,res){
  const deleteList = req.body.listdeletebtn;
  List.findOneAndDelete({name:deleteList},function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log(deleteList+" was removed from the DB");
    }
  });

  res.redirect("/");

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  const dbList = [];

  List.find({},function(err,foundList){
    foundList.forEach(function(list){
      dbList.push(list.name);

    });
  });
  List.findOne({name:customListName},function(err, foundList){
    if(err){
      console.log(err);
    }
    if(!foundList){
      const empty = [];
      // create new list
      const list = new List ({
        name: customListName,
        items: empty
      });

      list.save(() => res.redirect('/' + customListName));

    }else{
      // show existing list

//
//  This is where the gis image gets called you can uncomment this plus the require above
//  to see the result. This will log in the console when you refresh/load a custom list
//
      // async function run(){
      //   const temp = await getImageurl("cat");
      //   console.log(temp);
      //   return temp;
      // }
      // console.log(run());;

      const day = date.getDate();
      //console.log(dbList);
      res.render("list", {listTitle: foundList.name, newListItems:foundList.items, currentDay:day, dbNavList:dbList});
    }
  });
});


app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  // console.log(req.body.listName);

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log(checkedItemId + " Was Removed from the DB");
        res.redirect("/");
      }
    });
  } else {
  List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checkedItemId}}}, function(err, foundList){
    if(!err){
      console.log(checkedItemId + " Was Removed from the DB");
      res.redirect("/" + listName);
      }
    })
  }
});

app.listen(3000, function() {
  console.log("Server is Running on port 3000");
});
