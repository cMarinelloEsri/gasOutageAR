//Database Object:  OutageTasks
//Rule Type:  Immediate Calculation
//Rule Name:  Set relight time when task is completed
//Description: Once Outage task is completed, set relight_time to 0
//Subtype:  All
//Field:  relight_time
//Editable:  true
//Trigger:  Update
//Triggering Fields:  esritask_status
//Error Code:  15
//Error Message:  Couldn't set relight_time
//Evaluate from application evaluation:  unchecked (false)

var completed = 4;  // from domain:  esritask_status
if ( $feature.esritask_status == completed ) { // if status is closed
    return 0;  //relight_time is set to 0 minutes
}
else {
    return;  // exit gracefully, don't change relight_time value
}