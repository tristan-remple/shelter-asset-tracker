# Shelter Asset Tracker

This is a project for Shelter Nova Scotia. It's an inventory management system for charity and nonprofit organizations to keep track of fixed assets such as furniture and appliances. This app was made with funding from NSCC Applied Research.

## Maintenance and Improvements

This is a Node.js application that uses Express and MySQL/PostgreSQL for the back end, and React for the front end. If you're not familiar with those frameworks and libraries, you're not ready to work on this app. The back end and the front end are completely separate from each other, and communicate via API. Generally speaking, the back end is in the app folder and the front end is in the client folder. In order to work on this app, you will need a docker container running MySQL or PostgreSQL. The dbCreate and dbSeed scripts will need to be run to populate the database. I recommend taking some time to get familiar with the ERD before getting into it.

### Scripts

- root: npm run start => starts the express back end
- root: npm run launch => starts the express back end AND the react front end
- client: npm run start => starts the react front end
- client: npm run build => builds the front end into the dist folder at the project root, where express can access it
- client: npm run style => compiles the SCSS from client/style/style.scss to client/src/css/style.css, making it accessible to the react code

### Expected Maintenance

The primary maintenance this app will need is updates to its node modules. You will need to run `npm install` in both the project root AND the client folder. If there are vulnerabilities, you can fix them with `npm audit fix --force`. Depending on how significant the dependency updates are, this might break some stuff in our code. It will be up to you to troubleshoot it.

### Improvements

While we are proud of this app, everything can be improved upon. If you have inherited this project via Applied Research and you have the skills to make it better, go for it!

However, please keep in mind that the `main` branch of the GitHub repository is used for production, both by Shelter NS and for our portfolios. Don't commit to main unless you're certain your code is ready for production.

## Contact

This app was originally created by Tristan Remple and Michele Moore, with help from Tilly Campbell. You can get our personal email addresses from your supervisor at NSCC Applied Research if you need help.