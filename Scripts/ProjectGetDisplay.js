
//alert("6 on get project script")  // this will just run when page is loaded
//SP.SOD.executeOrDelayUntilScriptLoaded(initializePage, "PS.js");

//alert("displ proj r3")

var projContext;    //reference to the Project Context
var projects

$(document).on('click', '#Button1', function (e) {
    //alert("Button clicked")
    displayProjects()
});

function displayProjects() {
    //Project List information will be placed inside projects variable
    projects = projContext.get_projects();

    //Signal the information that is going to be loaded
    projContext.load(projects, 'Include(Name, Id, IsCheckedOut)');

    //Send the request to the server
    projContext.executeQueryAsync(executeQueryAsyncSuccess, executeQueryAsyncFailed);

    
    //Display the projects in the drop downs and include the term checked out
    function executeQueryAsyncSuccess() {
        //alert("executeQueryAsyncSuccess")

        var projectPickList = $('#projectPickList');
        projectPickList.empty();

        //Populate Pick List
        projectPickList.append($("<option></option>").attr("value", "").text("Select Project..."));

        // Display Projects
        var cscMessageArea = $('#cscMessageArea');
        cscMessageArea.empty();
        cscMessageArea.append('<p>Test in Message area</p>');

        var cscProjectListDiv = $('#cscProjectListDiv');
        cscProjectListDiv.empty();
        var $table = $('<table id="cscProjectList">');
        $table.append('<thead><tr><th>ID</th><th>Name</th><th>Is CheckedOut</th><th>f1</th><th>F1</th><th>F3</th><th>F4</th><th>F5</th><th>F6</th><th>F7</th></tr></thead>');
        
        // loop through and make table
        var pEnum = projects.getEnumerator();
        while (pEnum.moveNext()) {
            var p = pEnum.get_current();
            var proj_id = p.get_id();
            var proj_name = p.get_name();
            var checkedOut = p.get_isCheckedOut();
            // here is makes each row
            $table.append('<tr><td>' + proj_id + '</td><td>' + proj_name + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td><td>' + checkedOut + '</td></tr>');

            // make pick list if project is checke out
            if (checkedOut) {
                projectPickList.append($("<option></option>").attr("value", proj_id).text(proj_name + " [Checked Out]"));
            } else {
                projectPickList.append($("<option></option>").attr("value", proj_id).text(proj_name));

                $("#showProjectID").text("Showing GUId of last project " + proj_id);
            }

        }
        // done looping so will finsh table html 
        $table.append('<tfoot><tr><th>Key</th><th>ID</th><th>Name</th><th>Duration</th><th>Start</th><th>Finish</th><th>Rem Dur</th><th>Owner</th><th>Top</th><th>Left</th></tr></tfoot><tbody>');
        $table.append('<tbody></tbody>');
        cscProjectListDiv.append($table)
        // End Display Projects
       // $('#cscProjectList').DataTable();
    }

    function executeQueryAsyncFailed() {

        alert("dam execute query failed")

    }

}; // end display projects






// put in corefunctions.js
//function initializePage() {
//    //setup event handlers etc

//    //Get the Project context for this web
//    projContext = PS.ProjectContext.get_current();

//    var user = projContext.get_web().get_currentUser();
//    projContext.load(user);

//    projContext.executeQueryAsync(function () {
//        //$("#message").text(user.get_title());
//       // alert("Got Project Context for: " + user.get_title())

//    }, onRequestFailed);
//}
//function onRequestFailed(sender, args) {
//    alert("Failed to execute: " + args.get_message());
//};
