/* sample json file */
// ADD HEADER NAME AND ASSOCIATED ATTRIBUTES
var config_file = [
	{
		"Number_of_headers" : 6,

		"Headers" : [
			{
				"Header_Name" : "Sources", 
			  	"Header_ID" : 1,
			  	"Header_Info" : [
					{ "name" : "Total"},
					{ "name" : "UIHP"},
					{ "name" : "Harmony"}
				],
				"Header_Label" : "Difference Data Sources to drive other options"
			},
			{
				"Header_Name" : "Views", 
				"Header_ID" : 2,
				"Header_Info" : [
					{ "name" : "Eligible"},
					{ "name" : "Enrolled"}
				],
				"Header_Label" : "Difference Data Sources to drive other options"
			},
			{	
				"Header_Name" : "Age", 
				"Header_ID" : 3,
				"Header_Info" : [
					{ "name" : "Min" },
					{ "name" : "Max" },
				],
				"Header_Label" : "Different Ages for the data"
			},
			{
				"Header_Name" : "Encounters", 
				"Header_ID" : 4,
				"Header_Info" : [
					{ "name" : "IP" },
					{ "name" : "OP" },
					{ "name" : "NIPS" },
					{ "name" : "ED" }
				],
				"Header_Label" : "Patient Encounters based on InPatient, OutPatient or Third Party"
			},
			{	
				"Header_Name" : "Diseases", 
				"Header_ID" : 5,
				"Header_Info" : [
					{ "name" : "Asthma" },
					{ "name" : "Diabetes"},
					{ "name" : "SCD"},
					{ "name" : "Epilepsy"},
					{ "name" : "NewbornInjury"},
					{ "name" : "Prematurity"}
				],
				"Header_Label" : "Disease Groups in the study and the respective encounters"
			},
			{
				"Header_Name" : "Map Controls", 
				"Header_ID" : 6,
				"Header_Info" : [
					{ "Name"  : "Patient_Encounter"},
					{ "Name"  : "Patient_Charges"},
					{ "Name"  : "Disease_Encounters"}
				],
				"Header_Label" : "Different heatmap views based on charges, encounters and disease groups"
			}
		]
	},
	{
		"Sources" : [
			{ "name" : "Total", "title" : "Total patient population"},
			{ "name" : "UIHP", "title" : "Total patient population in UIHP"},
			{ "name" : "Harmony", "title" : "Total patient population in Harmony"}
		]
	},
	{
		"Views" : [
			{ "view_name" : "Eligible", "title" : "CHECK Eligible patient population"},
			{ "view_name" : "Enrolled", "title" : "CHECK Enrolled patient population"}
		],
		"View_Label" : "Difference Data Sources to drive other options"
	},
	{
		"Age" : [
			{ "min" : 0},
			{ "max" : 25}
		],
		"Age_Label" : "Different Ages for the data"
	},
	{
		"Encounters" : [
			{ "Encounter_Type" : "IP" },
			{ "Encounter_Type" : "OP" },
			{ "Encounter_Type" : "NIPS" },
			{ "Encounter_Type" : "ED" }
		],
		"Encounter_Label" : "Patient Encounters based on InPatient, OutPatient or Third Party"
	},
	{
		"Diseases" : [
			{ "Disease_Name" : "Asthma" },
			{ "Disease_Name" : "Diabetes"},
			{ "Disease_Name" : "SCD"},
			{ "Disease_Name" : "Epilepsy"},
			{ "Disease_Name" : "NewbornInjury"},
			{ "Disease_Name" : "Prematurity"}
		],
		"Disease_Label" : "Disease Groups in the study and the respective encounters"
	},
	{
		"Map_Controls" : [
			{ "Control"  : "Patient_Encounter"},
			{ "Control"  : "Patient_Charges"},
			{ "Control"  : "Disease_Encounters"}
		],
		"Map_Label" : "Different heatmap views based on charges, encounters and disease groups"
	}

];