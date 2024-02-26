# Shelter Asset Tracker

This is a project for Shelter Nova Scotia. It's an inventory management system for charity and nonprofit organizations to keep track of fixed assets such as furniture and appliances. This project is also classwork for NSCC Web Programming second year Capstone.

## Components

### Reusable
- main
- header
- footer
- file drop
- search
- admin button
- flag
- button link
- admin button
- save changes panel
- dropdown

### All Users
- signin
- user profile
- unit button
- unit list page
- location list page ( for user )
- location button
- unit page
- item quick view
- item page
- item add/edit form
- faq

### Admin Users
- dashboard
- user list page
- user listing
- user add page
- location list page ( for admin )
- location listing
- location add/edit form
- add/edit unit
- category list page
- category listing
- category add/edit
- icon select

## Endpoints

### Users
- user signin (should return different jwt for admin vs for general?)
- user view profile
- user edit profile
- admin edit user
- admin add user
- admin view all users
- admin delete user

### Locations
- view all locations
- admin add location
- admin edit location
- admin delete location

### Units
- view all units in one location (param: location id)
    - may also need to return data from the location table
- admin add unit
- admin edit unit
- admin delete unit

### Items
- view all items in one unit (param: unit id)
    - may also need to return data from unit and/or location
- view one item
- edit item
- add item
- delete item (soft delete)
- admin view total value and number of items

### Categories
- non-admin access category list (for dropdown)
- admin view all categories
- admin add category
- admin edit category
- admin delete category
- admin view number and value of items per category

## Note

If you disagree about the number or type of components and endpoints, please make a note of it on Teams and we will review it together.