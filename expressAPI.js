const http = require('http');
const express = require('express');
const app = express();

const path = require('path');
const parser = require('body-parser');


const mongoClient = require('mongodb').MongoClient; // initializes the mongodb library and gets a client object


// callback that passes either an error or the db... just like in the mongo command client when we typed use <db>

mongoClient.connect("mongodb://<server>:27017", function(err, client) { 


  if(!err) {

    const collection = client.db('<your db>').collection('<collection name>');


    console.log("We are connected to mongodb...");

    app.get('/review/:reviewid',function(req, res) {
      let reviewid = req.params.reviewid;
      
      collection.aggregate([{$match: {"review.id": reviewid}}]).toArray(function(err, results) { // callback arguments are err or an array of results

      for(var i = 0; i < results.length; i++) {
        console.log(results[i]);
        res.send("results[i]");
      }
      res.close();
      });
    });
    
    app.get('/review/:n/:stars',function(req, res) {
      let rating = req.params.stars;
      let n = req.params.n;
      
      collection.aggregate([{ {$limit: n}, {$match: {"review.stars_rating": rating}} }]).toArray(function(err, results) {
          
      for(var i = 0; i < results.length; i++) {
        console.log(results[i]);
        res.send("results[i]");
      }
      res.close();
      });
   });
   
    app.get("/review/:n/:from_date/:to_date", function(req,res) {
      let n = req.params.n;
      let start = req.params.from_date;
      let end = req.params.to_date;

      collection.aggregate([{ {$limit: n}, {$match: { $and: {"review.date": {"$gte": to}}, {"review.date": {"$lte": from} }} } }]).toArray(function(err, results) {
          
      for(var i = 0; i < results.length; i++) {
        console.log(results[i]);
        res.send("results[i]");
      }
      res.close();
      });
   });
   
    app.delete("review/n/:reviewid",function(req,res) {
      let reviewid = req.params.reviewid;

      collection.deleteOne([{"review.id": { $eq: reviewid } }]);
      res.send("Deleted review: " + reviewid);
   });
   
    app.post("/review/add/:reviewid", function(req,res) {
      let reviewid = req.params.reviewid;
      console.log(req.body);
      
      let tempReview = collection.aggregate([{ $match: {"review.id": reviewid} }]);
      collection.deleteOne([{"review.id": reviewid}]);
      collection.insertOne(tempReview);
      res.send("Inserted document: " + reviewid);
   });
   
    app.put("/review/:reviewid", function(req,res) {
      let reviewid = req.params.reviewid;
      console.log(req.body);
      
      collection.updateOne({"review.id": reviewid}, {$set: {"review.body": "This product is awesome!"}});
      res.send("Updated: " + reviewID);
   });
   
    app.get("/review/random/:n/:from_date/:to_date", function(req,res) {
      let n = req.params.n;
      let start = req.params.from_date;
      let end = req.params.to_date;

      collection.aggregate([{ {$limit: n}, {$match: { $and: {"review.date": {"$gte": to}}, {"review.date": {"$lte": from} }} }, $group: 
          {_id: null, averageStars: {$avg: {"review.star_rating"}} } ]).toArray(function(err, results) {
          
      for(var i = 0; i < results.length; i++) {
        console.log(results[i]);
        res.send("results[i]");
      }
      res.close();
      });
   });
   
   app.get("/review/helpful/:prodid", function(req,res) {
      let productid = req.params.prodid;
      
      collection.aggregate([{ {$match: {"product.id": productid}}, 
      {$group: {_id: null, goodUpvotes: {$avg: "votes.helpful_votes"}}} }]).toArray(function(err, results) {
          
      for(var i = 0; i < results.length; i++) {
        console.log(results[i]);
        res.send("results[i]");
      }
      res.close();
      });
   });
       
  app.get("/review/info/:custid"), function(req,res) {
      let customerid = req.params.custid;
      
      collectopn.aggregatre([{{$match: {"customner_id": customerid}}, {$group: {_id: "$product.category", averageHelpful: { $avg: "$votes.helpful_votes"}, 
              averageVotes: { $avg: "$votes.total_votes" }, stars: { $avg: "$review.star_rating"}} }]).toArray(function(err, results) {
          
      for(var i = 0; i < results.length; i++) {
        console.log(results[i]);
        res.send("results[i]");
      }
      res.close();
      });
   });
  }
   }

  } // end if !err
}); // end mongo connect callback
