//Database Object:  OutagePolygons
//Rule Type:  Immediate Calculation
//Rule Name:  Create Outage Tasks
//Description: Once Outage is updated to Active, create tasks record for each meter in extent 
//Subtype:  All
//Field:  none
//Editable:  checked (true)
//Trigger:  Update
//Triggering Fields:  outage_status
//Error Code:  5
//Error Message:  Couldn't create outage Tasks records
//Exclude from application evaluation:  checked (true)

//The data type of Domain, Outage Status, is text.  When comparing values, the domain codes must be in quotes.
//var active = "1";  

//if outage status changed to Active, then create outage tasks records for all meters within the polygon extent.
//if ($feature.outage_status == active && $originalfeature.outage_status != active )
//{  
    var addsList = [];
    var pipelineLineFS = FeatureSetByName($datastore, "main.Pipeline_Device", ['OBJECTID', 'assetid'], true);
    var meterSubtypeCode = 2;  // Subtype value From GasDevice layer

    // FilterBySubtypeCode method is relatively new.  Be careful where this is used as not all apps (ex. Field Maps) recognize it yet.
    var intersectedFeatures = FilterBySubtypeCode(Intersects(pipelineLineFS, $feature), meterSubtypeCode);
    
    // Query local customer data
    var customerFS = FeatureSetByName($datastore, "main.CustomerData", ['assetid', 'name', 'address', 'number_'], false);
    
    for (var feat in intersectedFeatures) {
        var meterAssetId = feat.assetid;
        
        // Look up customer data by asset ID
        var lookupRecord = First(Filter(customerFS, `assetid = @meterAssetId`));
        
        // Skip if customer record not found
        if (lookupRecord == null) {
            continue;
        }

        var inspectionDetails = {
            'attributes': {
                'esritask_status' : 0, // Unassigned
                'outage_supervisor': $feature.outage_supervisor,
                'outage_name' : $feature.outage_name,
                'outage_number' : $feature.outage_number,
                'outage_level' :  $feature.outage_level,
                'relight_time' : 15, // minutes
                'guid' : $feature.globalid,
                'customer_name': lookupRecord.name,
                'address': lookupRecord.address,
                'customer_number': lookupRecord.number_
            },
            'geometry': Geometry(feat)  // geometry of the Meter
        }; 

        // Add this inspection details dictionary to the "Adds" List
        Push(addsList, inspectionDetails);
    }

    //Build edit payload dictionary
    if (Count(addsList) > 0) { 
        return {
            'edit': [{
                'className' : 'main.OutageTasks',
                'adds' : addsList
            }]
        };
    }
    else {  // no features to create.  Exit gracefully
        return;
    }
//}
//else { //status criteria not met.  Exit gracefully
//    return;
//}