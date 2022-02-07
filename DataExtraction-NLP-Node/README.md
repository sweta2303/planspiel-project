---

# How to use the project ?

This project uses Node and Python . Specifically a customized text extraction library YAKE using Python . YAKE ( Yet Another Keyword Extraaction ) exposes two API's  extract_keywords_text and extract_keywords_url which are consumed by the Node server for extraction process . 

## Dependencies : 

Node v14.8.0 , Python v3.9.1 
Create Python virtual env and install the packages - Flask, jsonify, request , Swagger , urlopen , BeautifulSoup , git+https://github.com/LIAAD/yake [ pip install <package-name>]

1. Clone the project and import it to an IDE . Eg: VS-Code
2. Install all the dependencies **npm install**
3. To start YAKE server , **python ./yake-rest-api.py**
3. To start node server **node ./server.js**
4. Open postman and submit a GET request to http://localhost:<port>/profs
