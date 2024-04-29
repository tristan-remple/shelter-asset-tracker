# TASKS

## Auth
- set session on login
- navbar and protected routes call session
- user set or reset password
    - temp password is provided in email, use it
- redirect and navbar inventory to single location or list depending on session array

```js
{
    user: true,
    admin: false,
    facilityAuth: [
        1, 3
    ]
}
```

## Dashboard
- connect endpoints

## Item Inspection
- connect endpoints
- CommentBox will need to be updated

## Delete Recovery
- connect endpoints

## Other
- delete body -> to remove
- documentation
    - code commenting
    - readme
    - faq

## Units
- button to flip a unit
- button to delete all items marked to discard

## Icons
- icon table & interface?

# New Endpoints
- post: inspection
- post: unit mark all items for inspection
- get: all deleted items, units, locations, categories, users
- patch: undo delete item, unit, location, category, user
- get: csv reports