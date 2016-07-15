// std script to get tasks from project list, get one project then get tasks
// must refernece coreFunctions.js
//alert("TasksDispl R1")

var projContext;    //reference to the Task Context
var projGUID = "0edbc14c-3cbe-e511-82bd-54ee754cb9d8"
var tasks

$(document).on('click', '#Button6', function (e) {
    //alert("Button clicked")
    displayTasks(projGUID)
});

function displayTasks(projGUID) {
    projects = projContext.get_projects();
    projContext.load(projects, 'Include(Name, Id)');
    projContext.executeQueryAsync(loadProjectsSuccess, loadProjectsFailed);  //Sends the request to the server
    // alert if server get failed
    function loadProjectsFailed() {
        alert("dam loadProjectsFailed")
    };
   //request the tasks for the project
    function loadProjectsSuccess() {
        tasks = projects.getById(projGUID).get_tasks();
        //include the parent info as well, we can build a hierarchy of parent/child tasks
        projContext.load(tasks, 'Include(Id, Name, IsSummary, Start, IsManual, Parent, Duration, Parent.Id, Parent.Name)');
        projContext.executeQueryAsync(executeTaskQueryAsyncSuccess, executeTaskQueryAsyncFailed);
    };
    // alert if server get failed
    function executeTaskQueryAsyncFailed() {
        alert("dam executeTaskQueryAsyncFailed")
    };
    
    //Display the tasks in the drop down pick list
    function executeTaskQueryAsyncSuccess() {
        var taskPickList = $('#taskPickList');
        taskPickList.empty();
        //Populate Pick List
        taskPickList.append($("<option></option>").attr("value", "").text("Select Task..."));

        // Display messages if necessary
        var cscMessageArea = $('#cscMessageArea');
        cscMessageArea.empty();
        cscMessageArea.append('<p>Test Task Message</p>');
        
        // make a table in html of the tasks
        var cscTaskListDiv = $('#cscTaskListDiv');
        cscTaskListDiv.empty();
        var $table = $('<table id="cscTaskList">');
        $table.append('<thead><tr><th>ID</th><th>Name</th><th>Is CheckedOut</th><th>f1</th><th>F1</th><th>F3</th><th>F4</th><th>F5</th><th>F6</th><th>F7</th></tr></thead>');
        // loop through and make table
        var taskEnum = tasks.getEnumerator();
        while (taskEnum.moveNext()) {
            var task = taskEnum.get_current();
            var task_id = task.get_id();
            var task_name = task.get_name();
            var startDate = task.get_start();
            // here is where we draw each row in table
            $table.append('<tr><td>' + task_id + '</td><td>' + task_name + '</td><td>' + startDate + '</td><td>' + startDate + '</td><td>' + startDate + '</td><td>' + startDate + '</td><td>' + startDate + '</td><td>' + startDate + '</td><td>' + startDate + '</td><td>' + startDate + '</td></tr>');
            taskPickList.append($("<option></option>").attr("value", task_id).text(task_name));
            // show guid on screen for now
            $("#showTaskID").text("Showing GUId of last project " + task_id);
            }
               // done looping so will finsh table html 
        $table.append('<tfoot><tr><th>Key</th><th>ID</th><th>Name</th><th>Duration</th><th>Start</th><th>Finish</th><th>Rem Dur</th><th>Owner</th><th>Top</th><th>Left</th></tr></tfoot><tbody>');
        $table.append('<tbody></tbody>');
        cscTaskListDiv.append($table)
        // End drawing table for tasks, now make it a DataTable which is fancy format with search capability
        $('#cscTaskList').DataTable();
    }

}; // end display tasks

