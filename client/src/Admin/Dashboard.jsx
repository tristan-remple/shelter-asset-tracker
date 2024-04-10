import Button from "../Reusables/Button"

//------ MODULE INFO
// Displays some stats and reports for the admin.
// Also has some useful admin links.
// Imported by: App

const Dashboard = () => {
    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Admin Dashboard</h2>
                </div>
                <div className="col-2">
                    <Button text="Categories" linkTo="/categories" type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Users" linkTo="/users" type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Locations" linkTo="/locations" type="nav" />
                </div>
            </div>
            <div className="page-content">
                <div className="row row-info"><p>Reports to go here.</p></div>
            </div>
        </main>
    )
}

export default Dashboard