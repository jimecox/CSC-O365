var projContext;
var pwaWeb;
var projUser;

// This code runs when the DOM is ready and creates a ProjectContext object.
// The ProjectContext object is required to use the JSOM for Project Server.
$(document).ready(function () {
    projContext = PS.ProjectContext.get_current();
    pwaWeb = projContext.get_web();

    getUserInfo();
    getAssignments();

    // Bind a click event handler to the table header check box, which sets the row check boxes
    // to the selected state of the header check box, and sets the results message to an empty string.
    $('#headercheckbox').live('click', function (event) {
        $('input:checkbox:not(#headercheckbox)').attr('checked', this.checked);
        $get("message").innerText = "";
    });

    // Bind a click event handler to the row check boxes. If any row check box is cleared, clear
    // the header check box. If all of the row check boxes are selected, select the header check box.
    $('input:checkbox:not(#headercheckbox)').live('click', function (event) {
        var isChecked = true;
        $('input:checkbox:not(#headercheckbox)').each(function () {
            if (this.checked == false) isChecked = false;
            $get("message").innerText = "";
        });
        $("#headercheckbox").attr('checked', isChecked);
    });
});

// Get information about the current user.
function getUserInfo() {
    projUser = pwaWeb.get_currentUser();
    projContext.load(projUser);
    projContext.executeQueryAsync(onGetUserNameSuccess,
        // Anonymous function to execute if getUserInfo fails.
        function (sender, args) {
            alert('Failed to get user name. Error: ' + args.get_message());
        });
}

// This function is executed if the getUserInfo call is successful.
// Replace the contents of the 'caption' paragraph with the project user name.
function onGetUserNameSuccess() {
    var prefaceInfo = 'Assignments for ' + projUser.get_title();

    $('#tableCaption').text(prefaceInfo);
}

// Get the collection of assignments for the current user.
function getAssignments() {
    assignments = PS.EnterpriseResource.getSelf(projContext).get_assignments();

    // Register the request that you want to run on the server. The optional "Include" parameter 
    // requests only the specified properties for each assignment in the collection.
    projContext.load(assignments,
        'Include(Project, Name, ActualWork, ActualWorkMilliseconds, PercentComplete, RemainingWork, Finish, Task)');

    // Run the request on the server.
    projContext.executeQueryAsync(onGetAssignmentsSuccess,
        // Anonymous function to execute if getAssignments fails.
        function (sender, args) {
            alert('Failed to get assignments. Error: ' + args.get_message());
        });
}

// Get the enumerator, iterate through the assignment collection, 
// and add each assignment to the table.
function onGetAssignmentsSuccess(sender, args) {
    if (assignments.get_count() > 0) {
        var assignmentsEnumerator = assignments.getEnumerator();
        var projName = "";
        var prevProjName = "3D2A8045-4920-4B31-B3E7-9D0C5195FC70"; // Any unique name.
        var taskNum = 0;
        var chkTask = "";
        var txtPctComplete = "";

        // Constants for creating input controls in the table.
        var INPUTCHK = '<input type="checkbox" class="chkTask" checked="checked" id="chk';
        var LBLCHK = '<label for="chk';
        var INPUTTXT = '<input type="text" size="4"  maxlength="4" class="txtPctComplete" id="txt';

        while (assignmentsEnumerator.moveNext()) {
            var statusAssignment = assignmentsEnumerator.get_current();
            projName = statusAssignment.get_project().get_name();

            // Get an integer value for the number of milliseconds of actual work, such as 3600000.
            var actualWorkMilliseconds = statusAssignment.get_actualWorkMilliseconds();
            // Get a string value for the assignment actual work, such as "1h". Not used here.
            var actualWork = statusAssignment.get_actualWork();

            if (projName === prevProjName) {
                projName = "";
            }
            prevProjName = statusAssignment.get_project().get_name();

            // Create a row for the assignment information.
            var row = assignmentsTable.insertRow();
            taskNum++;

            // Create an HTML string with a check box and task name label, for example:
            //     <input type="checkbox" class="chkTask" checked="checked" id="chk1" /> 
            //     <label for="chk1">Task 1</label>
            chkTask = INPUTCHK + taskNum + '" /> ' + LBLCHK + taskNum + '">'
                + statusAssignment.get_name() + '</label>';
            txtPctComplete = INPUTTXT + taskNum + '" />';

            // Insert cells for the assignment properties.
            row.insertCell().innerHTML = '<strong>' + projName + '</strong>';
            row.insertCell().innerHTML = chkTask;
            row.insertCell().innerText = actualWorkMilliseconds / 3600000 + 'h';
            row.insertCell().innerHTML = txtPctComplete;
            row.insertCell().innerText = statusAssignment.get_remainingWork();
            row.insertCell().innerText = statusAssignment.get_finish();

            // Initialize the percent complete cell.
            $get("txt" + taskNum).innerText = statusAssignment.get_percentComplete() + '%'
        }
    }
    else {
        $('p#message').attr('style', 'color: #0f3fdb');     // Blue text.
        $get("message").innerText = projUser.get_title() + ' has no assignments'
    }

    // Initialize the button properties.
    $get("btnSubmitUpdate").onclick = function () { updateAssignments(); };
    $get("btnSubmitUpdate").innerText = 'Update';
    $get('btnRefresh').onclick = function () { window.location.reload(true); };
    $get('btnExit').onclick = function () { exitToPwa(); };
}

