class apiService {

    singleItem() {
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
                categoryIcon: "icons8-console-table-100"
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

    postItem(item) {
        console.log(item)
        console.log("Posted")
        item.success = true
        return item
    }

    deleteItem(item) {
        console.log(item)
        console.log("Deleted")
        item.success = true
        return item
    }

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
}

export default new apiService