# WWW-Programming 10ECTS Course Project

## Overview
This is 10ECTS Course Project done for Tampere University course TIETA12 - WWW-Programming.
It is a website application for a fictional Tampere University club. The application works both with react-redux and
hbs.

## Using the application:
Initial user data:
- Initial user data can be found at InitialUserData.txt
- Initial user data can be added in postman

## Running the application:
- In vagrant: "sudo service mongod start"
- Run application and visit localhost:3000
- On app.js -file there are two routers & one has been commented out. Toggling these allows to view react app vs hbs app
- Sometimes react app might need to be updated for changes to show

## Missing functionalities:
- No login & token support for hbs. Full login & token support are implemented in react-redux.
- No XSS or CSRF -protection
- Admin can't take admin rights away from another admin
- Admin can't modify another user's data other than remove them or grant them admin rights

Other requirements met to full ability. No additional features.
