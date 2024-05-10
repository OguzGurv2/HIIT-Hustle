# Project HIIT Hustle

Version: v1.0.3

# Table of Contents

- [Introduction](#introduction)
- [Tools-and-Software-Languages](#tools-and-Software-Languages)
- [Features](#features)
- [AI-Implementation](#ai-imptlementation)
- [Challenges](#challenges)
- [Last-Update](#last-update)
- [Future-Ideas](#future-ideas)
- [Roadmap](#roadmap)
- [Conclusion](#conclusion)
- [Resources](#resources)
- [Installation](#installation)

# Introduction
This project, HIIT-Hustle, is part of the Web Programming Module Coursework for my second year in the Software Engineering (BSc) program, aimed at assessing my skills in JavaScript, HTML, and CSS. For this project, I focused on using Vanilla JavaScript for client-side scripting and Node.js for server-side operations, without relying on additional libraries or APIs. The application also integrates an SQLite3 database to manage user data securely and efficiently.

In today’s digital and fast-paced world, finding time for regular exercise can be challenging. HIIT-Hustle addresses this issue by facilitating High Intensity Interval Training (HIIT)—a workout methodology involving short bursts of intense activity that can last from 15 seconds to 4 minutes, known for its efficiency in burning calories quickly. HIIT-Hustle is a web-based application that allows users to create personalized HIIT workouts and track their sessions. The app is designed to make exercise accessible anytime and anywhere, helping users maintain their fitness with minimal time commitment. It features a selection of 14 different exercises and includes customizable application preferences such as theme color selection. Additionally, it offers motivational tools like a workout tracker to encourage users to engage more frequently in their exercise routines.

# Tools-and-Software-Languages
Along creating the HIIT Hustle, I have used several web application tools to enchance the game system and make an user-friendly interface.

## Visual Code Studio
VS Code is a code editor redefined and optimized for building and debugging modern web applications:

- It has a beginner-friendly and colored interface to understand the coding concept and debugging.
  
- This project used VS Code for uploading the project files to GitHub and coding.

## HTML
HTML is a standart markup language for Web pages. This project written in HTML5 which is the lastest version of HTML.
These are the HTML pages inside my project with their purpose in the application:

### [index.html](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/index.html)

This page is the landing page of the app which displays a basic landing page with about us, contact us, intro, features and user access buttons.

### [accessControl.html](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/accessControl.html)

This is the access page to the application that connects user from index.html to home.html.
This page has both log in and sign up functionalities via accessControl.js script and html form element.

### [home.html](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/home.html)

This page is the user view where user can see all the content inside the app, such as workouts, exercises, and settings.
Apart from showing these content user can create, delete workouts and change names of workouts inside this html and then redirected to the workout.html.
User also can browse throught the exercise.html by clicking any exercises that is inside this page to see more information about the selected exercise.

### [exercise.html](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/exercise.html)

This page is only used for getting more information about the exercise, such as duration, instructions with gif and which body part that it's affect.

### [workout.html](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/workout.html)

This page has the functionality of editing and creating fully custom workouts.
Apart from that, in this page user can start workout sessions.

## Javascript
JS is a programming language that is used to code web applications.
These are the Javascript files inside my project with their purpose in the application:

### [index.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/index.js)

This JS file only have a function for burger menu to help the app be more mobile compatible.

### [accessControl.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/accessControl.js)

This JS file is for accessControl.html and deals with Form Class which has sets of functions to handle the access control of the app.
accessControl.js both deals with login and signup by Form Class and global variables.

### [home.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/home.js)

This js file contains these functionalities:

- Creating/Deleting Workouts

- Changing Name of Workouts

- Workout Class which deals with the functionalities above

- User Settings

- App Settings

- Setting Class which deals with the two functionalities above

- AJAX requests for data

### [exercise.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/exercise.js)

This JS file only do AJAX request for exercise data.

### [workout.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/workout.js)

This js file contains these functionalities:

- Adding/Deleting exercises inside the workout

- Updating the workout

- Workout Class which deals with the functionalities above

- Starting/Stopping/Finishing Workout Sessions

- Timer Class which deals with the functionality above

- AJAX requests for workout and exercise data

### [pageManager.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/pageManager.js)

This JS file is only related to home.html which enables user to switch between other "pages" inside the html.
With this script user can swipe between those "pages" to see contents such as workouts, exercises, settings etc.

### [contentManager.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/contentManager.js)

This file has multiple functions for front-end of several html webpages.
It deals with same classes that the app uses in different html webpages such as Exercise Class.
Other than these functionalities this JS file manages:

- Notifications of the app such as "Workout Created!", "Exercise Added!"

- Adding different event listeners to buttons, content etc.

- Animations for general usage such as darken animation

- Other general functions that assist the app such as capitilizeWords.

### [dataHandler.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/dataHandler.js)

This JS file deals with the server requests such as POST, PUT, GET.
It is a general JS file that nearly all of the html pages uses to get, post or update data.

### [database.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/database.js)

This JS file contains code for database queries that gets the actual data from the SQLite3 database.

### [server.mjs](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/server.mjs)

This is the server.mjs which hosts the node.JS server on port 8080.
Hosts the server as locally.

## Cascading Style Sheets (CSS)
CSS is a simple mechanism for adding style to HTML webpages. 
These are the CSS files inside my project with their purpose in the application:

### [index.css](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/styles/index.css)

This file is for index.html to style the html page.

### [accessControl.css](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/styles/accessControl.css)

This file is for accessControl.html to style the html page.

### [home.css](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/styles/home.css)

This file is for home.html to style the html page.

### [exercise.css](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/styles/exercise.css)

This file is for exercise.html to style the html page.

### [workout.css](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/styles/workout.css)

This file is for workout.html to style the html page.

## SQLite3 (SQL3)
SQLite3 is a SQL type database language that is compatible with Node.JS servers/
Since it is a SQL type database language, file extension of it is ".sql".

### [001_initial.sql](https://github.com/OguzGurv2/HIIT-Hustle/tree/main/src/contents/migrations)

This file is creating a database with the contents inside of it, such as tables and exercise data.

## Scalable Vector Graphics
SVG is used to define vector-based graphics for the Web. Uses XML format and having support for interactivity and animation.
This project has 1 SVG file for landing page visualization, and it's totally free from 

## Canva
Canva is used for creating any type of visual contents for example images, slides, logos etc.
Since I was informed about not using third party contents I used Canva to create stock images for project's landing page.

## ChatGPT
ChatGPT is a natural language processing chatbot powered by AI, designed by OpenAI.
I used ChatGPT in this project as a quick access to information, such as contents about JS classes, back-end responds, and AJAX requests.

# AI-Implementation

In this project we were informed that using AI tools to create code scripts was prohibited, but using it for prompts and quick research to learn a new context or get an idea was not. Throughout my project, I used AI as a research tool to learn more about writing back-end and server side coding in JS. Here’s some prompts that I used to rely on while developing this project:

- What is the purpose of try and catch for server and client side?

- In both server-side and front-end contexts, try and catch are fundamental for creating resilient systems that handle errors gracefully, maintain operational integrity, protect against unexpected failures, and provide a better user experience. They enable developers to manage the flow of an application even when unpredictable scenarios occur, thus improving the stability and reliability of software applications.

After learning about the importance of using try and catch, I used the statement in every function on my server and client side of the application. Here’s the files:

[Client side](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/dataHandler.js)

[Server side](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/server.mjs)

I also asked a list of features to find an extra feature for my application

- Can you give me a list of features for a HIIT application?

Allow users to create custom workouts specifying exercise types, duration of each interval, rest periods, and total workout time.

Even though the list that AI gave me was long and most of the features were beyond my capability, this feature got my attention because it allows users to create fully customizable workouts with each interval that can be changed by their own.

[workout.js](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/workout.js)

There was also another issue with my login and signup system which was about form elements that uses POST requests to directly send data to server side. But I had to use the respond on client side from server side to redirect the url to application's home page. Thus, I asked to assist me on finding a built-in function.

- I am currently using form elements to post data but I want to use request and response from client side with my own custom fetch API before sending it to server side, but I don't know how to prevent the stock post request from form element. What do you recommend?

You'll need to add an event listener to your form that listens for the submit event. In the event handler, you can prevent the default form submission using event.preventDefault().

Here's how event.preventDefault() worked in my application:

[Access Control JS](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/accessControl.js)

# Features

- Creating fully custom workouts with rest intervals

- Rest intervals can also individually changed by users

- Tracking workouts to let users see their preferences

- 14 distinct exercises for creating workouts

- Workout naming system to keep track on your workouts

- Sign up/log in/log out system for creating accounts

- Changing theme color of app to make your experience more unique

- Exercise pages to see each exercise with their information

- Visual gifs for exercises to better understand the movements

- Friendly userface for workout sessions to show rest intervals, exercise duration and total taken time

- Updating system for app settings and user settings

- Updating system for workouts

- Node.js server for hosting the app in your device

- Mobile Compatible

- SQLite3 database for saving every process in the app

# Challenges
There are the challenges that I had throughout creating HIIT Hustle:

## Back-end responds/AJAX requests

Since this was the first time that I had to use endpoints and back-end requests, responds this much, thus it was a challenge to me.
First of all, I decided on my [queries](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/database.js) and upon the development I created a perfect [database](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/contents/migrations/001_initial.sql) based on the queries.
According to these queries, I built my own AJAX to fetch data and this [file](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/workout.js) is the best example of it since it got multiple AJAX requests with both forEach functions.

## Creating Classes

I never used classes this actively on own projects for user interface, thus it was also a challenge to me to create classes and manipulate user interface with them.
I started with creating [templates](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/workout.html) for each classes, then cloned these templates to render class instances.
Finally, I did the actual script functions for them to work with app's system, the best example that shows this will be [this document](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/workout.js).

## Login/Signup System

Login/Signup system was a challenge to me because I developed this system in one single [html page](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/accessControl.html) with a static JS code.
The actual challenge is to creating a class that works with both forms inside the html page and I overcame this challenge with using multiple global variables and tracking the forms by selected attribute.
This is the [Javascript file](https://github.com/OguzGurv2/HIIT-Hustle/blob/main/src/static/accessControl.js) that shows how I handled this problem.

# Last-Update

- Redesigned for PC compatible
  
- Webpages polished

# Future-Ideas

- Social Page with functions such as adding friends and sharing workouts

- Live server

- Let user to change username

- More advanced user interface for workout creating

- Download feature

# Roadmap

- Download feature

- Live Server

- Social Page with functions such as adding friends and sharing workouts

- Visual changes

# Conclusion

This project is for my Web Programming lecture coursework that shows my progress as an second year Software Engineering student in the industry.
Throughout the challenges and development of this project, I find myself more experienced on both front and backe-end.

# Resources

- ACE | Certified Personal Trainer | ACE Personal Trainer. (n.d.). Www.acefitness.org. Retrieved March 20, 2024, from https://www.acefitness.org
  
- Coolors. (2018). Coolors. Coolors.co. https://coolors.coCrosby, N. (2021, June 4).

- Font Awesome. Retrieved March 20, 2024, from https://kit.fontawesome.com/

- Healthline: Medical information and health advice you can trust. Healthline.com; Healthline. https://www.healthline.com/Mozilla. (2019, May 29).
 
- JavaScript GPU Animation with Transform and Translate. AG Grid. https://medium.com/ag-grid/javascript-gpu-animation-with-transform-and-translate-bf09c7000aa6Healthline. (2022).

- MDN Web Docs. MDN Web Docs. https://developer.mozilla.org/en-US/SQLite. (2014). Datatypes In SQLite Version 3.

- Sqlite.org. https://www.sqlite.org/datatype3.htmlSQLite Node.js Tutorial. (n.d.). SQLite Tutorial. Retrieved March 6, 2024, from https://www.sqlitetutorial.net/sqlite-nodejs/

- The JSON1 Extension. (n.d.). Www.sqlite.org. Retrieved March 15, 2024, from https://www.sqlite.org/json1.html(n.d.).

- Unsplash. (2018, December 9). Photo by kike vega on Unsplash. Unsplash.com. https://unsplash.com/photos/silhouette-photography-of-woman-doing-yoga-F2qh3yjz6Jk

# Installation

Installation Steps by using Zip file:

1. Download the zip file by clicking the Code Button

2. Unfold the zip file and open it with any code editor

3. Open terminal and paste:
    `npm i`
    `npm start`

4. Open your browser and in the browse section paste:
    `http://localhost:8080`