// Update all selected assignments. If the bottom percent complete field is blank,
// use the value in the % complete field of each selected row in the table.
function updateAssignments() {
    // Get percent complete from the bottom text box.
    var pctCompleteMain = getNumericValue($('#pctComplete').val()).trim();
    var pctComplete = pctCompleteMain;
    var assignmentsEnumerator = assignments.getEnumerator();
    var taskNum = 0;
    var taskRow = "";
    var indexPercent = "";
    var doSubmit = true;

    while (assignmentsEnumerator.moveNext()) {
        var pctCompleteRow = "";
        taskRow = "chk" + ++taskNum;

        if ($get(taskRow).checked) {
            var statusAssignment = assignmentsEnumerator.get_current();

            if (pctCompleteMain === "") {
                // Get percent complete from the text box field in the table row.
                pctCompleteRow = getNumericValue($('#txt' + taskNum).val());
                pctComplete = pctCompleteRow;
            }

            // If both percent complete fields are empty, show an error.
            if (pctCompleteMain === "" && pctCompleteRow === "") {
                $('p#message').attr('style', 'color: #e11500');     // Red text.
                $get("message").innerHTML =
                    '<b>Error:</b> Both <i>Percent complete</i> fields are empty, in row '
                    + taskNum
                    + ' and in the bottom textbox.<br/>One of those fields must have a valid percent.'
                    + '<p>Please refresh the page and try again.</p>';
                doSubmit = false;
                taskNum = 0;
                break;
            }
            if (doSubmit) statusAssignment.set_percentComplete(pctComplete);
        }
    }

    // Save and submit the assignment updates.
    if (doSubmit) {
        assignments.update();
        assignments.submitAllStatusUpdates();

        projContext.executeQueryAsync(function (source, args) {
            $('p#message').attr('style', 'color: #0faa0d');     // Green text.
            $get("message").innerText = 'Assignments have been updated.';
        }, function (source, args) {
            $('p#message').attr('style', 'color: #e11500');     // Red text.
            $get("message").innerText = 'Error updating assignments: ' + args.get_message();
        });
    }
}

// Get the numeric part for percent complete, from a string. 
// For example, with "20 %", return "20".
function getNumericValue(pctComplete) {
    pctComplete = pctComplete.trim();
    pctComplete = pctComplete.replace(/ /g, "");    // Remove interior spaces.
    indexPercent = pctComplete.indexOf('%', 0);
    if (indexPercent > -1) pctComplete = pctComplete.substring(0, indexPercent);
    return pctComplete;
}

// Exit the QuickStatus page and go back to the Tasks page in Project Web App.
function exitToPwa() {
    // Get the SharePoint host URL, which is the top page of PWA, and add the Tasks page.
    var spHostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'))
                    + "/Tasks.aspx";

    // Set the top window for the QuickStatus IFrame to the Tasks page.
    window.top.location.href = spHostUrl;
}

// Get a specified query string parameter from the {StandardTokens} URL option string.
function getQueryStringParameter(urlParameterKey) {
    var docUrl = document.URL;
    var params = docUrl.split('?')[1].split('&');

    for (var i = 0; i < params.length; i++) {
        var theParam = params[i].split('=');

        if (theParam[0] == urlParameterKey)
            return decodeURIComponent(theParam[1]);
    }
}