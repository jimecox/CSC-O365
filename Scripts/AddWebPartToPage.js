// good article here https://msdn.microsoft.com/en-us/library/office/hh185010(v=office.14).aspx
//Things you need to know before starting- •WepPart Zone ID •WebPart Zone Index
//Now you need the XML of your client webpart (apppart) to add it programmatically.
//•To get this webpart XML add your client webpart to any page manually.
//•Edit webpart and allow exporting data.
//•Export the webpart (you will be prompted to save *.wepbart file)
//<script>
var webPartZoneID = 1
var webPartZoneIndex = 1
var pageName = "/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/PDP-CSC.aspx"

// put button here

$(document).on('click', '#addWP', function (e) {
    //alert(pageName)
    addClientWebPart(pageName, webPartZoneID, webPartZoneIndex)

});

function addClientWebPart(pageName,webPartZoneID,webPartZoneIndex) {
    alert("button clicked now at function r4")
    var site = context.get_site();
    var rootWeb = site.get_rootWeb();
    context.load(rootWeb, 'ServerRelativeUrl');
    context.load(site);
    context.executeQueryAsync(function () {

        var rootUrl = rootWeb.get_serverRelativeUrl();

        pageFile = rootWeb.getFileByServerRelativeUrl(rootUrl + "/Pages/" + pageName + '.aspx');
        alert(rootUrl)
        ////////////
        var limitedWebPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);

        var webPartXml = '<?xml version=\"1.0\" encoding=\"utf-8\"?>' +
            '<WebPart xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"' +
            ' xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"' +
            ' xmlns=\"http://schemas.microsoft.com/WebPart/v2\">' +
            '<Title>My Web Part</Title><FrameType>Default</FrameType>' +
            '<Description>Use for formatted text, tables, and images.</Description>' +
            '<IsIncluded>true</IsIncluded><ZoneID></ZoneID><PartOrder>0</PartOrder>' +
            '<FrameState>Normal</FrameState><Height /><Width /><AllowRemove>true</AllowRemove>' +
            '<AllowZoneChange>true</AllowZoneChange><AllowMinimize>true</AllowMinimize>' +
            '<AllowConnect>true</AllowConnect><AllowEdit>true</AllowEdit>' +
            '<AllowHide>true</AllowHide><IsVisible>true</IsVisible><DetailLink /><HelpLink />' +
            '<HelpMode>Modeless</HelpMode><Dir>Default</Dir><PartImageSmall />' +
            '<MissingAssembly>Cannot import this Web Part.</MissingAssembly>' +
            '<PartImageLarge>/_layouts/images/mscontl.gif</PartImageLarge><IsIncludedFilter />' +
            '<Assembly>Microsoft.SharePoint, Version=13.0.0.0, Culture=neutral, ' +
            'PublicKeyToken=94de0004b6e3fcc5</Assembly>' +
            '<TypeName>Microsoft.SharePoint.WebPartPages.ContentEditorWebPart</TypeName>' +
            '<ContentLink xmlns=\"http://schemas.microsoft.com/WebPart/v2/ContentEditor\" />' +
            '<Content xmlns=\"http://schemas.microsoft.com/WebPart/v2/ContentEditor\">' +
            '<![CDATA[This is a first paragraph!<DIV>&nbsp;</DIV>And this is a second paragraph.]]></Content>' +
            '<PartStorage xmlns=\"http://schemas.microsoft.com/WebPart/v2/ContentEditor\" /></WebPart>';

        var webPartDefinition = limitedWebPartManager.importWebPart(webPartXml);
        var webPart = webPartDefinition.get_webPart();

        limitedWebPartManager.addWebPart(webPart, webPartZoneID, webPartZoneIndex);

        context.load(webPart);

        context.executeQueryAsync(onAddAppPartQuerySucceeded, onAddAppPartQueryFailed);
    });
}

//</script>


