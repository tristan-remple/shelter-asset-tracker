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
- dropdown to filter by location or totals
- include export buttons

## Item Inspection
- new page for inspection, simplified interface: comment & flag only
- advanced edit is now the only edit
- button to inspect directly from unit's list?
- inspection page sends calls to inspections endpoint and to items endpoint

## Delete Recovery
- list of deleted things
- undo delete button on each one

## Other
- delete body -> to remove
- documentation
- reformat item details page
    - top: label, category, location, unit, status
    - middle: icon, comment
    - bottom: acquired date, initial value, current value, rate, invoice, vendor