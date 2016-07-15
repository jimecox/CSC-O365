SP.SOD.executeOrDelayUntilScriptLoaded(initializePage, "PS.js");

alert("r4")  // this will just run when page is loaded

var projContext;    //reference to the Project Context
var projects

$(document).on('click', '#Button1', function (e) {

    //alert("Button clicked")
    displayProjects()
});

function initializePage() {
    //setup event handlers etc
     
    //Get the Project context for this web
    projContext = PS.ProjectContext.get_current();

    var user = projContext.get_web().get_currentUser();
    projContext.load(user);

    projContext.executeQueryAsync(function () {
        //$("#message").text(user.get_title());
       // alert("Got Project Context for: " + user.get_title())

    }, onRequestFailed);


}


function onRequestFailed(sender, args) {

    alert("Failed to execute: " + args.get_message());

};




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

        var projectList = $('#ProjectList');
        projectList.empty();

        //provide UI cues to select data
        projectList.append($("<option></option>").attr("value", "").text("Select Project..."));

        var pEnum = projects.getEnumerator();
        while (pEnum.moveNext()) {
            var p = pEnum.get_current();

            var proj_id = p.get_id();
            var proj_name = p.get_name();
            var checkedOut = p.get_isCheckedOut();

           // projectList.append($("<option></option>").attr("value", proj_id).text(proj_name));
            
            // does not get to here for showing checked out
            if (checkedOut) {
                projectList.append($("<option></option>").attr("value", proj_id).text(proj_name + " [Checked Out]"));
            } else {
                projectList.append($("<option></option>").attr("value", proj_id).text(proj_name));
            }

        }

    }

    function executeQueryAsyncFailed() {

        alert("dam execute query failed")

    }

}; // end display projects


// populate the dropdown box pick list
displayProjects();