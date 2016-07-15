<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage" %>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    <sharepoint:listproperty property="Title" runat="server" />
    - 
    <sharepoint:listitemproperty property="BaseName" maxlength="40" runat="server" />
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <webpartpages:webpartzone runat="server" title="loc:TitleBar" id="TitleBar" allowlayoutchange="false" allowpersonalization="false" />
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="GENERATOR" content="Microsoft SharePoint" />
    <meta name="ProgId" content="SharePoint.WebPartPage.Document" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="CollaborationServer" content="SharePoint Team Web Site" />
    <script type="text/javascript">
        var navBarHelpOverrideKey = "wssmain";
    </script>

    <!-- Project Server Javascript Framework References-->
    <sharepoint:scriptlink name="PS.js" runat="server" ondemand="false" localizable="false" loadafterui="true" />

    <!-- CSS References-->
    <link href="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/css/AppCss.css" rel="stylesheet" />
    <link href="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/css/jquery.dataTables.css" rel="stylesheet" />
    <!-- Framework References-->
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts-Framework/jquery-2.1.4.min.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts-Framework/jquery.dataTables.min.js"></script>
    <!-- My JavaScript Files-->
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/CoreFunctions.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/ProjectGetDisplay.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/ProjectUpdateWithQString.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/CustomFieldGetUpdate.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/LookupTableGetUpdate.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/TasksGetDisplay.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/TasksCreateNew.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/TasksGetDisplayREST.js"></script>
    <script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/LookupTableCreateBulk.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderSearchArea" runat="server" />

<asp:Content ContentPlaceHolderID="PlaceHolderPageDescription" runat="server">
    <asp:Literal ID="idPageDescription" runat="server" Text="<%$Resources:PWA,PAGE_DESCRIPTION_PROJECTDETAILS%>" />
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageImage" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderLeftNavBar" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderNavSpacer" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
        <hr />

    <div  id="cscProjName"></div>

    <hr />
    <p>&nbsp</p>
    <div class="buttonPanel">
        <h3>My Sample CSC</h3>
        <p>&nbsp</p>
        <input id="Button1" name="Button1" type="button" value="Get Projects" />
        <input id="Button2" name="Button2" type="button" value="Update a Project" />
        <input id="Button6" name="Button6" type="button" value="Show Tasks" />
        <input id="Button8" name="Button8" type="button" value="REST Tasks" />
        <input id="Button3" name="Button3" type="button" value="Display/Create CF" />
        <input id="Button4" name="Button4" type="button" value="Display LUT" />
        <input id="Button9" name="Button9" type="button" value="Create LUT" />
        Enter Test Value<input type="text" id="anyValue" name="anyValueName" />
        <input id="Button5" name="Button5" type="button" value="Update LUT Health" />
        <input id="Button7" name="Button7" type="button" value="Create Task" />
    </div>
    <div>
        <hr />

            <!--Notifications area-->
   <%-- <h3>Notification Area</h3>--%>
    <div id="cscToolbar">
        <ul id="cscNotifications"></ul>
        <div  id="cscMessageArea"></div>
        <div class="box2" id="cscMessage"></div>
    </div>
        <%--<p>&nbsp</p><p>&nbsp</p>--%>
<%-- <hr />
        <p>&nbsp</p>--%>
        <h3>All Projects in EPM</h3>
        <p>&nbsp</p>
        <select id="projectPickList">
            <option value="volvo">this value here indicates a problem connecting to server proj ...</option>
        </select>
        <div id="showProjectID"></div>
        <hr />
        <p>&nbsp</p>
        <!-- Project Tabular Display area-->
        <div id="cscProjectListDiv">
            This is div that loads the data tables
        </div>
        <p>&nbsp</p>
        <hr />
        <p>&nbsp</p>

                <p>&nbsp</p>

        <h3>All Tasks On Hard coded Project</h3>
        <p>&nbsp</p>
        <select id="taskPickList">
            <option value="tasjxyz">this value here indicates a problem connecting to server task ...</option>
        </select>
        <div id="showTaskID"></div>
        <hr />

        <!-- Task Tabular Display area-->
        <div id="cscTaskListDiv">
            This is div that loads the data tables
        </div>
        <p>&nbsp</p>
        <hr />
        <p>&nbsp</p>
        <h3>Custom Fields</h3>
        <p>&nbsp</p>
        <select id="cfList">
            <option value="cfmanual">this value here indicates a problem connecting to server cf...</option>

        </select>

        <hr />

        <h3>Lookup Tables</h3>
        <p>&nbsp</p>
        <select id="lookupTableList">
            <option value="lutmanual">this value here indicates a problem connecting to server lut...</option>

        </select>

    </div>
    <hr />


    <webpartpages:webpartzone runat="server" frametype="TitleBarOnly" id="Main" title="<%$Resources:PWA, WEBPARTZONE_MAIN_TITLE%>" />
    <webpartpages:webpartzone runat="server" frametype="TitleBarOnly" id="Footer" title="<%$Resources:PWA, WEBPARTZONE_FOOTER_TITLE%>" />
</asp:Content>


