import { formattedDate } from './dateHelper'

//------ MODULE INFO
// This module interacts directly with the API to get data for the pages.
// It is assumed that lists will not contain deleted items.
// If an individual queried item has been deleted, it should be returned anyway.
// Imported by: all Item, Unit, and Location pages

class apiService {

    // Called by: ItemDetails
    singleItem(id) {
        const item = {
            unit: {
                unitId: 13,
                unitName: "3040-B",
                locationId: 2,
                locationName: "Barry House"
            },
            itemId: 397,
            itemLabel: "BH-397",
            category: {
                categoryId: 23,
                categoryName: "end table",
                icon: "icons8-console-table-100"
            },
            toAssess: false,
            toDiscard: false,
            vendor: "Ikea",
            donated: false,
            initialValue: 439.99,
            currentValue: 285.00,
            added: {
                userId: 2,
                userName: "Sally Ivany",
                addedDate: "2022-02-22 13:55:00"
            },
            inspected: {
                userId: 4,
                userName: "Jimmy Jones",
                inspectedDate: "2024-02-22 13:55:00"
            },
            discardDate: null,
            comments: [
                {
                    commentId: 2,
                    commentDate: "2022-02-22 13:55:00",
                    userId: 2,
                    userName: "Sally Ivany",
                    commentText: "Legs are uneven, one side is scraped."
                },
                {
                    commentId: 3,
                    commentDate: "2021-07-15 09:35:00",
                    userId: 7,
                    userName: "Joe Rivers",
                    commentText: "Seems sturdy enough."
                }
            ]
        }
        return item;
    }

    // Called by: ItemEdit
    postItemEdit(item) {
        console.log(item)
        console.log("Edits Posted")
        item.success = true
        return item
    }

    // Called by: ItemEdit
    deleteItem(item) {
        console.log(item)
        console.log("Item Deleted")
        item.success = true
        return item
    }

    // Called by: ItemCreate
    postNewItem(item) {
        console.log(item)
        console.log("New Posted")
        item.itemId = 32
        item.success = true
        return item
    }

    // Called by: ItemEdit, ItemCreate
    listCategories() {
        return [
            {
                categoryId: 1,
                categoryName: "dining table",
                defaultValue: 900,
                icon: "icons8-furniture-100",
                singleUse: false
            },
            {
                categoryId: 2,
                categoryName: "end table",
                defaultValue: 300,
                icon: "icons8-bureau-100",
                singleUse: false
            }
        ]
    }

    // Called by: UnitDetails, ItemCreate, UnitEdit
    singleUnit(id) {
        return {
            unit: {
                unitId: 13,
                unitName: "3040-B",
                locationId: 2,
                locationName: "Barry House",
                unitType: "apartment",
                added: {
                    userId: 2,
                    userName: "Sally Ivany",
                    addedDate: "2022-02-22 13:55:00"
                },
                inspected: {
                    userId: 4,
                    userName: "Jimmy Jones",
                    inspectedDate: "2024-02-22 13:55:00"
                },
                deleteDate: null,
                comments: [
                    {
                        commentId: 5,
                        commentDate: "2022-02-22 13:55:00",
                        userId: 2,
                        userName: "Sally Ivany",
                        commentText: "The tenants have been rough with it; one hole in the wall."
                    },
                    {
                        commentId: 10,
                        commentDate: "2021-07-15 09:35:00",
                        userId: 7,
                        userName: "Joe Rivers",
                        commentText: "It's got at least one room."
                    }
                ]
            },
            items: [
                {
                    itemId: 359,
                    itemLabel: "BH-359",
                    categoryId: 14,
                    categoryName: "couch",
                    toAssess: true,
                    toDiscard: false,
                    inspectedDate: "2024-02-22 13:55:00"
                },
                {
                    itemId: 365,
                    itemLabel: "BH-365",
                    categoryId: 3,
                    categoryName: "mattress",
                    toAssess: false,
                    toDiscard: true,
                    inspectedDate: "2023-02-22 13:55:00"
                },
                {
                    itemId: 397,
                    itemLabel: "BH-397",
                    categoryId: 23,
                    categoryName: "end table",
                    toAssess: false,
                    toDiscard: false,
                    inspectedDate: "2024-08-22 13:55:00"
                }
            ]
        }
    }

    // Called by: UnitEdit
    postUnitEdit(unit) {
        console.log(unit)
        console.log("Updated")
        unit.success = true
        return unit
    }

    // Called by: UnitCreate
    postNewUnit(unit) {
        console.log(unit)
        console.log("Created")
        unit.unitId = 18
        unit.success = true
        return unit
    }

