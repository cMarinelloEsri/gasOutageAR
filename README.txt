On RDP server, make the following changese


STEP 1

Open the Python script in any text editor and make the following changes.

Script: 00 - Data Model Changes.py
--> Line 6  --> change the path to point to the enterprise database connection file (file extension is .sde)
--> Line 7  --> change line to be:  dbObjectPrefix = "napervillegas.gasowner"

Run the script in ArcGIS Pro in the Python window.


STEP 2.

In the following .JS scripts, replace "main." with "napervillegas.gasowner"

Script 1:  esriARTCalculation-- Create Outage Tasks.js
Script 2:  esriARTCalculation-- Update Outage Polygon Status once all tasks are completed.js




STEP 3.

In ArcGIS Pro, manually create the 4 attribute rules 