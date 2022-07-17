---
title: Previous Design
header: Previous Design
---
This page is about the initial version of ManageCabbage. It follows the processes and designing I went through from start to finish. Whilst hopefully picking out some interesting things I learnt along the way. Admittedly I am writing this a long time after creating the website so it will be on the briefer side. In addition most of the code design will be included in the pages for the new website.

<div id="docMenuArea" class="numberedMenu"> </div>

## Introduction
The main goals of the webapp were to allow for spending to be logged and to show insights of the spending to the user.

To start I briefly designed how the website would function and the technologies needed to do so. Then I went on to design how the code would work and the objects etc. needed to run it.

## Technologies
### Backend
At the time of starting this project the only programming language I knew how to use as a backend was php so that's what I went with.

I did a bit of googling for a php hosting platform (there are tonnes apparently) and ended up going with hostgator as it was reasonably low cost and provided what I needed. Although I wouldn't choose this again as it was hosted in America (should've checked that before buying it lol).

The choice of the hosting platform meant I was stuck with mysql as a database. But luckily it was the one I'd worked with before when using php.

### Frontend
There isn't really much of a choice for frontend technologies for a website as it's mainly just html and JavaScript. 

I decided to not use any of the big JavaScript libraries (e.g. JQuery or Prototype) or different flavours of JavaScript (e.g. CoffeeScript, TypeScript). The reason being I wanted to try and learn the fundamentals and how it worked rather than just learning a specific way to use it. My final thought on this can be found [here](#javascript).

## Designing and Implementing
Honestly there wasn't too much designing that took place for this project. The simple outline would be that the user could add transactions that would CREDIT or DEBIT against accounts. I also added categories so you could group transactions together and sum their values.

I drew up some entity relation diagrams to get an idea of the objects I would need to create and persist in the database.

![Simple entity class diagram](/images/mcOld/uml.png)

I then just went through these and created simple web pages to apply CRUD operations to each entity. In the code I just used plain sql that would insert the values provided from the UI (whilst validating the values and parsing them correctly and safely).

## Testing
Admittedly this is an area that I could have improved a lot on. I didn't look into any testing frameworks for php so my the code for this has absolutely no tests :(. The same goes with the JavaScript in the project.

Instead I just did manual testing. Luckily the system isn't that big and I was only adding small features so the manual testing didn't take very long.

## Key Points Learned
### Size of Application
Something I didn't really think about was how big this application would be. I know that it was relatively simple but currently the whole database is only 82KB, and that's after about three years of use. Admittedly that's with only one user. But even with 1000 users that would still only be 82MB, and with 1,000,000 about 82GB.

This is just something that stood out as you hear big companies talk about TBs of data a minute and I think this just helps show how much data that actually is.

### Testing
I think even though this was a smaller project I should have added tests. This would have allowed me to find some issues earlier, before I deployed the changes. As well as picking up some smaller issues that passed through the gaps in my testing. The downside to this would be that I'd probably have spent more time writing tests than the actual code.

### Code Design
In addition to testing, this is an area I should have paid more attention to. I ended up redesigning the backend multiple times as it became hard to understand and read when more things were added. If I planned how the code would work and stuck to some proper design patterns this could have been avoided.

### Javascript
As I don't have much JavaScript experience this was a bit challenging. I think the main problem I have with JavaScript is that I didn't stick to any guidelines or anything. It also doesn't help that everyone on the internet disagrees with each other on the best way to use JavaScript, e.g. if ES5 classes should be used.

I think for next time I'm going to try and stick to some syntax / a specific way to do things. TypeScript might be what I'm looking for as it forces you to use javascript in a specific way.

### Frontend
I think the frontend is ok but it definitely needs some work. I think the main problem was that I did it from scratch. This meant the majority of my time was spent on the frontend (might be because I'm more experienced with backend). If I chose some framework or even some templates this could have been done a bit quicker and it would also look nicer.

## Updating
The following are just some things I implemented that stood out as interesting.
### Remember me functionality
I found [this blog page](https://paragonie.com/blog/2015/04/secure-authentication-php-with-long-term-persistence) about implementing remember me functionality within php. It gave me a good idea about how to implement the functionality but it also helped make me aware of some potential security issues I hadn't thought of before. 

An example was timing attacks. In the example it describes how searching up credentials in a database may indicate how correct the guess is. Say for example you needed to lookup if a given string exists. A closer match would take longer to reject as it checks more characters before finding out the value is incorrect, whereas, if the first character is wrong it would return false almost instantly.
### Monthly Payments
Not too long after using the website I realised that some things would become tedious when logging manually. One of these would be payments that occur on a monthly basis like bills etc. So to solve this I added a new entity that could be used to produce transactions on a monthly basis. This entity contains pretty much the same information as a transaction only it also contains the date at which it should be added. I made a daily cron job that would pick up these monthly transactions and create normal transactions from them if the payment day was the current day.

I also added an option so you could manually create a transaction from these monthly transactions. The date of the monthly transaction could also be removed meaning it would never be automatically added as a transaction. This was pretty useful if you had a frequent payment that had inconsistent timing as you only need to press one button instead of filling out all the transaction's information. 

## Examples
