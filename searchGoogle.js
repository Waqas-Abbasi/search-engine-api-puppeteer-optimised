const puppeteer = require('puppeteer-extra');
const {performance} = require('perf_hooks');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// // Add adblocker plugin, which will transparently block ads in all pages you
// // create using puppeteer.
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// puppeteer.use(AdblockerPlugin({blockTrackers: true}));

const searchGoogle = async (searchQuery) => {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});

    const page = await browser.newPage();

    //turns request interceptor on
    await page.setRequestInterception(true);

    //if the page makes a  request to a resource type of image or stylesheet then abort that request
    page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet') {
            request.abort();
        } else {
            request.continue();
        }
    });

    //use google search url params to directly access the search results for our search query
    await page.goto('https://google.com/search?q=' + searchQuery);

    //wait for one of the div classes to load
    await page.waitForSelector('div[id=search]');

    //Find all div elements with class 'bkWMgd'. These divs contain the information we need
    const searchResults = await page.$$eval('div[class=bkWMgd]', results => {
        //Array to hold all our results
        let data = [];

        //Iterate over all the divs found with class 'bkWMgd'
        results.forEach(parent => {

            //Check if parent has h2 with text 'Web Results'
            const ele = parent.querySelector('h2');

            //If element with 'Web Results' Title is not found  then continue to next element
            if (ele === null) {
                return;
            }

            //Check if parent contains 1 div with class 'g' or contains many but nested in div with class 'srg'
            let gCount = parent.querySelectorAll('div[class=g]');

            //If there is no div with class 'g' that means there must be a group of 'g's in class 'srg'
            if (gCount.length === 0) {
                //Targets all the divs with class 'g' stored in div with class 'srg'
                gCount = parent.querySelectorAll('div[class=srg] > div[class=g]');
            }

            //Iterate over all the divs with class 'g'
            gCount.forEach(result => {
                //Target the title
                const title = result.querySelector('div[class=rc] > div[class=r] > a >  h3').innerText;

                //Target the url
                const url = result.querySelector('div[class=rc] > div[class=r] > a').href;

                //Target the description
                const desciption = result.querySelector('div[class=rc] > div[class=s] > div > span[class=st]').innerText;

                //Add to the return Array
                data.push({title, desciption, url});
            });
        });

        //Return the top results
        return data;
    });

    await browser.close();

    return searchResults;
};

const averageTime = async () => {
    const averageList = [];

    for (let i = 0; i < 50; i++) {
        const t0 = performance.now();

        //wait for our function to execute
        await searchGoogle('cats');

        const t1 = performance.now();

        //push the difference in performance time instance
        averageList.push(t1 - t0);
    }

    //Adds all the values in averageList and divides by length
    const average = averageList.reduce((a, b) => a + b) / averageList.length;

    console.log('Average Time: ' + average + 'ms');
};

module.exports = searchGoogle;
