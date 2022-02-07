#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd
import pandas as pd
import requests
import json
from bs4 import BeautifulSoup
API_KEY = '53a69a9d20bb303c61f3677c50867ebf'
URL = "https://www.researchgate.net/search.Search.html?type=researcher&query="
def get_me_skills(ln_name):
  URL_TO_SCRAPE = URL+ln_name
  payload = {'api_key': API_KEY, 'url': URL_TO_SCRAPE}
  print(URL_TO_SCRAPE)
  s = requests.get('http://api.scraperapi.com', params=payload, timeout=60)
  webpage = BeautifulSoup(s.text)
  sub_web_page = webpage.findAll(name="ul", attrs={"class": "nova-e-list nova-e-list--size-m nova-e-list--type-inline nova-e-list--spacing-none nova-v-person-item__info-section-list"})[2]
  #return json.dumps({'SKILLS':[str(wp.text.strip("\n ").replace(",", "")) for wp in sub_web_page.find_all("span")]})
  return [str(wp.text.strip("\n ").replace(",", "")) for wp in sub_web_page.find_all("span")]


# In[2]:


ln_all_details = []
df = pd.read_csv("prof_names.csv", encoding= 'unicode_escape',header=None)
for i in df[0]:
  ln_all_details.append([i,get_me_skills(i)])
pd.DataFrame(ln_all_details).to_csv("skillSets.csv")

