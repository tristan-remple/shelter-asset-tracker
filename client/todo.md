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
- include export buttons

## Item Inspection
- inspection page sends calls to inspections endpoint and to items endpoint
- get property item.comments needs to be changed

## Delete Recovery
- list of deleted things
- undo delete button on each one

## Other
- delete body -> to remove
- documentation
    - code commenting
    - readme
    - faq

# New Endpoints
- post: inspection
- post: unit mark all items for inspection
- get: all deleted items, units, locations, categories, users
- patch: undo delete item, unit, location, category, user
- get: csv reports