    // Called by: UnitDelete
    deleteUnit(unit) {
        console.log(unit)
        console.log("Unit Deleted")
        unit.deleteDate = formattedDate()
        unit.success = true
        return unit
    }

    // Called by: LocationDetails
    singleLocation(id) {
        return {
            location: {
                locationId: 2,
                locationName: "The Hub",
                locationType: "shelter",
                added: {
                    userId: 2,
                    userName: "Sally Ivany",
                    addedDate: "2022-02-22 13:55:00"
                },
                deleteDate: null,
                comments: [
                    {
                        commentId: 12,
                        commentDate: "2021-07-15 09:35:00",
                        userId: 7,
                        userName: "Joe Rivers",
                        commentText: "It's got at least one unit."
                    }
                ]
            },
            units: [
                {
                    unitId: 2,
                    unitName: "204",
                    unitType: "snug",
                    toInspectItems: 3,
                    toDiscardItems: 0
                },
                {
                    unitId: 3,
                    unitName: "205",
                    unitType: "snug",
                    toInspectItems: 0,
                    toDiscardItems: 0
                },
                {
                    unitId: 4,
                    unitName: "206",
                    unitType: "snug",
                    toInspectItems: 1,
                    toDiscardItems: 1
                }
            ]
        }
    }

    // Called by: LocationEdit, LocationDelete
    locationEdit(id) {
        return {
            locationId: 2,
            locationName: "The Hub",
            locationType: "shelter",
            added: {
                userId: 2,
                userName: "Sally Ivany",
                addedDate: "2022-02-22 13:55:00"
            },
            deleteDate: null,
            comments: [
                {
                    commentId: 12,
                    commentDate: "2021-07-15 09:35:00",
                    userId: 7,
                    userName: "Joe Rivers",
                    commentText: "It's got at least one unit."
                }
            ]
        }
    }

    // Called by: LocationEdit
    postLocationEdit(location) {
        console.log(location)
        location.success = true
        return location
    }

    // Called by: LocationList
    listLocations() {
        return [
            {
                locationId: 2,
                locationName: "The Hub",
                units: 35
            },
            {
                locationId: 3,
                locationName: "Some Place",
                units: 4
            }
        ]
    }

    // Called by: LocationCreate
    postLocation(location) {
        console.log(location)
        location.locationId = 8
        location.success = true
        return location
    }

    // Called by: LocationDelete
    deleteLocation(location) {
        console.log(location)
        location.deleteDate = formattedDate()
        location.success = true
        return location
    }

    // Called by: CategoryList
    listCategories() {
        const categoryList = [
            {
                categoryId: 1,
                categoryName: "dining table",
                defaultValue: 900,
                items: 16,
                icon: "icons8-furniture-100",
                singleUse: false
            },
            {
                categoryId: 2,
                categoryName: "end table",
                defaultValue: 300,
                items: 34,
                icon: "icons8-bureau-100",
                singleUse: false
            }
        ]
        return categoryList
    }

    singleCategory(id) {
        const singleCategory = {
            categoryId: 2,
            categoryName: "end table",
            defaultValue: 300,
            defaultUsefulLife: 20,
            icon: "icons8-bureau-100",
            singleUse: false,
            items: 34,
            created: "2024-02-22 13:55:00",
            updated: "2024-02-22 13:55:00"
        }
        return singleCategory
    }

    postCategoryEdit(category) {
        console.log(category)
        category.success = true
        return category
    }

    deleteCategory(category) {
        console.log(category)
        category.success = true
        category.deleteDate = "2024-02-22 13:55:00"
        return category
    }

    listUsers() {
        return [
            {
                userId: 1,
                userName: "shenson",
                userType: "admin",
                created: "2024-02-22 13:55:00",
                deleted: null,
                location: {
                    locationId: 2,
                    locationName: "The Hub"
                }
            },
            {
                userId: 1,
                userName: "joeblow",
                userType: "general",
                created: "2022-02-22 13:55:00",
                deleted: null,
                location: {
                    locationId: 2,
                    locationName: "The Hub"
                }
            }
        ]
    }

    singleUser(id) {
        return {
            userId: 1,
            userName: "joeblow",
            userType: "general",
            created: "2022-02-22 13:55:00",
            deleted: null,
            location: {
                locationId: 2,
                locationName: "The Hub"
            }
        }
    }

    postNewUser(user)  {
        console.log(user)
        user.userId = 13
        user.success = true
        return user
    }

    postNewCategory(category) {
        console.log(category)
        category.categoryId = 20
        category.success = true
        return category
    }
}

export default new apiService