    
const { default: axios } = require('axios');
const express = require('express'); 
const cheerio = require('cheerio');
const path = require('path');
const app = express();            
const https = require('https') ;
const port = 5000            

const url = "https://www.wired.com"

app.use(express.static(path.join(__dirname, 'scripts')));

app.get('/', (req, res) => {       
    res.sendFile('homepage.html', {root: __dirname});      
});

//Handles the get request for articles
app.get("/articles", (req,res)=>{
    getTitleAndUrl().then(data=>{
        res.send(data);
    })
})

app.listen(port, () => {          
    console.log(`Now listening on port ${port}`); 
});


// Retrieves title and url for all articles on the page
function getTitleAndUrl(){
    const articles = [];
    return new Promise((resolve,reject)=>{
        axios(url)
        .then(response=>{
            const html = response.data;
            const $ = cheerio.load(html);

            // Retrieving title and url
            $('h1, h2, h3', html).each(function(){
                const title = $(this).text();
                let articleUrl = $(this).parent().attr('href');
                if (articleUrl){
                    // Check if url already contains base url
                    if (!String(articleUrl).includes("https")){
                        articleUrl = url + articleUrl;
                    } 
                    // Exclude the only article that has a different time format
                    if (!String(articleUrl).includes("geeks-guide-steven-novella")){
                        articles.push({
                            title: title,
                            url: articleUrl
                        })
                    }
                }
            })

            let updatedArticles = []
            let instance;
            // Create instance for get request
            if (!instance)
            {
                //create axios instance
                instance = axios.create({
                    timeout: 60000,
                    httpsAgent: new https.Agent({ keepAlive: true }),
                    headers: {'Content-Type':'application/xml'}
                })
    
            
            }

            // Number of article limit
            let numArticle = 50;
            for (let i = 0; i < numArticle; i++){
                instance.get(articles[i].url).then(response=>{
                    const html = response.data;
                    const $ = cheerio.load(html);

                    // Retrieve date posted of each article
                    $('time', html).each(function(){
                        const date = $(this).text();
                        articles[i].date = date;
                        updatedArticles.push(articles[i]);
                    })

                    // Resolve promise upon reaching the limit
                    if (updatedArticles.length == numArticle){
                        resolve(updatedArticles);
                        return;
                    }
                })
            }
        })
    })
    
}

