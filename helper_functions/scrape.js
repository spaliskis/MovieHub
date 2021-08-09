const puppeteer = require('puppeteer');
const pool = require("../db");

// NOT FINISHED
// A script for scraping movies' image paths from imdb.com and putting them into a database
populateImgs();

async function populateImgs(){
    const titles = pool.query('SELECT title FROM movietable ORDER BY show_id ASC').then(async function(result) {
        for(element of result.rows){
            let imgs = await getImgLinks(element.title);
            if(imgs != null){
                for(img of imgs){
                    await pool.query(
                        "UPDATE movietable SET images = CONCAT(images, ', ', $1::text) WHERE title = $2",                        
                            [img, element.title]
                        );
                }
            }

        }
    });
}



function getImgLinks(title){
    return (async () => {
        let imgs = null;
        let reqCount = 0;  
        while(imgs == null && reqCount < 8){
        try {   
                const browser = await puppeteer.launch();
                const page = await browser.newPage();     
                await page.goto('https://www.imdb.com/?ref_=nv_home');
                await page.waitFor('input[id=suggestion-search]');      
                console.log(title);        
                await page.$eval('input[id=suggestion-search]', (el, value) => el.value = value, title);
                await page.click('button[id="suggestion-search-button"]');
                await page.waitForSelector('.result_text a');
                const text = await page.evaluate(() => {
                    const anchor = document.querySelector('.result_text a');
                    return anchor.getAttribute('href');
                });
                console.log(text);
                await page.setDefaultTimeout(2000);
                await page.click('.result_text a');
                let waitSelector = null;               
                await page.waitForSelector('#main_bottom #titleImageStrip .mediastrip a img');
                imgs = await page.evaluate(() => {
                const anchor = document.querySelectorAll('.mediastrip a img');
                let content = [];
                for(item of anchor){
                    content.push(item.getAttribute('loadlate'));
                }
                return content;
            });
            console.log(imgs);
            await browser.close();

            } catch (error) {
                console.log("Timeout 2000ms exceeded");
                reqCount++;  
            }

        }
        return imgs;
    })();
}