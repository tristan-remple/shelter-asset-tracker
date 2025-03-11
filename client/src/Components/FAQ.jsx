import { useContext } from "react"
import { userContext } from "../Services/Context"

// components
import { Link } from "react-router-dom"
import Button from "./Button"
import { HashLink } from "react-router-hash-link"

//------ MODULE INFO
// This module displays information to help users get the most out of this app.
// Imported by: App

const FAQ = () => {

    const { userDetails } = useContext(userContext)

    return (
        <main className="container">
            <h1>User Guide</h1>
            <nav>
                <h2>Navigation</h2>
                <div className="row title-row">
                    <div className="col">
                        <Button text="Overview" linkTo="#overview" type="nav" />
                    </div>
                </div>
                <h3>General User Actions</h3>
                <div className="row title-row">
                    <div className="col">
                        <Button text="Login" linkTo="#general-overview" type="nav" />
                    </div>
                    <div className="col">
                        <Button text="Locations" linkTo="#general-locations" type="nav" />
                    </div>
                    <div className="col">
                        <Button text="Units" linkTo="#general-units" type="nav" />
                    </div>
                    <div className="col">
                        <Button text="Items" linkTo="#general-items" type="nav" />
                    </div>
                    <div className="col">
                        <Button text="Profile" linkTo="#general-profile" type="nav" />
                    </div>
                </div>
                { userDetails.isAdmin && <>
                    <h3>Admin User Actions</h3>
                    <div className="row title-row">
                        <div className="col">
                            <Button text="Overview" linkTo="#admin-overview" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Dashboard" linkTo="#admin-dashboard" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Settings" linkTo="#admin-settings" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Locations" linkTo="#admin-locations" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Units" linkTo="#admin-units" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Categories" linkTo="#admin-categories" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Users" linkTo="#admin-users" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Restore" linkTo="#admin-restore" type="nav" />
                        </div>
                    </div>
                </> }
            </nav>
            <div className="page-content">
                <div className="row row-info general" id="overview">
                    <h3>Overview</h3>
                    <p>The Shelter Asset Tracker, or the SAT, is a tool to help you keep track of the furniture and appliances owned by your organization. No more surprise expenses: keeping track of item age and condition allows Central Office to predict and budget for needed replacements. Every time an item is bought, received, damaged, or discarded, you should update the SAT.</p>
                    <h4>Where to Find the App</h4>
                    <p>The SAT can be reached directly by going to <a href="https://shelter-asset-tracker.onrender.com/">shelter-asset-tracker.onrender.com</a> <br />It can also be reached at the <a href="https://sat.shelternovascotia.com/">SAT subdomain</a> of your organization's website.</p>
                    <h4>Credits</h4>
                    <p>This app was created by <a href="https://aqualunae.ca/">Tristan Remple</a>, Michele Moore, and Tilly Campbell, under the employment of Lisa Mader through <a href="https://www.nscc.ca/appliedresearch/index.asp">NSCC Applied Research</a>, for the use of <a href="https://www.shelternovascotia.com/">Shelter Nova Scotia</a>.</p>
                    <h4>Terminology</h4>
                    <p><b>Items</b>: Every appliance and piece of furniture owned by your organization is represented as an Item in the SAT. Each Item is distinct: a set of four dining chairs will be shown in the SAT as four Items. Every Item has some information to tell you what kind of Item it is, what condition it's in, when it was bought, where it is, and more.</p>
                    <p><b>Categories</b>: Every Item has a Category, which describes what type of Item it is. For example, the category of an Item might be "Dining Chair" or "Bedframe" or "Television". Categories help the Admin Users get data about the kinds of Items each Location has (or doesn't have). Categories are also used to fill in values that are unknown with default values. This will be explained in more detail under Add Item.</p>
                    <p><b>Locations</b>: A Location in the SAT corresponds to a physical building or property owned by your organization. A Location might be a house, a block of office space, or a storage facility, to name a few examples.</p>
                    <p><b>Units</b>: Most Locations are divided into multiple Units. Most of the time, a Unit is a room: one office, one bedroom, one storage area, etc. In some cases, a Unit might refer to an outdoor space, such as a patio or shed. Depending on your organization's needs, a Unit may also refer to an apartment consisting of multiple rooms.</p>
                    <p><b>Users</b>: A user account corresponds to one person who needs to communicate about the Items in the SAT. There are two types of Users: General and Admin.</p>
                    <p><b>General Users</b> are usually people who work directly with the people your organization serves. Most General Users only have access to one Location. General Users only need to worry about making sure that the Items in the SAT accurately reflect the furniture and appliances in the Location at which you work. Locations, Units, and Categories are defined by the Admin Users.</p>
                    <p><b>Admin Users</b> are usually people who need access to data to make decisions. Admin Users have full access to the app. They have permission to do everything that General Users can do, at all Locations. Locations, Units, and Categories are defined by the Admin Users. Admin Users also have access to the powerful Reporting features in the Dashboard. To learn more about Admin User functionality, <HashLink to="#admin-heading">click here</HashLink> or scroll down to the Admin Users section.</p>
                </div>
                <h2 id="general-heading">Guide for General Users</h2>
                <div className="row row-info general" id="general-overview">
                    <h3>General Users</h3>
                    <p>General Users only need to worry about making sure that the Items in the SAT accurately reflect the furniture and appliances in the Location at which you work.</p>
                    <h4>Get Your Account</h4>
                    <p>Admin Users are responsible for registering General Users. As a General User, you will know you have been registered when you receive an email asking you to set your password on the Shelter Asset Tracker. Depending on your email settings, you may need to check your junk or spam folders. The email message you receive will contain a link with a unique code. To set your password, you must follow the link from your email.</p>
                    <p>On the Password Reset page, you will be asked to enter your email and new password. Your password must meet a certain level of complexity.</p>
                    <h4>Log In</h4>
                    <p>When you visit the SAT, you will be prompted to log in. Enter your email and password, and then click Log In. You must use the email address at which you received your registration email.</p>
                    <p>Once you are logged in, you will be redirected to the <b>Location Details</b> page. At any time, you can click the Inventory button or the SAT logo, both located in the header, to return to the Location Details page.</p>
                    <p className="guide-note">Note: If you are an Admin User, or if you are a General User who is assigned to more than one Location, you will instead see a Locations List page. From the Locations List table, you can click Details to reach the Location Details page for a specific location.</p>
                    <h4>Password Reset</h4>
                    <p>If you forget your password, you can contact an Admin User and ask them to create a request to reset the password for your account. When your password is reset, you will be sent a new email message with a new unique code, allowing you to set a new password.</p>
                    <p>If the Admin User has created the password reset request, but you have not received the email, you can click on the Forgot Password? Button at the bottom of the Log In form. On the Forgot Password screen, you will be prompted to enter your email. If your account still exists and a password reset request is active, the email will be sent to you again.</p>
                </div>
                <div className="row row-info general" id="general-locations">
                    <h3>Locations</h3>
                    <p>Locations: A Location in the SAT corresponds to a physical building or property owned by your organization. A Location might be a house, a block of office space, or a storage facility, to name a few examples.</p>

                    <h4>Location Details</h4>
                    <p>The Location Details page displays some details about the Location, such as its name and the date on which it was added to the SAT.</p>
                    <p className="guide-note">Note: The SAT does not record or display identifying information such as addresses and phone numbers.</p>
                    <p>Below those details, it displays a table of Units within the Location. Each Unit has:</p>
                    <ul>
                        <li>The <b>Name</b> of the Unit</li>
                        <li>The Unit <b>Type</b></li>
                        <li>A button to view the <b>Unit Details</b></li>
                        <li>A <b>Status</b> flag which reflects the most severe flag of the Items in that Unit.</li>
                    </ul>
                    <p>Units with a Status flag of Discard or Inspect will be displayed at the top of the list. Status flags will be explained in more detail under <b>Item Details.</b></p>
                    <p>Between the Location Details and the Units table, there is a search bar. You can enter the name or type of a Unit and click Search to filter the table so that it only shows Units that match your search. To go back to displaying all Units, delete the search term that you typed and then click Search again.</p>
                    <h5>Differences on Mobile View</h5>
                    <p>If you are viewing the SAT on a small screen, such as a mobile phone, there is not enough room to display the table of Units. Instead, it will be formatted as a list, with one button for each Unit. Tapping on the mobile Unit buttons will take you to the Unit Details page.</p>
                </div>
                <div className="row row-info general" id="general-units">
                    <h3>Units</h3>
                    <p>Units: Most Locations are divided into multiple Units. Most of the time, a Unit is a room: one office, one bedroom, one storage area, etc. In some cases, a Unit might refer to an outdoor space, such as a patio or shed. Depending on your organization's needs, a Unit may also refer to an apartment consisting of multiple rooms.</p>

                    <h4>Unit Details</h4>
                    <p>The Unit Details page displays information about the Unit:</p>
                    <ul>
                        <li>The <b>Location</b> in which the Unit is located</li>
                        <li>The Name of the <b>Unit</b></li>
                        <li>The Unit <b>Type</b></li>
                        <li>The dates on which the Unit was added to the SAT and on which it was most recently updated</li>
                    </ul>
                    <p>Below the details about the Unit itself, there is a table of Items contained in that Unit. Each Item displays:</p>
                    <ul>
                        <li>A <b>Label</b>, which can be used to uniquely identify the Item</li>
                        <li>The <b>Category</b> of the Item</li>
                        <li>A button to view the <b>Item Details</b></li>
                        <li>An <b>Action</b> button, explained below</li>
                        <li>A <b>Status</b> flag indicating the Item's state</li>
                    </ul>
                    <p>The <b>Action</b> button can be one of two things:</p>
                    <ol>
                        <li>If the Item's Status is <b>OK</b> or <b>Inspect</b>, the button will read <b>Record Inspection</b>. Clicking it will allow you to record updates about the current state of the Item.</li>
                        <li>If the Item's Status is <b>Discard</b>, the button will read <b>Mark Discarded</b>. Clicking it will delete the Item from the Unit, indicating that the physical appliance or piece of furniture has been disposed of and is no longer present in the Location.</li>
                    </ol>
                    <h5>Flip Unit</h5>
                    <p>To change the status of all Items in a Unit to Inspect, you can click the <b>Flip Unit</b> button. You may wish to do this when a tenant moves out, when you believe there has been water damage in the building, or at other times. By flagging all Items Inspect, you signal to yourself and other Users that the Items need to be checked over.</p>
                    <h5>Differences on Mobile View</h5>
                    <p>If you are viewing the SAT on a small screen, such as a mobile phone, there is not enough room to display the table of Items. Instead, it will be formatted as a list of buttons. Each button will be labeled with the Label of the Item, and its Category in parentheses. Tapping on an Item button will take you directly to the Record Inspection page.</p>
                </div>
                <div className="row row-info general" id="general-items">
                    <h3>Items</h3>
                    <p>Items: Every appliance and piece of furniture owned by your organization is represented as an Item in the SAT. Each Item is distinct: a set of four dining chairs will be shown in the SAT as four Items. Every Item has some information to tell you what kind of Item it is, what condition it's in, when it was bought, where it is, and more.</p>

                    <h4>Item Details</h4>
                    <p>The Item Details page displays information about one specific Item.</p>
                    <ul>
                        <li><b>Label</b>: A unique identifier for one specific item. You can think of this as a more human-readable barcode or ID tag. When there are multiple Items in the same Unit and Category, the Label is how you differentiate between them. We encourage using a physical label-maker to print labels onto the appliance and pieces of furniture listed in the SAT.</li>
                    </ul>
                    <p className="guide-note">Note: For the labels in our initial inventory, we used: a 2- or 3-letter prefix to represent the Unit, a single word to represent the Category, sometimes abbreviated, and then a 2-digit number. For example, one of the office chairs in the boardroom is BR-CHAIR-04.</p>
                    <ul>
                        <li><b>Category</b>: The type of thing that the Item is. For example, an Item might be in the Category "Dining Chair" or "End Table" or "Twin Mattress".</li>
                        <li><b>Location</b>: the building or property where the Item is located</li>
                        <li><b>Unit</b>: the room or space within the Location where the Item is located</li>
                        <li><b>Status</b>: a flag that indicates whether action is needed on this Item, explained below</li>
                        <li><b>Comments</b>: a record of Comments that have been recorded about this Item, along with their Attachments. By default, only the most recent Comment is displayed. To view all Comments, click the "Show older comments" button. To view Comments that have Attachments, click the "Show all attachments" button. All Comments display the name of the User who made them, and the date on which they were made.</li>
                        <li><b>Attachment</b>: an image or PDF file that provides additional information about an Item. Attachments might include the invoice from the Item's purchase, an Item-specific insurance policy, or a photo that shows damage on an Item. You can click on image Attachments to preview them in the Preview Panel near the Comments display area. You can also click the Download button on any attachment to download it to your current device.</li>
                        <li><b>Acquired Date</b>: the date on which the Item was entered into the SAT. Ideally this is the same date the Item was brought into the Location, but that is not always the case.</li>
                        <li><b>Expected End of Life</b>: the date on which the Item is expected to no longer be in usable condition. This date is calculated based on the Category and Acquired Date of the Item and can be manually changed through the Record Inspection or Edit Item pages.</li>
                        <li><b>Vendor</b>: the vendor from which the Item was purchased</li>
                        <li><b>Invoice Number</b>: the invoice number from the purchase of the Item</li>
                        <li><b>Initial Value</b>: the amount of money that was paid for the Item when it was purchased. In cases where this value is unknown, it is filled in with the default value for Items of that Category.</li>
                        <li><b>Current Value</b>: the amount of money that the Item is currently worth in the eyes of the insurance provider.</li>
                    </ul>
                    <h5>Item Status</h5>
                    <p>The Status flag of an Item indicates whether action is needed. It has three possible options: OK, Inspect, and Discard.</p>
                    <p>An Item that is <b>OK</b> can be assumed to be in usable condition. No action is needed.</p>
                    <p>An Item flagged <b>Inspect</b> needs someone to look at it in person and evaluate whether or not it is still in usable condition.</p>
                    <p>An Item automatically gets flagged Inspect in a couple situations:</p>
                    <ul>
                        <li>When the date of the Item's Expected End of Life has passed</li>
                        <li>When the Unit is flipped</li>
                        <li>When a User flags the Item as needing inspection</li>
                    </ul>
                    <p>An Item flagged <b>Discard</b> is no longer in usable condition but is still present in the Location. The action required may be hauling it to the curb, calling a disposal service, and/or finding a replacement for the Item.</p>
                    <p className="guide-note">Note: Keeping the Status of Items up to date helps the Admin Users keep track of what they need to know for their budgeting and planning. The more they know about your condition and needs, the easier it is for them to help!</p>

                    <h4>Add Item</h4>
                    <p>When a new piece of furniture or appliance is purchased for your Location, it needs to be added as an Item in the SAT.</p>
                    <p>From the <b>Unit Details</b> page, you can click <b>Add Item</b> to add an Item to that specific Unit.</p>
                    <p>The <b>Unit</b>, <b>Location</b>, and <b>date added</b> will be filled out automatically. The Unit and Location are displayed on the form so you can make sure you're adding the item to the correct unit.</p>
                    <p>Each item needs a <b>Label</b>. Every item in a unit should have a different label. If there are multiple items in the same unit and the same category, we recommend using physical sticker labels. Some items are the only item of that category in that unit. In that case, it may not be necessary to use physical sticker labels. However, they still need a label inside the SAT.</p>
                    <p>You need to select the item's <b>Category</b> from a dropdown menu. Most categories of item are already in the list. If the category you're looking for is not available:</p>
                    <ol>
                        <li>You can select a category that is close enough.</li>
                        <li>The item may not need to be tracked. Refer to the note below about which items do not need to be entered.</li>
                        <li>You can contact Central Office to have a new category added to the SAT.</li>
                    </ol>
                    <p className="guide-note">Note: There are some items that do not need to be in the SAT. Small appliances and non-furniture items should not be entered. For example, toasters and lamps are not tracked. Items that are leased instead of owned, such as photocopiers and washing machines, should not be entered. Lastly, items that are owned by residents or staff members, and not by the organization, should not be entered.</p>
                    <p className="guide-note">Note: The Category of an item cannot be changed after the item is created.</p>
                    <p>The <b>Initial Value</b> will also be filled in automatically when you select a Category. If you have the actual purchase price of the item, erase the automatic value and fill in the actual value.</p>
                    <p>You should also fill in the <b>Vendor</b> and <b>Invoice Number</b> if you can find them. These should be provided by the vendor or store when you buy the item.</p>
                    <p>When you make changes to any field, the <b>Changes Dialogue</b> will appear at the bottom of the page. You can save your changes by clicking Save in the Changes Dialogue or at the top of the page.</p>
                    <p>After saving your changes, you will be automatically returned to the Item Details page, where your changes will be visible immediately.</p>
                    <p className="guide-note">Note: If you don't fill in all fields, you may not be able to save the item.</p>

                    <h4>Record Inspection</h4>
                    <p>If an Item has been in the SAT for a long time, if the Unit is being flipped, or if the Item has been damaged or changed, it is time to Record an Inspection. This is a <b>simple check-in</b> to make sure that the Item is still in usable condition.</p>
                    <p>If you need to update the Item in a more detailed way, you can instead go to the Item Edit page.</p>
                    <p>From the <b>Unit Details</b> page, you can click <b>Record Inspection</b> on any Item in the table. From the <b>Item Details</b> page, you can click the <b>Record Inspection</b> button located near the top of the page, under the header.</p>
                    <h5>Item Status</h5>
                    <p>You can change the <b>Status</b> of an Item by selecting a new status from the dropdown menu.</p>
                    <p>The Status flag of an Item indicates whether action is needed. It has three possible options: OK, Inspect, and Discard.</p>
                    <p>An Item that is <b>OK</b> can be assumed to be in usable condition. No action is needed.</p>
                    <p>An Item flagged <b>Inspect</b> needs someone to look at it in person and evaluate whether or not it is still in usable condition.</p>
                    <p>An Item automatically gets flagged Inspect in a couple situations:</p>
                    <ul>
                        <li>When the date of the Item's Expected End of Life has passed</li>
                        <li>When the Unit is flipped</li>
                        <li>When a User flags the Item as needing inspection</li>
                    </ul>
                    <p>An Item flagged <b>Discard</b> is no longer in usable condition but is still present in the Location. The action required may be hauling it to the curb, calling a disposal service, and/or finding a replacement for the Item.</p>
                    <p className="guide-note">Note: When an item is removed from the property, you can delete it by clicking Mark Discarded on that Item in the Unit Details page. You can also delete an Item by clicking the Delete Item button at the bottom of the Edit Item page.</p>
                    <h5>Update End of Life</h5>
                    <p>The <b>Update End of Life</b> field sets when the item will be flagged Inspect again. You can add years to it with the + button or subtract years from it with the - button. The new End of Life date will be displayed above the controls.</p>
                    <h5>Comments</h5>
                    <p>The <b>Comment</b> field is for any extra details or observations about the item. For example, you might comment that a table is wobbly and unstable. Comments will appear with your name and the date on the Item Details page.</p>
                    <h5>Attachments</h5>
                    <p>If you have an image or PDF file that provides additional information about an Item, you can attach it by selecting a file with the Browse… button under <b>Attachment</b>. Appropriate files include photos of damage to the Item, invoices, and specific insurance policies. You can only upload attachments in JPG, PNG, or PDF format.</p>
                    <p className="guide-note">Note: All submitted Attachments must be posted with a Comment that describes what the Attachment is and why it is important.</p>

                    <h4>Edit Item</h4>
                    <p>If you need to update more details than the Item Inspect page offers, or if you entered details incorrectly when adding an item, you can go to the Edit Item page.</p>
                    <p>From the Item Details page, click the <b>Edit or Move</b> button near the top of the page.</p>
                    <p>The Item Edit page allows you to update more fields. Like the Item Inspect page, you can still update the <b>Status</b>, add a <b>Comment</b>, and upload an <b>Attachment</b>.</p>
                    <p>The <b>Expected End of Life</b> field allows you to set a precise date for the item to be flagged Inspect again. When you save your changes, the date will be rounded to the nearest month from when the Item was added.</p>
                    <p>You can update the <b>Label</b> of an item.</p>
                    <p>You can move an Item from its current <b>Unit</b> to a different Unit in the same Location.</p>
                    <p>You can also update the <b>Invoice Number</b>, the <b>Vendor</b>, and the <b>Initial Value</b>. You should only update these fields if they were entered incorrectly when the item was created. The current value of an item is calculated automatically based on the item's initial value.</p>
                    <p className="guide-note">Note: You cannot change the Item's Category, its Location, or the date on which it was added.</p>
                    <p>When you make changes to any field, the <b>Changes Dialogue</b> will appear at the bottom of the page. You can save your changes by clicking Save in the Changes Dialogue or at the top of the page. If you enter a Comment, your name and the date will be recorded automatically.</p>
                    <p>After saving your changes, you will be automatically returned to the Item Details page, where your changes will be visible immediately.</p>

                    <h4>Delete Item</h4>
                    <p>When an item has been discarded and removed from the property, it should be deleted in the SAT.</p>
                    <p>If the Item is flagged Discard, the Action button on it from the Unit Details page will read <b>Mark Discarded</b>. Clicking this button will delete the Item from the SAT.</p>
                    <p>Alternatively, from Item Details, click Edit or Move at the top of the page. At the bottom of the Edit Item page, there is a <b>Delete Item</b> button.</p>
                    <p className="guide-note">Note: When you click Mark Discarded or Delete Item, the item will be deleted immediately.</p>
                    <p>After an item is deleted, you will be automatically returned to the Unit Details page. There will be a message at the top of the page informing you that the item has been deleted.</p>
                    <p className="guide-note">Note: If you delete an item by mistake, it can be restored. Contact Central Office with as much detail about the Item in the SAT as you can remember.</p>
                </div>
                <div className="row row-info general" id="general-profile">
                    <h3>Profile</h3>
                    <p>You can access your profile by clicking the Profile button in the header.</p>
                    <p>On the Profile page, the following fields are displayed:</p>
                    <ul>
                        <li><b>Name</b> is your name, which will be displayed on comments.</li>
                        <li><b>Email</b> is the email that will receive password updates and other notifications.</li>
                        <li><b>Admin</b> indicates whether you have admin privileges within the SAT.</li>
                        <li><b>Date Added</b> is the date your user information was added to the SAT.</li>
                        <li><b>Locations</b> is a list of locations that you can view. At your locations, you can add, inspect, edit, and delete items.</li>
                    </ul>
                    <p>At the top of the page, you can find the Edit and Reset Password buttons.</p>
                    <p><b>Edit</b> allows you to change your name and email address. If you would like to change the location(s) you're assigned to, contact Central Office.</p>
                    <p>When you click the <b>Reset Password</b> button, you'll be logged out. An email will be sent to you containing a new, temporary password and a link. When you click the link, you'll be asked to enter your email and the new password you'd like to use. Your new password must meet a certain complexity level. Once your new password is confirmed, you can log in again.</p>
                    <p className="guide-note">Note: Users can only be registered, deleted, or promoted to Admin by Admin users. There is no self-registration.</p>
                </div>
                { userDetails.isAdmin && <>
                    <h2 id="admin-heading">Guide for Admin Users</h2>
                    <div className="row row-info admin" id="admin-overview">
                        <h3>Admin Users</h3>
                        <p>Admin users can do everything that general users can. They have access to all locations in your organization's SAT. They also have a lot of extra features.</p>
                        <ul>
                            <li>Adding, editing, and removing <b>Locations</b> and <b>Units</b>.</li>
                            <li>Adding, editing, and removing <b>Categories</b> and <b>Users</b>.</li>
                            <li>Admin <b>Dashboard</b>, including summaries and CSV exports.</li>
                            <li><b>Settings</b> menu, for setting global information.</li>
                            <li><b>Restoring deleted</b> items, units, locations, and categories.</li>
                        </ul>
                        <p>At least one user of your organization's SAT must be an admin user. Admin users are all equally powerful; it is possible for an Admin User to promote other Users and to demote other Admin Users. Be careful who you grant this role to.</p>
                    </div>
                    <div className="row row-info admin" id="admin-dashboard">
                        <h3>Dashboard</h3>
                        <p>Most of the extra features that admin users have access to can be accessed through the <b>Admin Dashboard</b>. The link for the Dashboard is visible for Admin Users only in the header of each page.</p>
                        <h4>Overview</h4>
                        <p>The Dashboard provides an overview of the items in the SAT, sorted by Location. When you first load into the Dashboard, stats will be shown as a sum of all Locations. The total current value of all items in the SAT is displayed on the left of the page, under Overview.</p>
                        <h4>Item Counts</h4>
                        <p>On the right is a list of all categories and the number of items using each category, sorted by the categories with the most items first. You can click the triangle button at the top of each column to sort the table by that column.</p>
                        <h4>Items Overview</h4>
                        <p>Farther down on the page is the Items Overview. By default, this displays the Items that have been <b>flagged Discard</b> and have an End of Life date within the <b>current calendar year</b>.</p>
                        <p>If you wish to see Items that have been flagged Inspect or all Items, you can check and uncheck the respective checkboxes. If you wish to view Items within a different range of End of Life dates, you can set the Start Date and End Date. You can click the triangle button at the top of each column to sort the table by that column. Additionally, Items can be filtered with the search bar.</p>
                        <h4>CSV Exports</h4>
                        <p>Below the total value, you'll see three Report buttons under the CSV Exports heading. Clicking on one of these buttons will automatically <b>download a CSV file</b> with the corresponding information. CSV files can be opened with Excel and similar programs.</p>
                        <p className="guide-note">Note: CSV Exports will contain information about the Location specified in the Location Dropdown above, or All Locations.</p>
                        <ul>
                            <li>The <b>Financial Report</b> emphasizes the current and initial value of items.</li>
                            <li>The <b>Inventory Report</b> is a list of all items, pulled directly from the database.</li>
                            <li>The <b>End of Life Report</b> is a list of items with an End of Life date within the date range specified in the filters on the Items to Discard Soon section.</li>
                        </ul>
                    </div>
                    <div className="row row-info admin" id="admin-settings">
                        <h3>Settings</h3>
                        <p>The <b>Settings</b> page can be reached by clicking the Settings button at the top of the <b>Admin Dashboard</b>. On the Settings page, you can change some global settings.</p>
                        <ul>
                            <li><b>Organization Title</b>: Appears in the header and the footer of every page on the app.</li>
                            <li><b>Organization URL</b>: Appears in the footer of the app.</li>
                            <li><b>Global Depreciation Rate</b>: Used to calculate the Current Value of Items based on their Initial Value. The Current Value of all Items will change immediately if you update the Global Depreciation Rate. It is calculated using the double-decline method.</li>
                            <li><b>Possible Unit Types</b>: When creating a new Unit, this list will appear as a drop-down to select the Unit Type.</li>
                        </ul>
                    </div>
                    <div className="row row-info admin" id="admin-locations">
                        <h3>Locations</h3>
                        <p>A <b>Location</b> in the SAT corresponds to a physical building or property owned by your organization. A Location might be a house, a block of office space, or a storage facility, to name a few examples.</p>
                        <h4>Location List</h4>
                        <p>You can access the <b>Locations List</b> by clicking the <b>Inventory</b> button in the app's header, or by clicking the <b>See All</b> button at the top of any Location Details page.</p>
                        <p>The Locations List page displays a table of all Locations in your organization and the number of Units in each Location. You can click on the Details button to view the Location Details.</p>
                        <p className="guide-note">Note: Regardless of which Locations an Admin User is assigned to, they can see and interact with all Locations the same way.</p>

                        <h4>Add Location</h4>
                        <p>Click the <b>Add Location</b> button at the top of the <b>Locations List</b> page to add a new Location. The Location will be empty when it's created and will require Units before items can be added. When adding a Location, you need to assign one User to it.</p>

                        <h4>Edit Location</h4>
                        <p>From the <b>Location Details</b> page, click the <b>Edit Location</b> button at the top of the page. You can change the title and the first User. A list of Unit Types is displayed but cannot be edited. The Types of Units are pulled from the Units themselves.</p>

                        <h4>Delete Location</h4>
                        <p>From the <b>Edit Location</b> page, click the <b>Delete Location</b> button at the top of the page. The location will not be immediately deleted. Instead, you will see a page with the Changes Dialogue asking you whether you're sure you want to delete the location. Click Save on the Delete Location page to confirm that you wish to delete the location.</p>
                        <p className="guide-note">Note: You must delete the Units in a Location before you can delete the Location itself.</p>
                    </div>
                    <div className="row row-info admin" id="admin-units">
                        <h3>Units</h3>
                        <p>Most Locations are divided into multiple <b>Units</b>. Most of the time, a Unit is a room: one office, one bedroom, one storage area, etc. In some cases, a Unit might refer to an outdoor space, such as a patio or shed. Depending on your organization's needs, a Unit may also refer to an apartment consisting of multiple rooms.</p>
                        <h4>Add Unit</h4>
                        <p>On the <b>Location Details</b> page, click the <b>Add Unit</b> button at the top of the page. The Location Name will already be filled in. You will need to provide the Unit's Name and what Type of Unit it is. Types may only be selected from a dropdown.</p>
                        <p className="guide-note">Note: The list of Unit Types can be updated in the Settings menu.</p>

                        <h4>Edit Unit</h4>
                        <p>Click the <b>Edit Unit</b> button on the <b>Unit Details</b> page. You can change the Name and Type of the Unit, but not the Location it belongs to.</p>

                        <h4>Delete Unit</h4>
                        <p>From the <b>Edit Unit</b> page, click the <b>Delete Unit</b> button at the top of the page. The unit will not be immediately deleted. Instead, you will see a page with the Changes Dialogue asking you whether you're sure you want to delete the unit. Click Save on the Delete Unit page to confirm that you wish to delete the unit.</p>
                        <p className="guide-note">Note: You must delete the Items in a Unit before you can delete the Unit itself.</p>
                    </div>
                    <div className="row row-info admin" id="admin-categories">
                        <h3>Categories</h3>
                        <p>Every Item has a <b>Category</b>, which describes what type of Item it is. For example, the category of an Item might be "Dining Chair" or "Bedframe" or "Television". Categories help the Admin Users get data about the kinds of Items each Location has (or doesn't have). Categories are also used to fill in values that are unknown with default values. They can also be considered as templates for Items.</p>
                        <h4>All Categories</h4>
                        <p>To access the <b>All Categories</b> page, click the Categories button at the top of the <b>Admin Dashboard</b>. The Categories will be displayed in a table organized alphabetically by name. Each Category will display a couple details and a button to view its full Details.</p>

                        <h4>Category Details</h4>
                        <p>All Categories have the following data:</p>
                        <ul>
                            <li><b>Name</b>: a word or short phrase that describes the type of item. Examples: Fridge, Large Filing Cabinet, Dining Chair.</li>
                            <li><b>Single Resident</b>: If this field is checked off, the item can only be used by one resident. When the item is flagged because of flipping a Unit, it will be flagged Discard instead of Inspect. This is mostly applicable to mattresses.</li>
                            <li><b>Number of Items</b>: The number of items in your organization's SAT that use this category. This is calculated automatically.</li>
                            <li><b>Default Useful Life</b>: The length of time an item of this category can be expected to be in usable condition. This value is set in months but can be viewed in years as well. When an item is created, its Expected End of Life is calculated from its Added date and the Default Useful Life of its Category. When an item reaches its Expected End of Life date, it is automatically flagged Inspect.</li>
                            <li><b>Default Value</b>: The default or average value of items in this category, when bought new. If a User is Adding an Item and they do not know the purchase price of it, the Default Value from the Category will be filled in as an estimate.</li>
                        </ul>
                        <p className="guide-note">Note: The global Depreciation Rate for all items in the SAT can be set through the Settings menu.</p>

                        <h4>Create Category</h4>
                        <p>You can access the <b>Add Category</b> page by clicking the <b>Add Category</b> button at the top of the <b>All Categories</b> page.</p>
                        <p>A Category requires a <b>Name</b>, <b>Default Useful Life</b>, and <b>Default Value</b>.</p>
                        <p>The <b>Single Resident</b> checkbox will be set to false unless you click it.</p>

                        <h4>Edit Category</h4>
                        <p>From the <b>Category Details</b> page, click the <b>Edit</b> button at the top of the page.</p>
                        <p>You can alter the Category's <b>Name</b>, <b>Single Resident</b> checkbox, <b>Default Useful Life</b>, and <b>Default Value</b>.</p>
                        <p className="guide-note">Note: Changing the Default Value or Default Useful Life of a Category <b>does not</b> retroactively update the Initial Value or End of Life Date of all items belonging to that Category. Changing the Name of a Category <b>does</b> change the Category Name on all items that use it.</p>

                        <h4>Delete Category</h4>
                        <p>From the <b>Edit Category</b> page, click the <b>Delete</b> button. Clicking the Delete button will not instantly delete the Category. Instead, a confirmation page is shown. Click Save to confirm that you would like to delete the Category.</p>
                        <p className="guide-note">Note: You cannot delete a Category that is being used by Items.</p>
                    </div>
                    <div className="row row-info admin" id="admin-users">
                        <h3>Users</h3>
                        <p>A user account corresponds to one person who needs to communicate about the Items in the SAT. There are two types of Users: General and Admin.</p>
                        <p>You can access the <b>Users List</b> by clicking the <b>Users</b> button at the top of the <b>Admin Dashboard</b>.</p>

                        <h4>Add User</h4>
                        <p>To add a new User, click <b>Add User</b> from the <b>Users List</b> page.</p>
                        <p>Enter the new user's <b>Name</b> and <b>Email</b>. Check off the <b>Location(s)</b> where they work. If you are certain the user should have Admin privileges, you can check off the <b>Admin checkbox</b>.</p>
                        <p>When a User is created, an email will be sent to them asking them to set their password. The email may be directed to their spam folder. When the user receives the email, they will need to click on the link and enter their email address and the password they intend to use. The new password must meet a certain complexity level. Once the new password is set, the user will be able to log in.</p>
                        <p className="guide-note">Note: A general (non-admin) user who has no assigned Locations can't do anything useful with the SAT. All users should be assigned at least one Location.</p>

                        <h4>Edit a User</h4>
                        <p>From the <b>User Details</b> page, click the <b>Edit</b> button. You will be able to change their <b>Name</b>, <b>Email</b>, assigned <b>Locations</b>, and whether they're an <b>Admin</b>.</p>
                        <p className="guide-note">Setting a user to Admin allows them full access to everything. This includes the ability to edit other users and change the admin status of other users. It also includes the ability to view the dashboard and create, edit, and delete templates, locations, and units. Be careful who you grant this role to, and make sure at least one person is an admin.</p>

                        <h4>Delete User</h4>
                        <p>From the <b>Edit User</b> page, click the <b>Delete</b> button. The User will not be immediately deleted. You will be directed to a confirmation screen. Click Save to confirm that you want to delete the User.</p>
                        <p className="guide-note">Note: Deleting a User does not delete their comments and contributions. Their name may continue to appear in the SAT on their old actions. You may wish to change a former user's name before deleting them, for example, from Sam Jones to Staff1. The new name will appear in their comments and contributions.</p>
                        <p className="guide-note">Note: When Users are deleted, they are deleted permanently. If you wish to restore a deleted user, you must add them as if they are new.</p>
                    </div>
                    <div className="row row-info admin" id="admin-restore">
                        <h3>Restore Deleted</h3>
                        <p>Sometimes things get deleted by accident. You can <b>restore deleted</b> <b>Items</b>, <b>Units</b>, <b>Locations</b>, and <b>Categories</b> at any time. They are never completely removed from the system.</p>
                        <p className="guide-note">Note: When Users are deleted, they are deleted <b>permanently</b>. If you wish to restore a deleted user, you must add them as if they are new.</p>
                        <p>From the <b>Admin Dashboard</b>, click the <b>Restore Deleted Dropdown</b> on the top right corner of the page.</p>
                        <p>On each Restore Deleted page, the table of deleted things is organized in chronological order, with the most recently deleted things first. Simply click the <b>Restore</b> button to undo deleting the thing. Tables in Restore Deleted can be filtered with the Search bar.</p>
                    </div>
                </> }
            </div>
        </main>
    )
}

export default FAQ