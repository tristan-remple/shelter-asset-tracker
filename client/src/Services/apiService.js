//------ MODULE INFO
// This module interacts directly with the API to get data for the pages.
// Imported by: ItemDetails, ItemEdit, ItemCreate, UnitDetails

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
                firstName: "Sally",
                lastName: "Ivany",
                addedDate: "2022-02-22 13:55:00"
            },
            inspected: {
                userId: 4,
                firstName: "Jimmy",
                lastName: "Jones",
                inspectedDate: "2024-02-22 13:55:00"
            },
            discardDate: null,
            comment: "Legs are uneven, one side is scraped."
        }
        return item;
    }

    // Called by: ItemDetails
    postItem(item) {
        console.log(item)
        console.log("Posted")
        item.success = true
        return item
    }

    // Called by: ItemDetails
    deleteItem(item) {
        console.log(item)
        console.log("Deleted")
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

    // Called by: ItemCreate
    singleUnit(id) {
        return {
            unitId: 13,
            unitName: "3040-B",
            locationId: 2,
            locationName: "Barry House"
        }
    }

    // Called by: UnitDetails
    unitItems(id) {
        return {
            unit: {
                unitId: 13,
                unitName: "3040-B",
                locationId: 2,
                locationName: "Barry House",
                unitType: "apartment",
                added: {
                    userId: 2,
                    firstName: "Sally",
                    lastName: "Ivany",
                    addedDate: "2022-02-22 13:55:00"
                },
                inspected: {
                    userId: 4,
                    firstName: "Jimmy",
                    lastName: "Jones",
                    inspectedDate: "2024-02-22 13:55:00"
                },
                deleteDate: null,
                comment: "It's got at least one room."
            },
            items: [
                {
                    itemId: 359,
                    itemLabel: "BH-359",
                    categoryId: 14,
                    categoryName: "couch",
                    toAssess: true,
                    toDiscard: false
                },
                {
                    itemId: 365,
                    itemLabel: "BH-365",
                    categoryId: 3,
                    categoryName: "mattress",
                    toAssess: false,
                    toDiscard: true
                },
                {
                    itemId: 397,
                    itemLabel: "BH-397",
                    categoryId: 23,
                    categoryName: "end table",
                    toAssess: false,
                    toDiscard: false
                }
            ]
        }
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
                    firstName: "Sally",
                    lastName: "Ivany",
                    addedDate: "2022-02-22 13:55:00"
                },
                deleteDate: null,
                comment: "It's got some number of units."
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
}

export default new apiService