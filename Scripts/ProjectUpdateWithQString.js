// get query string then update project level values incl custom field values
// todo get current project guid from query string
// use the REST interface get internal field name for JSON below or in a csv file: https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/CustomFields

// sendMsgToScreen("r2 Qstring")// this will auto run when page is loaded to prove page is fresh

//var projGUID = "0edbc14c-3cbe-e511-82bd-54ee754cb9d8"
var QStringParamaterName = "ProjUid"
//var QStringFullURL = "/teams/jcoxteamsite/pwa/project%20detail%20pages/projectdetails.aspx?projuid=0edbc14c-3cbe-e511-82bd-54ee754cb9d8&ret=0"
var QStringFullURL = window.location.href

var projGUIDFromQString = getQueryStringValueByName(QStringParamaterName, QStringFullURL)
//alert("projGUIDFromQString: " + projGUIDFromQString)
//var projName = "Test Project 1"

// using JSON as set of variables for update, can easily use Excel to gather vars and save as json
var myVariableData = [
        { customField: "Custom_f8181d7bbb13e61180d800155d88c40d", newValue: "holy crap2" },
        { customField: "Custom_0000e8d965f147699bd2819d38036fcc", newValue: "Blocked" },
        { startDate: "2016-02-02 09:00:00.000" },
];
//alert(myVariableData[2].startDate)

function updateProject() {
   // alert("Got here ")
    projContext = PS.ProjectContext.get_current();
    projects = projContext.get_projects();
    projContext.load(projects, 'Include(Name, Id, StartDate, IsCheckedOut)');
    //Send the request to the server
    projContext.executeQueryAsync(function () {

        var projNameById = GetNameById(projects, projGUIDFromQString)
       // alert(projNameById)
        sendProjNameToScreen("Project: " + projNameById)
        project = projects.getById(projGUID);
        projContext.load(project);
        projContext.executeQueryAsync(checkOutAndUpdateProject, projectQueryAsyncFailed);

    }, projectsQueryAsyncFailed
    );

    function checkOutAndUpdateProject() {
        alert("checking out: " + project.get_name());
        var draftProject = project.checkOut();     // Specify "true" to also check the project in.

        // update the objects for publishing
        draftProject.setCustomFieldValue(myVariableData[0].customField, myVariableData[0].newValue);
        draftProject.setCustomFieldValue(myVariableData[1].customField, myVariableData[1].newValue);
        draftProject.set_startDate(myVariableData[2].startDate);

        var publishJob = draftProject.publish(true);
        alert("publishing : " + project.get_name());
        // Register the job that you want to run on the server and specify the, timeout duration and callback function.
        projContext.waitForQueueAsync(publishJob, 30, waitForQueueCallback);
    };

    function projectsQueryAsyncFailed() {
        alert("dam projectsQueryAsyncFailed")
    };
    function projectQueryAsyncFailed() {
        alert("dam projectQueryAsyncFailed")
    };
}; // end update project function


$(document).on('click', '#Button2', function (e) {
    //alert("Button clicked")
    updateProject()
});




