//Database Object:  OutagePolygons
//Rule Type:  Immediate Calculation
//Rule Name:  Populate Outage Number
//Description: On creation, get the vext value from sequence generator
//Subtype:  All
//Field:  outage_number
//Editable:  checked (true)
//Trigger:  Insert
//Error Code:  2
//Error Message:  Couldn't get next outage id sequence
//Exclude from application evaluation:  checked (true)

return NextSequenceValue('outage_id_seq');