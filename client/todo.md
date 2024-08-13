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

## Settings
- ✅ tag-like list of unit types

## Users
- ✅ check user edit endpoints
- ✅ remove password field from User Create

## Deletions
- check updated delete endpoints

## Dashboard
- make sure CSV export endpoints are receiving the information they need
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

## Misc
- ✅ purge real data from github

## Styling
- ✅ icon selector interface
- header highlight color
- ✅ danger color
- checkboxes

## Keyboard
- ✅ down arrow on icons to skip
- ✅ cancel actions
- ✅ keyboard trap

## Big Stuff
- test deployment
- funding proposal
- documentation
    - end user
    - admin user
    - maintenance
    - continued development
    - copyright
    - contact
- real deployment
- schedule training