// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res){

  var today = new Date();

  if(today.getDay() == 6 || today.getDay() == 0){
    res.send("Its the weekend");
  } else{
    res.send("Its a week day")
  }
})

app.listen(3000, function(){
  console.log("Server is Running on port 3000");
})
