<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage" %>

<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
   <SharePoint:ListProperty Property="Title" runat="server"/> - <SharePoint:ListItemProperty Property="BaseName" maxlength="40" runat="server"/>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">
   <WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar" AllowLayoutChange="false" AllowPersonalization="false" />
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
   <meta name="GENERATOR" content="Microsoft SharePoint" />
   <meta name="ProgId" content="SharePoint.WebPartPage.Document" />
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <meta name="CollaborationServer" content="SharePoint Team Web Site" />
   <script type="text/javascript">
      var navBarHelpOverrideKey = "wssmain";
   </script>
   
<SharePoint:ScriptLink name="PS.js" runat="server" ondemand="false" localizable="false" loadafterui="true" />
<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts-Framework/jquery-2.1.4.min.js"></script>
<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/CoreFunctions.js"></script> 
<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/ProjectGetDisplay.js"></script> 
<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/ProjectUpdateInclCFBadFunction.js"></script> 
<%--<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/CustomFieldGetUpdate.js"></script> --%>
<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/LookupTableGetUpdate.js"></script> 


</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderSearchArea" runat="server" />

<asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
   <asp:literal id="idPageDescription" runat="server" text="<%$Resources:PWA,PAGE_DESCRIPTION_PROJECTDETAILS%>" />
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderPageImage" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderLeftNavBar" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderNavSpacer" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <div class="button-panel">
          <h3>Example Buttons</h3>      
		<input id ="Button1" name="Button1" type="button" value="Get Projects" />
        <input id ="Button2" name="Button2" type="button" value="Update a Project" />
         <input id ="Button3" name="Button3" type="button" value="Display CF" />
        <input id ="Button4" name="Button4" type="button" value="Display LUT" />
    </div>
    <div>
          <h3>All Projects in EPM</h3>
        <p></p>
        <select id="ProjectList">
            <option value="volvo">this value here indicates a problem connecting to server proj ...</option>

        </select>
        <div id="showID"></div>

        <hr />

                  <h3>Custom Fields</h3>
        <p></p>
        <select id="cfList">
            <option value="cfmanual">this value here indicates a problem connecting to server cf...</option>

        </select>

                <hr />

                  <h3>Lookup Tables</h3>
        <p></p>
        <select id="lookupTableList">
            <option value="lutmanual">this value here indicates a problem connecting to server lut...</option>

        </select>

    </div>	


   <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Main" Title="<%$Resources:PWA, WEBPARTZONE_MAIN_TITLE%>" />
   <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Footer" Title="<%$Resources:PWA, WEBPARTZONE_FOOTER_TITLE%>" />
</asp:Content>


