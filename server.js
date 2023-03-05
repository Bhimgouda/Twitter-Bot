require("dotenv").config();
const puppeteer = require("puppeteer")

const likeAllTweets = async()=>{
    const browser = await puppeteer.launch({
        headless: process.env.HEADLESS, //defaults to true 
        defaultViewport: null, //Defaults to an 800x600 viewport
        args:['--start-maximized' ],
      })

    const page = await browser.newPage();
    
    await botLogin(page);

    await wait(7000)
    
    await page.goto("https://twitter.com/search?q=%23100DaysOfCode&src=typed_query&f=live")

    await wait(5000)

    setInterval(async()=>{
        await page.evaluate(async()=>{
            const likeBtn = document.querySelector("div[data-testid='like']")
            if(likeBtn) likeBtn.click();
        })
        await wait(2000)
        await page.reload()
    }, 5000)

    // await scrollToEnd(page)
} 

async function botLogin(page){
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

async function scrollToEnd(page){ 

    // Initial Values
    let newScrollHeight = await page.evaluate(()=>document.body.scrollHeight);
    let scrollHeight = 0;
    let initial = true;

    // To minimize window.scrollBy errors
    let threshold = 0;

    while(true){
        const loading = await page.$("circle")

        if(!loading){

            // This is the break condition with a threshold value
            if(newScrollHeight === scrollHeight) threshold++;
            else threshold = 0;

            // If the height stays the same even after 5 attempts, then break
            if(threshold>5) break;
            
            // For running initial loop
            if(initial === true) initial = false
            else scrollHeight = newScrollHeight;
            
            // For Scrolling the window and also getting a new scrollHeight
            newScrollHeight = await page.evaluate(async(scrollHeight)=>{
                let newScrollHeight = document.body.scrollHeight;
                window.scrollBy(0, newScrollHeight - scrollHeight);
                return newScrollHeight;
            }, scrollHeight)
        
            await wait(100)
        }

        // If the page is loading wait for 0.7 seconds before looping
        else await wait(700)
    } 
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

likeAllTweets()





    