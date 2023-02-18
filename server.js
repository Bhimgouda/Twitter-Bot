require("dotenv").config();
const express = require("express");
const app = express()
const puppeteer = require("puppeteer")

const getAllTweets = async()=>{
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage();
    
    await page.setViewport({width: 1535, height: 710});
    await page.goto("https://twitter.com/i/flow/login", {waitUntil: "networkidle2"});

    await wait(2500)
    
    await page.type('input[name="text"]', process.env.LOGIN_USERNAME);
    
    await page.evaluate(()=>{
        const elements = document.querySelectorAll("span");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent === 'Next') {
                elements[i].click();
                break;
            }
        }
    })

    await wait(2500)
    
    await page.type('input[name="password"]', process.env.PASSWORD);

    await page.evaluate(()=>{
        const elements = document.querySelectorAll("span");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent === 'Log in') {
                elements[i].click();
                break;
            }
        }
    })
} 

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

getAllTweets()

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})