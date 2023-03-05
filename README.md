// This Code alone if pasted in developer console in browser's, can scroll to the end without any human intervention

let newScrollHeight = document.body.scrollHeight
let scrollHeight = 0;
let initial = true;

// To minimize window.scrollBy errors
let threshold = 0;

while(true){
    const loading = document.querySelector("circle")

    if(!loading){
        // This is the break condition with a threshold value
        if(newScrollHeight === scrollHeight) threshold++;
        else threshold = 0;

        // If the height stays the same even after 5 attempts, then break
        if(threshold>10) break;
                
        // For running initial loop
        if(initial === true) initial = false
        else scrollHeight = newScrollHeight;
                
        // For Scrolling the window and also getting a new scrollHeight
        newScrollHeight = document.body.scrollHeight;
        window.scrollBy(0, newScrollHeight - scrollHeight);
            
        await wait(100)
    }

    // If the page is loading wait for 0.7 seconds before looping
    else await wait(700)
}

console.log("loop exit")

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}