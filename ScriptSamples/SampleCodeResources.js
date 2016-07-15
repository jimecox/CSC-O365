
rest https://msdn.microsoft.com/en-us/library/office/dn776317.aspx
~/_api/projectdata/Resources?$select=ResourceId,ResourceName,ResourceIsActive,ResourceGroup


powershell

#Get all the resources
$EntResources=$prjclientContext.EnterpriseResources
$prjclientContext.Load($EntResources)
$prjclientContext.ExecuteQuery()

#iterate through all the resources and display some information about them
foreach ($EntRes in $EntResources)
{
    $name=$EntRes.Name
    $ResType=$EntRes.ResourceType
    $email=$EntRes.Email
    $Id=$EntRes.Id
    Write-Host "Name: “ $name “ ; ResourceType: “ $ResType “  ; Email: “ $email “ ; Guid: “ $Id
}



2nd script: to update an enterprise Resource Name using its GUID

# the path here may need to be change if you used e.g. C:\Lib.. 
# this is the default path for a server running Project Server 2013
Add-Type -Path "c:\Program Files\Common Files\microsoft shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.dll" 
Add-Type -Path "c:\Program Files\Common Files\microsoft shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.Runtime.dll" 
Add-Type -Path "c:\Program Files\Common Files\microsoft shared\Web Server Extensions\15\ISAPI\Microsoft.ProjectServer.Client.dll" 

# Specify the URL of the PWA site;
# Windows authentication is used
$url = "http://servername/pwa"

#creating  the Project context
$prjclientContext = New-Object Microsoft.ProjectServer.Client.ProjectContext($url)

#Specify the Enterprise Resource GUID to update
$entResUid = "1c5953b5-f2ea-e311-93fa-00155d00752a"
#Specify the new name to use
$newName = "Microsoft 001"

#Get the resource object
$res=$prjclientContext.EnterpriseResources.GetById($entResUid)
$prjclientContext.Load($res)
$prjclientContext.ExecuteQuery()

Write-Host "Current User name is: “ $res.Name

#Checking is Enterprise Resource is available for update (not checked out)
if ($res.IsCheckedOut)
{ 
    Write-Host "User “ $res.Name  “is checked out, it cannot be updated" 
}
else
{
    #update the value
    $res.Name = $newName
    $prjclientContext.EnterpriseResources.Update()
    $prjclientContext.ExecuteQuery()


    #Checking the new value
    $res=$prjclientContext.EnterpriseResources.GetByid($entResUid)
    $prjclientContext.Load($res)
    $prjclientContext.ExecuteQuery()
    Write-Host "New User name is:” '$res.Name
}




    // more


I am trying to access the calendar exception for each resource, but I'm having some trouble with the nested executeQueryAsync() 
calls. 

Here's a piece of my code:

App.js
    // Get the collection of enterprise resources.
function GetResources()
{   
    // Display a message to the user to show we are reading the resources. 
    $('#spanMessage').text('Reading resources...');

    // Initialize the current client context.
    projContext = PS.ProjectContext.get_current();

    // Get the collection of enterprise resources.
    resources = projContext.get_enterpriseResources();

    // Register the request for information.
    projContext.load(resources);

    // Run the request on the server.
    projContext.executeQueryAsync(IterateThroughResources, QueryFailed);
}

function IterateThroughResources(response)
{
    // Get the enumerator and iterate through the collection.
    var enumerator = resources.getEnumerator();
    while (enumerator.moveNext()) 
{
        var resource = enumerator.get_current();
        var resourceId = resource.get_id(); 
        var resourceName = resource.get_name();

    // Get the collection of calendar exceptions.
        var exceptions = resource.get_resourceCalendarExceptions();

    // Register the request for information that you want to run on the server.
        projContext.load(exceptions);

        projContext.executeQueryAsync(Function.createDelegate(this, function(){IterateThroughCalendarExceptions(resource, exceptions);}), QueryFailed);
}
}

    function IterateThroughCalendarExceptions(resource, exceptions)
    {
        var enumerator = exceptions.getEnumerator();
        while (enumerator.moveNext()) 
        {
            var exception = enumerator.get_current();
            var name = exception.get_name();
        }
    }
 

To prevent that, you have to wrap your function like that:
projContext.executeQueryAsync(
(function()
{
    IterateThroughCalendarExceptions(resource, exceptions);
})(resource, exceptions),
QueryFailed);
