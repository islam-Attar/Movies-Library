'use strict';

const express = require('express');

const app = express();

const jsonData = require("./Movie Data/data.json");


app.listen(4400, () => {
    console.log('Listen to port 4400');

});
app.get('/', moviesHandler);
app.get('/favorite', welcomeToFavoriteHandler);
app.use(errorHandler);
app.use("*", notFoundHandler);


function Movies(title,poster_path,overview)
{
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}




function notFoundHandler(req,res)
{
    res.status(404).send("No endpoint with this name")
}

function errorHandler(error, req, res)
{
    const err = {
        status : 500,
        message : error
    }

    res.status(500).send(err);
}



function welcomeToFavoriteHandler(req, res){
    return res.status(200).send("Welcome to Favorite Page");
};


function  moviesHandler(req, res){
    let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview); ;
    

    return res.status(200).json(movies);
};
