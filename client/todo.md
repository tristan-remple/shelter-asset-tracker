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
- ✅ make sure this is working with endpoints

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
- ✅ comments don't upload
- ✅ template icon error

## Misc
- ✅ purge real data from github
- ✅ set up loading screen

## Styling
- ✅ icon selector interface
- header highlight color
- ✅ header overlap
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
- ✅ how are passwords set and reset?
- password error messages
- ✅ if forgot password -> prompt to request reset email
- if reset requested but email fails -> prompt to update email or contact supervisor
- ✅ do not null password on request

## Final Tweaks
- ✅ password email contains wrong url
- ✅ "see all locations" button should not appear to all users
- ✅ where are icons being saved?

## New November 4th

### Status and Error Messages
- ✅ password error messages
- ✅ users that are not assigned to a location need to get a helpful error screen
- ✅ navigation buttons should clear current status
- ✅ display error messages in red
- ✅ status type context
- ✅ incorrect fields should turn red and display an error
  - ✅ admin
  - ✅ categories
  - ✅ items
  - locations
  - units
  - users

```js Changes to forms
// SETUP
  const [ forceValidation, setForceValidation ] = useState(0)
  changes = { ..., errorFields: [] }

// SUBMIT
  if (changes.whatever === "" || changes.errorFields.length > 0) {
    setForceValidation(forceValidation + 1)
    setStatus({
      message: "Please verify your input.",
      error: true
    })
    return
  }

// PRE-RETURN
const formControls = { 
  changes, setChanges, unsaved, setUnsaved, 
  force: forceValidation
}

// FIELDS
  <RegularField 
    type="password"
    name="retypePassword"
    formControls={ formControls }
    checks={[ retypeCheck ]}
    required={ true }
  />
```

### Error Handling
- ✅ "snooze end of life" changed to "update end of life"
  - text: you can set more specific end of life from the edit screen
  - updated end of life does not register as a changed field: it should
- when changing an item from flagged to ok, if the item is past its eol, throw an error asking user to change eol
- ✅ remove comments display from item edit
- ✅ no strings over 255 characters allowed
- ✅ category create form: better error handling when form is incomplete
  - ✅ NaN values in number fields should throw error
  - ✅ 0, negative, or NaN months should display not valid instead of equivalent in years
- ✅ "items to discard soon" -> "items overview"
- ✅ disallow gifs
- icon upload failure: allow to try again

### Updated Functionality
- allow status flag changes from unit page
  - confirm dialogue needs to display
- "inspect" column changes to "action"
  - "inspect" button on items is confusing: change wording. "log inspection" "submit inspection" "record inspection"
  - "discard" button appears instead of inspect when item has been flagged for discard
- unit edit button -> edit or move
  - unit field on edit item screen becomes a dropdown
- add edit button to comments/inspections
  - display edited at time if comment has been edited
- add "manage icons" button to category list screen
- add sort buttons to columns on dashboard tables

### Styling
- ✅ header highlight color
- inconsistent margin after header: unit pages need more margin at top
- ✅ fields lighter than buttons
- change 100vw to 100vrw ? to adjust for scroll

