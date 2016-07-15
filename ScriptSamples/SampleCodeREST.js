// std REST call script to get tasks from project
// must refernece coreFunctions.js
// rest https://msdn.microsoft.com/en-us/library/office/dn776317.aspx or  https://msdn.microsoft.com/en-us/library/office/jj163049.aspx
// https://microsoft.sharepoint.com/teams/JcoxTeamSite/pwa/_api/ProjectData/$metadata

sendMsgToScreen("r3 TaskRest")
var projContext;    //reference to the Task Context
var projGUID = "0edbc14c-3cbe-e511-82bd-54ee754cb9d8"
var tasks
var url = "https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/CustomFields"

var url = "https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/Projects('0edbc14c-3cbe-e511-82bd-54ee754cb9d8')/Tasks"

// old    /_api/ProjectServer/Projects('0edbc14c-3cbe-e511-82bd-54ee754cb9d8')/Tasks?$filter=startswith(Health,'Late')

/_api/ProjectData/Projects?$filter=ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'&$select=ProjectName,ProjectStartDate

/_api/ProjectData/Tasks()?$filter=TaskIndex gt 0&$orderby=ProjectName,TaskIndex&$select=ProjectName,TaskName,TaskWork

/_api/ProjectData/Tasks?$filter=ProjectId eq guid'0edbc14c-3cbe-e511-82bd-54ee754cb9d8'/IncludeCustomFields

/PWA/_api/ProjectServer/Projects('0edbc14c-3cbe-e511-82bd-54ee754cb9d8')/IncludeCustomFields/Tasks

IncludeCustomFields

/_api/ProjectData/Projects?$filter=ProjectStartDate gt datetime'2012-01-01T00:00:00'&$orderby=ProjectName&$select=ProjectName,ProjectStartDate,ProjectFinishDate,ProjectCost

~/Assignments?$filter=ProjectId eq guid'263fc8d7-427c-e111-92fc-00155d3ba208' 
