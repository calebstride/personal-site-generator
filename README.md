# **Personal Website**
This repo was made for the purpose of creating pages for a personal website. The idea was to allow myself to create markdown files that would be rendered and placed into html files. These html files could then be placed on any server as static html content.

Most of the work done in this repo was around creating and rendering the pages rather than the website content. Unfortunately I didn't really search for static website generators before starting on this project. If I did, I would have found that technologies already exist that take markdown files and create nice looking websites from them (like [Jekyll](https://jekyllrb.com/)).

I'll take this as a learning experience on doing proper research before starting a project. Plus not all my time was wasted as I got to practice my development/research skills.

## **Requirements**
This requires [node.js](https://nodejs.org/en/download/) and the [markedjs marked](https://github.com/markedjs/marked) package to compile the markdown into html. It also requires a web space for the html files to be hosted.

## **Setup**

Place all the files you want to turn into a website into the /resources/siteContent directory. Then run the code after installing node by doing the following:
    
    $ npm install

    $ node renderResources.js

Everything in resources/siteContent will be moved and rendered to the /public directory.

## **Notes**
- You can **order the pages** that appear on the sidebar by starting the filename with 'xx_'. Where xx is a number.
