// good working script depends on projectget.js

SP.SOD.executeOrDelayUntilScriptLoaded(initializePage, "PS.js");

alert("r3 on update proj script")  // this will just run when page is loaded

var projGUID = "0edbc14c-3cbe-e511-82bd-54ee754cb9d8"
var project;
var draft_project;
var sponsorCF = "Custom_f8181d7bbb13e61180d800155d88c40d"

function updateProject() {
    //alert("Got Project Context from for this user on init page: ")
    projContext = PS.ProjectContext.get_current();
    projects = projContext.get_projects();
    projContext.load(projects, 'Include(Name, Id, StartDate, IsCheckedOut)');
    //Send the request to the server
    projContext.executeQueryAsync(executeQueryAsyncSuccess, executeQueryAsyncFailed);

    //Display the projects in the drop downs and include the term checked out
    function executeQueryAsyncSuccess() {
        //alert(" got to executeQueryAsyncSuccess")
        //Create variable that will hold specific project information
        project = projects.getById(projGUID);
        projContext.load(project);
        projContext.executeQueryAsync(checkOutAndUpdateProject, executeQueryAsyncFailed);

        function checkOutAndUpdateProject() {
            var targetGuid = projGUID
            var project = projects.getById(targetGuid);
            alert("checking out: " + project.get_name());
            var draftProject = project.checkOut();     // Specify "true" to also check the project in.

            draftProject.set_startDate("2016-08-08 09:00:00.000");
            draftProject.setCustomFieldValue(sponsorCF, "Blocked");





            var publishJob = draftProject.publish(true);
            alert("publishing : " + project.get_name());
            // Register the job that you want to run on the server and specify the, timeout duration and callback function.
            projContext.waitForQueueAsync(publishJob, 30, waitForQueueCallback);
        }

        
    }

    function executeQueryAsyncFailed() {

        alert("dam execute query failed")

    }

}; // end display projects

// i put this in corefunctions.js
///* Callback for success/failure */
//function waitForQueueCallback(job_state) {
//    alert("did i get to queue callack")
//    switch (job_state) {
//        case PS.JobState.success:
//            alert("Successfully updated the project with name '" + project.get_name() + "'.");
//            break;
//        case PS.JobState.readyForProcessing:
//        case PS.JobState.processing:
//        case PS.JobState.processingDeferred:
//            alert("Updating the project with name '" + project.get_name() + "' is taking longer than usual.");
//            break;
//        case PS.JobState.failed:
//        case PS.JobState.failedNotBlocking:
//        case PS.JobState.correlationBlocked:
//            alert("Failed to update the project. The update job is in state " + job_state);
//            break;
//        default:
//            alert("Unknown error, job is in state " + job_state);
//    }
//};




// populate the dropdown box pick list
displayProjects();

$(document).on('click', '#Button2', function (e) {

    //alert("Button clicked")
    updateProject()
});