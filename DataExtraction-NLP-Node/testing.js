const fetch = require("node-fetch");

fetch("http://127.0.0.1:5000/yake/extract_keywords_url", {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    language: "en",
    max_ngram_size: "3",
    number_of_keywords: "20",
    url: "https://vsr.informatik.tu-chemnitz.de/about/people/gaedke/",
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));
