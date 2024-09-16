// components
import Button from "./Button"

//------ MODULE INFO
// This module displays information to help users get the most out of this app.
// Imported by: App

const FAQ = () => {
    return (
        <main className="container">
            <h1>User Guide</h1>
            <div className="row title-row">
                <div className="col">
                    <Button text="Locations" linkTo="#locations" type="nav" />
                </div>
                <div className="col">
                    <Button text="Units" linkTo="#units" type="nav" />
                </div>
                <div className="col">
                    <Button text="Items" linkTo="#items" type="nav" />
                </div>
                <div className="col">
                    <Button text="Account" linkTo="#account" type="nav" />
                </div>
                <div className="col">
                    <Button text="Dashboard" linkTo="#dashboard" type="nav" />
                </div>
                <div className="col">
                    <Button text="Categories" linkTo="#categories" type="nav" />
                </div>
                <div className="col">
                    <Button text="Users" linkTo="#users" type="nav" />
                </div>
            </div>
            <div className="page-content">
                <h2>General Users</h2>
                <div className="row row-info" id="locations">
                    <h3 className="faq-title">Locations</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                    <Button text="Locations" linkTo="/locations" type="nav" />
                </div>
                <div className="row row-info" id="units">
                    <h3 className="faq-title">Units</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                </div>
                <div className="row row-info" id="items">
                    <h3 className="faq-title">Items</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                </div>
                <div className="row row-info" id="account">
                    <h3 className="faq-title">Account</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                    <Button text="Profile" linkTo="/user" type="nav" />
                </div>
                <h2>Admin Users</h2>
                <div className="row row-info" id="dashboard">
                    <h3 className="faq-title">Dashboard</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                    <Button text="Dashboard" linkTo="/admin" type="nav" />
                </div>
                <div className="row row-info" id="categories">
                    <h3 className="faq-title">Categories</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                    <Button text="Categories" linkTo="/categories" type="nav" />
                </div>
                <div className="row row-info" id="users">
                    <h3 className="faq-title">Users</h3>
                    <p>Praesent sit amet odio at nisi pharetra lacinia id ac urna. Sed et metus velit. Ut blandit risus a ante maximus, id ornare dui porttitor. Morbi mi dolor, iaculis vel facilisis sit amet, fermentum et dui. Phasellus a lacinia metus. Pellentesque id aliquam ante. Phasellus non vehicula turpis, eget vulputate nisi. Curabitur efficitur dapibus ultrices.</p>
                    <Button text="Users" linkTo="/users" type="nav" />
                </div>
            </div>
        </main>
    )
}

export default FAQ