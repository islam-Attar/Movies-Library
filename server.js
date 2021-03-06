"use strict";

const express = require("express");
const axios = require("axios");
const pg = require("pg");
const cors = require('cors');


// const client = new pg.Client(DATABASE_URL);


const app = express();
const dotenv = require("dotenv");
app.use(express.json());
app.use(cors());


function Movies(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;


const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});




app.get('/', (req, res) =>{
return res.status(200).send("Hello World");
})

app.get("/favorite", welcomeToFavoriteHandler);
app.get("/trending", trendingHandler);
app.get("/search", searchHandler);

app.post("/addMovies", addMoviesHandler);
app.get("/getMovies", getFavMovieHandler);


app.get("/getMovie/:id", getFavMovieIdHandler);
app.put("/UPDATE/:id", updateFavMovieHandler);
app.delete("/DELETE/:id", deleteFavMovieHandler);



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

function welcomeToFavoriteHandler(req, res) {
  return res.status(200).send("Welcome to Favorite Page");
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
          element.overview,
          element.comments
        );
        allMovies.push(oneMovie);
      });
      return res.status(200).json(allMovies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function addMoviesHandler(req, res)
{
  let movie = req.body

  const sql = `INSERT INTO mymovies(title, release_date, poster_path, overview, comments) VALUES($1, $2, $3, $4, $5) RETURNING * ;`
 

  let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comments]
  
  client.query(sql, values).then((data) => {
     
      return res.status(201).json(data.rows);
  }).catch(error => {
      errorHandler(error, req, res);
  })
}
function updateFavMovieHandler(req, res)
{
  const id = req.params.id;
  const movie = req.body;

  const sql = `UPDATE mymovies SET title = $1, release_date = $2, poster_path = $3, overview = $4, comments = $5 WHERE id=${id} RETURNING *;`;
  const values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comments];

  client.query(sql,values).then(data => {
      
      return res.status(200).json(data.rows);
  }).catch(error => {
      errorHandler(error, req, res);
  })

}

function getFavMovieHandler(req, res)
{
  const sql = `SELECT * FROM mymovies`;
  client.query(sql).then(data => {
    console.log(data.rows);
      return res.status(200).json(data.rows);
  }).catch(error => {
      errorHandler(error, req,res);
  })
}

function deleteFavMovieHandler(req, res){
  const id = req.params.id;

  const sql = `DELETE FROM mymovies WHERE id=${id};`

  client.query(sql).then(() => {
      return res.status(204).json([]);
  }).catch(error => {
      errorHandler(error, req, res);
  })
}


function getFavMovieIdHandler(req, res)
{

  // console.log(res);
  
    const id = req.params.id;
    console.log(id);
    const sql = `SELECT * FROM mymovies WHERE id=${id};`

    client.query(sql).then(data => {
        console.log(data.rows);
        res.status(200).json(data.rows);
    })
    .catch(error => {
        console.log(error);
        errorHandler(error, req, res);
    })
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

function addMovieHandler(req, res) {
  let movie = req.body;

  const sql = `INSERT INTO myMovies(title, release_date, poster_path, overview, comments) VALUES($1, $2, $3, $4, $5) RETURNING * ;`;

  let values = [
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.overview,
    movie.comments,
  ];
  console.log(values);
  client
    .query(sql, values)
    .then((data) => {
      return res.status(201).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getFavMovieHandler(req, res) {
  const sql = `SELECT * FROM myMovies`;
  client
    .query(sql)
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

// function  getMoviesHandler(req, res){


//     let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview); ;

//     return res.status(200).json(movies);
// };


client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);
  });
});

