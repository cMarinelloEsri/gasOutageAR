//Database Object:  OutageTasks
//Rule Type:  Immediate Calculation
//Rule Name:  Update Outage Polygon Status once all tasks are completed
//Description: Set Outage Polygon Status to Resolved once all assigned tasks are completed
//Subtype:  All
//Field:  none
//Editable:  unchecked (false)
//Trigger:  Update
//Triggering Fields:  esritask_status
//Error Code:  17
//Error Message:  Couldn't close out outage polygon
//Evaluate from application evaluation:  checked (true)

var completed = 4;
if ($feature.esritask_status != completed) {  // exit gracefully if task status isn't completed.
    return;
}

var outageNumber = $feature.outage_number;
var taskGlobalid = $feature.globalid;

//Query the Task Layer for records assigned to the current Outage name and whose status isn't Completed.
//  Don't query the record that is currently being edited.
var tasksFS = FeatureSetByName($datastore, 'main.OutageTasks', ['objectid'], false);
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
                        'outage_status' : "3" //  Domain, Outage Status: 3 = resolved, 
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