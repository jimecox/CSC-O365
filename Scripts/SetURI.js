
alert( "R7")  // this will just run when page is loaded

var web;
var webPartPageName = "/default.aspx"

//var newExcelFileURL = "/teams/JcoxTeamSite/ProfitAndLossProject/Shared%20Documents/ProfitAndLoss2.xlsx"

function init() {
    var ctx = new SP.ClientContext();
    var pageRelativeUrl = _spPageContextInfo.webServerRelativeUrl + webPartPageName;
   // alert(pageRelativeUrl)
    var pageFile = ctx.get_web().getFileByServerRelativeUrl(pageRelativeUrl);
    var webPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
    var webPartDefs = webPartManager.get_webParts();
    ctx.load(webPartDefs, 'Include(WebPart)');
    ctx.executeQueryAsync(

        //on success of first ctx.load
      function () {
          for (var i = 0; i < webPartDefs.get_count() ; i++) {
              var webPartDef = webPartDefs.getItemAtIndex(i);
              var webPart = webPartDef.get_webPart();
          //alert(webPart.get_title());

          // second ctx.load
              ctx.load(webPart, 'Properties');
              ctx.executeQueryAsync(
                function () {
                    var properties = webPart.get_properties();
                    alert("Excel File Path " + properties.get_fieldValues()['WorkbookUri']);

                    // third ctx.load where we set the execl workbook url

                    var newExcelFileURL = _spPageContextInfo.webServerRelativeUrl + "/Shared%20Documents/ProfitAndLoss.xlsx"


                    var webpartprops = properties;
                    alert(webpartprops.get_item('WorkbookUri'));
                    webpartprops.set_item("WorkbookUri", newExcelFileURL);
                    webPartDef.saveWebPartChanges();
                    ctx.load(webPartDef);
                    ctx.executeQueryAsync(
                    function () {
                        alert("WebPart properties saved.");
                    },
                    function() 
                    {
                        alert("Failed save WebPart Properties"); 
                    });
                }, 
     

                      
               // },
                function (sender, args) {
                    alert("second error " + args.get_message());
                });

          }
      },
      // on error of first ctx.load
      function (sender, args) {
          alert(args.get_message());
      });
};

function updateWebPartTitle() {
    //alert("got to updateWebPartTitle function")
    this.clientContext = new SP.ClientContext();
    var pageRelativeUrl = _spPageContextInfo.webServerRelativeUrl + webPartPageName;

    var oFile = clientContext.get_web().getFileByServerRelativeUrl(pageRelativeUrl);
   // alert("got var  ofile")
    var limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
    this.collWebPart = limitedWebPartManager.get_webParts();

    clientContext.load(collWebPart);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.changeTitle), Function.createDelegate(this, this.onQueryFailed));
}

function changeTitle() {
    //alert("we will change title now")
    if (!collWebPart.get_count()) {
        alert('No Web Parts on this page.');
    }
    //alert("got into change title function")

    var oWebPartDefinition = collWebPart.get_item(0);

    this.oWebPart = oWebPartDefinition.get_webPart();
    oWebPart.set_title('8 Title');
    //alert(_spPageContextInfo.webServerRelativeUrl)


    //alert("got to before change uri")
    //oWebPart.set_workbookuri("/teams/JcoxTeamSite/ProfitAndLossProject/Shared%20Documents/ProfitAndLoss.xlsx");
   // alert("got to after change uri")
   

    oWebPartDefinition.saveWebPartChanges();

    clientContext.load(oWebPart, 'TitleUrl');

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {

    alert('Title changed for Web Part: ' + this.oWebPart.pageRelativeUrl);
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}


$(document).on('click', '#Button1', function (e) {
    //alert("click worked")
    //GetWebTitle()
   //  updateWebPartTitle()
    //init()
});


ExecuteOrDelayUntilScriptLoaded(init, 'sp.js')

