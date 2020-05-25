const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./starter/modules/replaceTemplate');
////////////////////////////////////////////////////////////////////////
// FILES

// Blocking synchronous way 
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avacado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log("The file has been written");

// Non-Blocking, Asynchronous way...
// fs.readFile('./starter/txt/start.txt', 'utf8', (err,data1) => {
//     if (err) {
//         return console.log("ERROR! Failed to read start.txt");
//     }
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf8', (err,data2) => {
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt', 'utf8', (err,data3) => {
//             console.log(data3);
//             fs.writeFile('./starter/txt/final.txt',`${data2}\n${data3}`, (err) => {
//                 console.log("Your file has been written");
//             });
//         });
//     });
// });
// console.log("Will read file!");

////////////////////////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');

const productData = fs.readFileSync(`${__dirname}/final/dev-data/data.json`, 'utf-8');
const productDataObject = JSON.parse(productData);

const slugs = productDataObject.map(el => slugify(el.productName, {lower: true}));

const server = http.createServer((req, res) => {

    console.log(url.parse((req.url),true));
    const { query, pathname } = url.parse((req.url), true);
    

    //Overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200,{
            'Content-type': 'text/html',
        }); 
        const cardsHTML = productDataObject.map(product => replaceTemplate(tempCard, product)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
        res.end(output);
    } 
    //Product page
    else if (pathname === "/product") {
        res.writeHead(200,{
            'content-type': 'text/html',
        });
        const product = productDataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } 
    //API page
    else if (pathname === "/api") {
        res.writeHead(200, { 
            'Content-Type': 'application/json'
        });
        res.end(data);
    } 
    //Not found
    else {
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-custom-header' : 'blah-blah-blah'
        });        
        res.end('<h1>Page not found</h1>');   
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Server listening to requests on port 8000");
});

