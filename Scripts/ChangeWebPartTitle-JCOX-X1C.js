<script>

alert( "R4")  // this will just run when page is loaded

var siteUrl = '/teams/JcoxTeamSite/PWA';
var serverRelativeUrl = '/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/PDP-CSC.aspx';


//safely load JQuery on page load
if (typeof jQuery == 'undefined') {
    var s = document.createElement("script");
    s.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';
    if (s.addEventListener) {
        s.addEventListener("load", function () { myJQueryCode() }, false);
    } else if (s.readyState) {
        s.onreadystatechange = function () { myJQueryCode() };
    }
    document.getElementsByTagName('head')[0].appendChild(s);
} else {
    //alert("it did else and ran myJQueryCode")
    myJQueryCode();
}
// called when page loads
function myJQueryCode() {
    $(document).ready(function () {
        var scriptRoot = _spPageContextInfo.siteAbsoluteUrl + '/_layouts/15/';
       // alert("showing script root" + scriptRoot)
        $.when(
                $.getScript(scriptRoot + "clienttemplates.js"),
                $.getScript(scriptRoot + "clientforms.js"),
                $.getScript(scriptRoot + "clientpeoplepicker.js"),
                $.getScript(scriptRoot + "autofill.js")
            )
            .done(function () {
                window.console && console.log('Scripts loaded');
             //   alert('Scripts loaded')
               // updateWebPartTitle();
            })
            .fail(function (message) {
                window.console && console.error('Loading scripts failed: ' + message);
            });
    });
}

function updateWebPartTitle() {
    //alert("got to updateWebPartTitle function")
    this.clientContext = new SP.ClientContext(siteUrl);
    var oFile = clientContext.get_web().getFileByServerRelativeUrl(serverRelativeUrl);
   // alert("got var  ofile")
    var limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
    this.collWebPart = limitedWebPartManager.get_webParts();

    clientContext.load(collWebPart);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.changeTitle), Function.createDelegate(this, this.onQueryFailed));
}

function changeTitle() {
    alert("we will change title now")
    if (!collWebPart.get_count()) {
        alert('No Web Parts on this page.');
    }
    //alert("got into change title function")
    var oWebPartDefinition = collWebPart.get_item(2);
    this.oWebPart = oWebPartDefinition.get_webPart();
    oWebPart.set_title('4th Title');

    oWebPartDefinition.saveWebPartChanges();

    clientContext.load(oWebPart, 'TitleUrl');

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {

    alert('Title changed for Web Part: ' + this.oWebPart.get_titleUrl());
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}


$(document).on('click', '#addWP', function (e) {
    
    updateWebPartTitle()

});


</script>