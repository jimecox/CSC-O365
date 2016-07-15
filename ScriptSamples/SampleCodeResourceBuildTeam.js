Below is my code which is not working . Please suggest alternate solution



function ChangeProject() {
    	    
    var projContext= PS.ProjectContext.get_current();

    var targetGuid = "fa3c752c-17cf-e511-80cd-00155d1c3214";

    var project = PS.Collection.getByGuid(targetGuid);	
    var draftProject = project.checkOut();

    var object = new PS.ProjectResourceCreationInformation();
    object.email = "abc.k@abc.com";
    object.Id = "8fae2783-94ab-e411-8bdd-00155d189705";
		
    draftProject.update(object);	
    var publishJob = draftProject.publish(true);

    projContext.waitForQueueAsync(publishJob, 10, QueueJobSent);
}

