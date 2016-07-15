// std REST call script to get tasks from project
// must refernece coreFunctions.js
// rest https://msdn.microsoft.com/en-us/library/office/dn776317.aspx or  https://msdn.microsoft.com/en-us/library/office/jj163049.aspx
// https://microsoft.sharepoint.com/teams/JcoxTeamSite/pwa/_api/ProjectData/$metadata

sendMsgToScreen("r6 TaskRest")
var projContext;    //reference to the Task Context
var projGUID = "0edbc14c-3cbe-e511-82bd-54ee754cb9d8"
var tasks
// get tagged milestones per ShowInReports custom field
var url = "https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectData/Tasks?$filter=ShowInReports eq 'PDPMilestones'&ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'&$select=ProjectName,TaskName,TaskId,TaskWork,ShowInReports,TaskStartDate"

var url2 = "https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/Projects('0edbc14c-3cbe-e511-82bd-54ee754cb9d8')/Tasks"

var url3 = "https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectData/Tasks?$filter=Health eq 'Late'&ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'"

var url4 = "https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectData/Tasks?$filter=Health eq 'Late'&ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'&$select=ProjectName,TaskName,TaskWork,Health"





$(document).on('click', '#Button8', function (e) {
    //alert("Button clicked")
    displayTasksREST()
});


function displayTasksREST() {

    alert("start");

    $.ajax({
        url: url,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            alert("Success");

            // start a table in html
            var cscTaskListDiv = $('#cscTaskListDiv');
            cscTaskListDiv.empty();
            var $table = $('<table id="cscTaskList">');
            $table.append('<thead><tr><th>ID</th><th>Name</th><th>Is CheckedOut</th><th>f1</th><th>F1</th><th>F3</th><th>F4</th><th>F5</th><th>F6</th><th>F7</th></tr></thead>');

            $.each(data.d.results, function (index, item) {
                // $('#tbNotifications').append("<li>" + "<h1>" + item.Title + "</h1>" + "<h2>" + item.Body + "</h2>" + "</li>");

                // loop through and make table rows
                $table.append('<tr><td>' + item.TaskId + '</td><td>' + item.TaskName + '</td><td>' + item.ShowInReports + '</td><td>' + item.TaskStartDate + '</td><td>' + item.Name + '</td><td>' + item.Name + '</td><td>' + item.Name + '</td><td>' + item.Name + '</td><td>' + item.Name + '</td><td>' + item.Name + '</td></tr>');

            });  // end of each

            // done looping so will finsh table html 
            $table.append('<tfoot><tr><th>Key</th><th>ID</th><th>Name</th><th>Duration</th><th>Start</th><th>Finish</th><th>Rem Dur</th><th>Owner</th><th>Top</th><th>Left</th></tr></tfoot><tbody>');
            $table.append('<tbody></tbody>');
            cscTaskListDiv.append($table)
            // End drawing table for tasks, now make it a DataTable which is fancy format with search capability
            $('#cscTaskList').DataTable();




        },
        error: function () {
            alert("Error");
            //alert(JSON.stringify(error));

        }
    });





}; // end display rest tasks

// old    /_api/ProjectServer/Projects('0edbc14c-3cbe-e511-82bd-54ee754cb9d8')/Tasks?$filter=startswith(Health,'Late')

///_api/ProjectData/Projects?$filter=ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'&$select=ProjectName,ProjectStartDate

///_api/ProjectData/Tasks()?$filter=TaskIndex gt 0&$orderby=ProjectName,TaskIndex&$select=ProjectName,TaskName,TaskWork

///_api/ProjectData/Tasks?$filter=ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'

///_api/ProjectData/Projects?$filter=ProjectStartDate gt datetime'2012-01-01T00:00:00'&$orderby=ProjectName&$select=ProjectName,ProjectStartDate,ProjectFinishDate,ProjectCost

//~/Assignments?$filter=ProjectId eq guid'263fc8d7-427c-e111-92fc-00155d3ba208' 


