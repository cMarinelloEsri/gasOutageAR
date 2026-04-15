//Database Object:  OutageTasks
//Rule Type:  Immediate Calculation
//Rule Name:  Polygon Outage Status Update
//Description: Set Outage Polygon Status to Resolved once all assigned tasks are completed
//Subtype:  All
//Field:  none
//Editable:  unchecked (false)
//Trigger:  Update
//Triggering Fields:  esritask_status
//Error Code:  17
//Error Message:  Couldn't close out outage polygon
//Exclude from application evaluation:  checked (true)

var completed = 4;
var outageNumber = $feature.outage_number;
var taskGlobalid = $feature.globalid;

// Check if task is NOT completed (rolled back to incomplete status)
if ($feature.esritask_status != completed) {
    // Task has been rolled back - check if polygon needs to be reverted
    var outagePolygonFS = FeatureSetByRelationshipClass($feature, 'main.OutagePolygons_OutageTasks', ['globalid', 'outage_status'], false);
    var outageFeature = First(outagePolygonFS);
    
    if (outageFeature != null && outageFeature.outage_status == "3") {
        // Polygon is currently resolved - roll it back to open status
        return {
            'edit': [{
                'className': 'main.OutagePolygons',
                'updates': [{
                    'globalid': outageFeature.globalid,
                    'attributes': {
                        'outage_status': "0",  // Roll back to open status
                        'outage_resolved_time': null  // Clear the resolved time
                    }
                }]
            }]
        };
    }
    return;  // Exit - polygon isn't resolved or task wasn't completed
}

//Query the Task Layer for records assigned to the current Outage name and whose status isn't Completed.
//  Don't query the record that is currently being edited.
var tasksFS = FeatureSetByName($datastore, 'main.OutageTasks', ['objectid', 'outage_number', 'esritask_status', 'globalid'], false);
var taskRec = First(Filter(tasksFS, `outage_number = @outageNumber and globalid <> @taskGlobalid and esritask_status <> @completed`)); 
if (taskRec == null)
{
    //all tasks for this outage are completed.  Update the outage polygon
    var outagePolygonFS = FeatureSetByRelationshipClass($feature, 'main.OutagePolygons_OutageTasks', ['globalid'], false);
    var outageFeature = First(outagePolygonFS);
    if (outageFeature != null)
    {
        return {
            'edit':  [{  //edit an external feature
                'className': 'main.OutagePolygons',   //This is the database object being updated
                'updates' : [{ 
                    'globalid' : outageFeature.globalid,
                    'attributes' : { 
                        'outage_status' : "3", //  Domain, Outage Status: 3 = resolved, 
                        'outage_resolved_time': Now()       // Current execution time
                    } 
                }]
            }]
        };
    }
    else {
        return;  //should never make it here
    }
}
else {
    return;  // There are Open tasks.  Exit gracefully
}