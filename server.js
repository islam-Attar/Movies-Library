"use strict";

const express = require("express");
const axios = require("axios");

function Movies(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

const app = express();
const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

// const jsonData = require("./Movie Data/data.json");

app.listen(`${PORT}`, () => {
  console.log(`Listen to port ${PORT}`);
});

// app.get('/', getMoviesHandler);
// app.get('/favorite', welcomeToFavoriteHandler);
app.get("/trending", trendingHandler);
app.get("/search", searchHandler);

app.use(errorHandler);
app.use("*", notFoundHandler);

function notFoundHandler(req, res) {
  res.status(404).send("No endpoint with this name");
}

function errorHandler(error, req, res) {
  const err = {
    status: 500,
    message: error,
  };

  res.status(500).send(err);
}

function trendingHandler(req, res) {
  let allMovies = [];
  axios
    .get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
    )
    .then((value) => {
      value.data.results.forEach((element) => {
        let oneMovie = new Movies(
          element.id,
          element.title,
          element.release_date,
          element.poster_path,
          element.overview
        );
        allMovies.push(oneMovie);
      });
      return res.status(200).json(allMovies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function searchHandler(req, res) {
  let searchQuery = req.query.search;
  let allMovies = [];

  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchQuery}&page=2`
    )
    .then((value) => {
      value.data.results.forEach((name) => {
        allMovies.push(name);
      });
      return res.status(200).json(allMovies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

// function  getMoviesHandler(req, res){

//     let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview); ;

//     return res.status(200).json(movies);
// };

function welcomeToFavoriteHandler(req, res) {
  return res.status(200).send("Welcome to Favorite Page");
}
