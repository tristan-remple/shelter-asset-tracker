# TASKS

## Icons
- ✅ interface update to delete icons
- ✅ disallow deleting icons with children
- ✅ icon object:
```ts
interface Icon {
    file: blob,
    name: string, // .toLowerCase() before sending
    date: number,
    ext: string
}
```
- icons not uploading live

## Settings
- ✅ tag-like list of unit types
- make sure this is working with endpoints

## Users
- ✅ check user edit endpoints
- ✅ remove password field from User Create

## Deletions
- ✅ check updated delete endpoints

## Dashboard
- ✅ make sure CSV export endpoints are receiving the information they need
- ✅ fix edit category
- ✅ remove depreciation rate from category pages

## Units & Locations
- ✅ unit type is a different table now
    - ✅ use getSettings to fetch it
    - ✅ dropdown on edit and create
- ✅ disallow deleting units, locations with children
- ✅ flip unit button

## Items
- ✅ item type autofill
- comments don't upload
- ✅ template icon error

## Misc
- ✅ purge real data from github
- ✅ set up loading screen

## Styling
- ✅ icon selector interface
- header highlight color
- header overlap
- ✅ danger color
- ✅ checkboxes
  - ✅ Add Category
  - ✅ Edit Category
  - ✅ Edit User
  - ✅ Dashboard

## Keyboard
- ✅ down arrow on icons to skip
- ✅ cancel actions
- ✅ keyboard trap

## Big Stuff
- ✅ test deployment
- ✅ fix test database
- ✅ create new users with better passwords
- ✅ set up an email for this test deployment
- get a from email set up for shelter
- ✅ funding proposal
- documentation
    - end user
    - admin user
    - ✅ maintenance
    - continued development
    - copyright
    - contact
- real deployment
- schedule training

## Reports
- ✅ send data to api
```js
const postData = {
    facilityId: 1, // if omitted, returns all facilities
    startDate: "2029-12-31", // only needed for EoL
    endDate: "2029-12-31" // only needed for EoL
}
```
- ✅ find how to convert json -> csv and download

## Passwords
- how are passwords set and reset?