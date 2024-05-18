const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
require('dotenv').config();
const fs = require('fs');
const writeStream = fs.createWriteStream('devBlog.csv');

const port = process.env.PORT || 4000;

const app = express();

//write headers
writeStream.write(`author, BlogTitle, bloglink, readtime \n`);

//website that gonna be scrap
const url = 'https://dev.to/' 

axios.get(url)
    .then(res => {
        const $ = cheerio.load(res.data)
        const array = []
        $('.crayons-story').each((index, element) => {
            
            const object = {}

            const author = $(element).find('.profile-preview-card__trigger').text().replace(/\s\s+/g, '')
            const blogTitle = $(element).find('.crayons-story__title').text().replace(/\s\s+/g, '')
            const blogLink = $(element).find('a').attr('href');
            const readTime = $(element).find('.crayons-story__tertiary').text()
            const dev = 'https://dev.to'
            const joinedBlogLink = `${dev}` + `${blogLink}`;

            object.author = author
            object.blogTitle = blogTitle
            object.bloglink = blogLink
            object.readTime = readTime
            object.joinedBlogLink = joinedBlogLink
            array.push(object)
            writeStream.write(`Author: ${author}, \n Blog title is : ${blogTitle} ,\n Blog link: ${joinedBlogLink}, \n Blog read time : ${readTime} \n`);
        });
        console.log(array)

    }).catch(err => console.error(err))

//Listen to server
app.listen(port, () => {
    console.log(`Server Established and  running on Port ⚡${port}`)
})
