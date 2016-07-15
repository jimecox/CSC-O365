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
       <script src="Scripts/SampleCodeCustomField.js"></script>
   <script type="text/javascript">
      var navBarHelpOverrideKey = "wssmain";
   </script>
    <SharePoint:ScriptLink name="PS.js" runat="server" ondemand="false" localizable="false" loadafterui="true" />
<script src="https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts-Framework/jquery-2.1.4.min.js"></script>
<script src="/teams/JcoxTeamSite/PWA/Customisations/PWA-CSC/Scripts/SetURI.js"></script>

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
          <h3>App Settings R1</h3>      
        <input type="button" class="btn btn-info" id="addWP" value="Add Webpart" />
        <input type="button" id="btnLoadWebTitle" onclick="GetWebTitle();" value="Load2" />
    </div>


   <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Main" Title="<%$Resources:PWA, WEBPARTZONE_MAIN_TITLE%>" />
   <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Footer" Title="<%$Resources:PWA, WEBPARTZONE_FOOTER_TITLE%>" />
</asp:Content>


