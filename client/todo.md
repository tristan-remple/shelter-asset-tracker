# TASKS

## Icons
- interface update to delete icons

## Settings
- ✅ tag-like list of unit types

## Users
- check user edit endpoints
- remove password field from User Create

## Deletions
- check updated delete endpoints

## Dashboard
- make sure CSV export endpoints are receiving the information they need

## Units
- unit type is a different table now
    - use getSettings to fetch it
    - dropdown on edit and create
- settings is fine as-in
- disallow deleting units and locations with children

- icon extension?
- ✅ icon object:
```ts
interface Icon {
    file: blob,
    name: string, // .toLowerCase() before sending
    date: number,
    ext: string
}
```
- fix edit category
- remove depreciation rate from category pages
- item/unit type autofill