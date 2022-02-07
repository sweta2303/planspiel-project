import requests
import bs4
import json

def scrape():
        result = requests.get("https://www.tu-chemnitz.de/informatik/professuren.php.en")
        soup= bs4.BeautifulSoup(result.text,"lxml")
        department=soup.select('.tucal-proflist a')
        faculty=soup.select('#tucal-orgtitle div')
        proffessor=soup.select('.tucal-proflist span')
        depname = []
        profname=[]
        for dname in department:
            depname.append(dname.text)
        for pname in proffessor:
            profname.append(pname.text)
        proflist= list(zip(depname,profname))
        content=[]
        for branch,name in proflist:
            info={
                "Branch" : branch,
                "name" :name,
                "Faculties" :faculty[0].text
            }
            content.append(info)
        json_string = json.dumps(content,sort_keys=True, indent=4)
        with open("/Users/vidyadharmk/Desktop/info.json", "w") as file:
            file.write(json_string)

scrape()