import Button from "../Reusables/Button"

//------ MODULE INFO
// Displays some stats and reports for the admin.
// Also has some useful admin links.
// Imported by: App

const Dashboard = () => {
    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Admin Dashboard</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Categories" linkTo="/categories" type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Users" linkTo="/users" type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Locations" linkTo="/locations" type="nav" />
                </div>
            </div>
            <div className="page-content">
                <div className="row row-info"><p className="my-2">Reports to go here.</p></div>
            </div>
        </main>
    )
}

export default Dashboard