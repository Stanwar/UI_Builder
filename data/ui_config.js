/* sample json file */
// ADD HEADER NAME AND ASSOCIATED ATTRIBUTES
var re_config_file = [
	{
		"Num_Page_Sections" : 3, // Max Sections : 4

		// Three sections
		"Page_Sections" : [
			{ 
				"Section_Name" : "PG_1" , 
				"Position" : "Left", 
				"Type" : "Sidebar"
			},
			{ 
				"Section_Name" : "PG_2" , 
				"Position" : "Right" , 
				"Type" : "Sidebar"
			},
			{ 
				"Section_Name" : "PG_3" , 
				"Position" : "Middle" , 
				"H_Position" : "Upper",
				"Type" : "Map"
			},
			{ 
				"Section_Name" : "PG_4" , 
				"Position" : "Middle" , 
				"H_Position" : "Lower",
				"Type" : "Table"
			}
			
		] 
		
	},
	{
		"Headers" : [
			{
				"Number_Of_Sections" : 8 ,
				"Headers" : [
					{
						"Header_Name" : "Risk Tier", 
					  	"Header_ID" : 1,
						"Header_Type" : "radioButton",
					  	"Header_Info" : [
							{ "name" : "Low",		"label" : "Low Risk Tier for food inspection"},
							{ "name" : "Medium", 	"label"  : "Medium Risk Tier for food inspection"},
							{ "name" : "High", 		"label" : "High Risk Tier for food inspection"}
						],
						"Header_Label" : "Difference Data Sources to drive other options"
					},
					{
						"Header_Name" : "Result", 
						"Header_ID" : 2,
						"Header_Type" : "radioButton",
						"Header_Info" : [
							{ "name" : "Pass","label" : "businesses that passed the inspection"},
							{ "name" : "Fail","label" : "businesses that failed the inspection"}
						],
						"Header_Label" : "Difference Data Sources to drive other options"
					},
					{
						"Header_Name" : "Sample ", 
						"Header_ID" : 2,
						"Header_Type" : "radioButton",
						"Header_Info" : [
							{ "name" : "Pass","label" : "businesses that passed the inspection"},
							{ "name" : "Fail","label" : "businesses that failed the inspection"},
							{ "name" : "Fail","label" : "businesses that failed the inspection"}
						],
						"Header_Label" : "Difference Data Sources to drive other options"
					},
					{
						"Header_Name" : "Categories", 
						"Header_ID" : 4,
						"Header_Type" : "checkBox",
						"Header_Info" : [
							{ "name" : "Bar" ,"label" : "InPatient Encounters","checked" : false},
							{ "name" : "Banquet" ,"label" : "OutPatient Encounters","checked" : false},
							{ "name" : "Cafeteria" ,"label" : "3rd Party","checked" : false},
							{ "name" : "Church" ,"label" : "Emergency Department Encounters","checked" : false},
							{ "name" : "DayCare" ,"label" : "Emergency Department Encounters","checked" : false},
							{ "name" : "Hospital" ,"label" : "Emergency Department Encounters","checked" : false},
							{ "name" : "Grocery" ,"label" : "Emergency Department Encounters","checked" : false}	
						],
						"Header_Label" : "Default Label "
					},
					{
						"Header_Name" : "Header-9// slider",
						"Header_ID" : 8,
						"Header_Info" : [
							{ "name" : "slider1", "Header_Min" : 0, "Header_Max" : 50, "Value" : 0},
							{ "name" : "slider2", "Header_Min" : 0, "Header_Max" : 100, "Value" : 1},
							{ "name" : "slider3", "Header_Min" : 0, "Header_Max" : 150, "Value" : 2}
						] ,
						"Header_Type" : "slider"
					}

				]
			}
		]
	}
];