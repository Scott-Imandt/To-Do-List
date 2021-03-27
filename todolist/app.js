// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
  name: "Welcome to your todolist"
});

const Item2 = new Item({
  name: "Hit the + buttom to add a item"
});

const Item3 = new Item({
  name: "<- hit this to delete an item"
});

const defaultItems = [Item1, Item2, Item3];

app.get("/", function(req, res) {

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
      //const day = date.getDate();
      res.render("list", {listTitle: "Today", newListItems:foundItems});
    }
  });
});

app.post("/", function(req,res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

});


app.post("/delete", function(req, res){

  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log(checkedItemId + " Was Removed from the DB");
    }
  });

  res.redirect("/")
});


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems:workItems});
});

app.post("/work", function(req,res){
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


app.get("/about", function(req, res){
  res.render("about");
});


app.listen(3000, function() {
  console.log("Server is Running on port 3000");
});
