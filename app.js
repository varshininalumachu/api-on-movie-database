const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbServer = async () => {
  try {
    db = await open({
      fileName: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at : http://localhost:3000/");
    });
  } catch (e) {
    console.log("DB Error : ${e.message}");
    process.exit(1);
  }
  initializeDbServer();
};

// GET movies API

app.get("/books/", (request, response) => {
  const getMoviesQuery = `SELECT 
    *
    FROM 
    movie
    ORDER BY
    movie_id`;
  const movieArray = db.all(getMoviesQuery);
  response.send(movieArray);
});

// Add movies API

app.post("/books/", (request, response) => {
  const movieDetails = request.body;
  const { movie_id, director_id, movie_name, lead_actor } = movieDetails;
  const addMovieQuery = `INSERT INTO(movie_id,director_id,movie_name,lead_actor)
    VALUES (
        ${movie_id},${director_id},${movie_name},${lead_actor}
        );`;
  const dbResponse = db.run(addMovieQuery);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});

// GET movie API
app.get("/movie/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `SELECT * FROM movie
    Where movie_id = ${movieId};`;
  let movie = await db.get(getMovieQuery);
  response.send(movie);
});

// Update movie details API
app.put("/movie/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { movie_id, director_id, movie_name, lead_actor } = movieDetails;
  const updateMovieQuery = `UPDATE movie 
    SET ${movie_id},${director_id},${movie_name},${lead_actor}
    WHERE movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// DELETE movie API
app.delete("/movie/:movieID", async (request, response) => {
  const movieID = request.params;
  const deleteMovieQuery = `DELETE * FROM movie WHERE movie_id = ${movieID};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

// GET directors API
app.get("/director/", async (request, response) => {
  const getDirectorQuery = `SELECT * FROM director ORDER BY director_id;`;
  const directorArray = await db.all(getDirectorQuery);
  response.send(directorArray);
});

// get director with specific movie API
app.get("/director:/directorID/movie/", (request, response) => {
  const { directorID } = request.params;
  const getDirectorMovieQuery = `select * from movie where director_id = ${directorID};`;
  const directorMovieArray = db.all(getDirectorMovieQuery);
  response.send(directorMovieArray);
});
module.exports = add;
