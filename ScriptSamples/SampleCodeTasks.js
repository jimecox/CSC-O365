
function checkOutProjectAddOneTask() {

    // not showing code to load projects
    var project = projects.getById(targetGuid);
    alert("checking out: " + project.get_name());
    var projCheckedOut = project.checkOut();     // Specify "true" to also check the project in.

    projectTasks = projCheckedOut.get_tasks();  //get the list of tasks in the target project
    projContext.load(projectTasks, 'Include(Id, Name)');
    projContext.executeQueryAsync(addTaskCheckInProjectQuerySuccess, addTaskCheckInProjectQueryFailed);

    function addTaskCheckInProjectQuerySuccess() {

            // create the tasks
            var newTask = new PS.TaskCreationInformation();
            var newId = SP.Guid.newGuid();
            newTask.set_id(newId);
            var newTaskName = $("#anyValue").val();
            newTask.set_name(newTaskName)
            newTask.set_isManual(true);
            newTask.set_duration(100);
            newTask.set_start('Fri Sep 9 09:00:00 EDT 2016');
            projectTasks.add(newTask);

            var job = projCheckedOut.update();  //save the tasks
            var queue_job = projCheckedOut.publish(true); //publish and check back in
            projContext.waitForQueueAsync(queue_job, 60, waitForQueueCallback);
        }

}