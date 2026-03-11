import arcpy
from arcgisscripting import ExecuteError

#==============
# These 2 variables to change when running against the enterprise GDB
#==============
arcpy.env.workspace = r"C:\Users\chr14752\Documents\Projects\GasOutage\gasOutageData.geodatabase"
dbObjectPrefix = "main"
#dbObjectPrefix = "napervillegas.gasowner"
#==============

outageNumberField = "outage_number"

try:
    print("creating sequence generator")
    arcpy.management.CreateDatabaseSequence(in_workspace=arcpy.env.workspace, 
                                            seq_name="outage_id_seq", 
                                            seq_start_id=1, 
                                            seq_inc_value=1)
    print(arcpy.GetMessages())
except ExecuteError as e:
    if "already exists" in str(e):
        print("Sequence already exists, skipping creation")
    else:
        raise

tablesToDropField = [f"{dbObjectPrefix}.OutagePolygons", f"{dbObjectPrefix}.OutageTasks"]

# Drop field with short datatype
for tb in tablesToDropField :   
    print(f"Dropping field outage_id from Table {tb}")
    
    arcpy.management.DeleteField(in_table= f"{arcpy.env.workspace}//{tb}", 
    ##arcpy.management.DeleteField(in_table= f"{arcpy.env.workspace}//{dbObjectPrefix}.GasOutage//{tb}", 
                                 drop_field= outageNumberField, 
                                 method= "DELETE_FIELDS")
                              
    print(arcpy.GetMessages())
    print("")

# Add field with long datatype
for tb in tablesToDropField :   
    print(f"Adding field {outageNumberField} with Long datatype to {tb} ")
                                   
    arcpy.management.AddField(
        in_table= f"{arcpy.env.workspace}//{tb}",
        ##in_table= f"{arcpy.env.workspace}//{dbObjectPrefix}.GasOutage//{tb}",
        field_name= outageNumberField,
        field_type="LONG",
        field_precision=None,
        field_scale=None,
        field_length=64,
        field_alias="Outage Number",
        field_is_nullable="NULLABLE",
        field_is_required="NON_REQUIRED",
        field_domain=""
    )
    
    print(arcpy.GetMessages())
    print("")

print("================")                            
print("All done")