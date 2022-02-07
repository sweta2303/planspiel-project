const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
var json = require("./urls.json");
var aboutUrls = require("./about.json");
const fetch = require("node-fetch");
const { response } = require("express");
const Pool = require("pg").Pool;
require("dotenv").config();

let jsonData = [];
const promises = [];

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_POSR,
});

const fetchProfessorsfromDB = (req, res) => {
  pool.query(
    "SELECT * FROM professors ORDER BY prof_id ASC",
    (error, results) => {
      if (error) {
        res.status(400).json(error.message.toString);
      } else res.status(200).json(results.rows);
    }
  );
};

const updateProfInterests = (req, res) => {
  aboutUrls.forEach((aboutUrlOfProf) => {
    if (aboutUrlOfProf.url.length > 0) {
      pool.query(
        "SELECT * FROM professors ORDER BY prof_id ASC",
        (error, results) => {
          if (error) {
            res.status(400).json(error.message.toString);
          } else {
            for (var i = 0; i < results.rows.length; i++) {
              if (aboutUrlOfProf.name.includes(results.rows[i].prof_name)) {
               fetchKeyWordsFromUrl(aboutUrlOfProf.url).then(output =>{
                 console.log(output)
                 pool.query(
                  "UPDATE professors SET interests=$1 where prof_name=$2 ",[output,aboutUrlOfProf.name],
                  (error, results) => {
                    if (error) {
                      console.log("Error updating prof interest of "+ aboutUrlOfProf.name)
                      res.status(400).json(error.message.toString);
                    } else {
                      console.log("Interests update done for "+ aboutUrlOfProf.name)
                    }
                  }
                );
               })
              }
            }
            
          }
        }
      );
    }
  });
  res.status(201).json("Interests update is done for professors using YAKE");
};

const fetchKeyWordsFromUrl = async (url) => {

  const response = await fetch("http://127.0.0.1:5000/yake/extract_keywords_url", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "en",
      max_ngram_size: "3",
      number_of_keywords: "20",
      url: url,
    }),
  })
   
  return response.json();
};

const getProfsFromTUCWebsiteInsertToDB = (req, res) => {
  json.tuc_urls.forEach(async (urlInput) => {
    promises.push(fetch(urlInput));
  });
  Promise.all(promises)
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          if (response.status === 200) return response.text();
        })
      );
    })
    .then((htmlResponses) => {
      htmlResponses.forEach((html) => {
        const $ = cheerio.load(html);

        $(".tucal-proflist li div").each((index, element) => {
          jsonData.push({
            name: $(element).find("span").text(),
            professorship: $(element).find("strong").text(),
            faculty: $("#tucal-orgtitle div div").text(),
            intersets: [],
          });
        });
      });
      pool.query("SELECT * from professors ", (err, result) => {
        if (err) {
          return console.error("Error executing query", err.stack);
        } else {
          if (result.rows.length < 1) {
            for (var i = 0; i < jsonData.length; i++) {
              pool.query(
                "INSERT INTO professors (prof_name,professorship,faculty) VALUES ($1,$2,$3) ",
                [
                  jsonData[i].name,
                  jsonData[i].professorship,
                  jsonData[i].faculty,
                ],
                (error, results) => {
                  if (error) {
                    console.log(error.message.toString());
                  }
                }
              );
            }
          } else {
            res
              .status(500)
              .json(
                "Some professor data already exists in DB , please clear and try again"
              );
          }
          res
            .status(201)
            .json(
              "Professors data is scrapped from TUC Website and Inserted to DB"
            );
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json("Internal Server Error");
    });
};
module.exports = {
  getProfsFromTUCWebsiteInsertToDB,
  fetchProfessorsfromDB,
  updateProfInterests,
};
