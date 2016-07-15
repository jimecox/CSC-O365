// Update project level data and create task, get one project then get tasks, then add one task
// must refernece coreFunctions.js
//alert("TasksAddNew 6")

var projGUID = "0edbc14c-3cbe-e511-82bd-54ee754cb9d8"
var project;
var taskName = "5 new task from CSC"
// using JSON as set of variables for update, can easily use Excel to gather vars and save as json
var myVariableData = [
        { customField: "Custom_f8181d7bbb13e61180d800155d88c40d", newValue: "holy crap6" },  // Sponsor
        { customField: "Custom_0000e8d965f147699bd2819d38036fcc", newValue: "Blocked" },     // health
        { startDate: "2016-05-05 09:00:00.000" },
];


function addOneTaskAndUpdateProjectFromJson() {
    projContext = PS.ProjectContext.get_current();
    projects = projContext.get_projects();
    projContext.load(projects, 'Include(Name, Id, StartDate, IsCheckedOut)');
    projContext.executeQueryAsync(
        function () {
        project = projects.getById(projGUID);
        projContext.load(project);
        projContext.executeQueryAsync(
            function () {
            alert("checking out: " + project.get_name());
            var draftProject = project.checkOut();     // Specify "true" to also check the project in.  
            projectTasks = draftProject.get_tasks();  //get the list of tasks in the target project
            projContext.load(projectTasks, 'Include(Id, Name, IsSummary, Start, IsManual, Parent, Duration, Parent.Id, Parent.Name)');
            projContext.executeQueryAsync(
                function () {
 // #### only change below this line 

                // update project level stuff
                draftProject.setCustomFieldValue(myVariableData[0].customField, myVariableData[0].newValue);
                draftProject.setCustomFieldValue(myVariableData[1].customField, myVariableData[1].newValue);
                draftProject.set_startDate(myVariableData[2].startDate);

                // create the task
                var newTask = new PS.TaskCreationInformation();
                var newId = SP.Guid.newGuid();
                newTask.set_id(newId);
               // var newTaskName = $("#anyValue").val();
                 //    alert(newTaskName)
                newTask.set_name(taskName)
                newTask.set_isManual(true);
                newTask.set_duration('100d');
                //newTask.set_start('Fri Jun 9 09:00:00 EDT 2016');
                projectTasks.add(newTask);

  // ###### do not change below this line

                var job = draftProject.update();  //save the tasks
                var publishJob = draftProject.publish(true);
                alert("publishing : " + project.get_name());
                projContext.waitForQueueAsync(publishJob, 30, waitForQueueCallback); //timeout duration and callback function

            }, addTaskCheckInProjectQueryFailed
            );

        }, projectQueryAsyncFailed
        );

    }, projectsQueryAsyncFailed
    );

    function addTaskCheckInProjectQueryFailed() {
    alert("dam addTaskCheckInProjectQueryFailed")
    };

    function projectsQueryAsyncFailed() {
        alert("dam projectsQueryAsyncFailed")
    };
    function projectQueryAsyncFailed() {
        alert("dam projectQueryAsyncFailed")
    };

}; // end function addOneTaskAndUpdateProjectFromJson
   



$(document).on('click', '#Button7', function (e) {
    //alert("Button clicked")
    addOneTaskAndUpdateProjectFromJson()
});
