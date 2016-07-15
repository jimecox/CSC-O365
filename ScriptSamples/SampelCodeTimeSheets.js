string query = string.Format( "/ProjectData/Timesheets?$filter=(StartDate ge  datetime'{0}' and StartDate lt datetime'{1}')",

start.ToString( "yyyy-MM-ddTHH:mm:ss" ), 
end.ToString( "yyyy-MM-ddTHH:mm:ss" ) );
