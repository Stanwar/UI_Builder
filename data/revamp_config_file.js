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
						"Header_Name" : "Header-1// radioButton", 
					  	"Header_ID" : 1,
						"Header_Type" : "radioButton",
					  	"Header_Info" : [
							{ "name" : "One",		"label" : "Aggregating all Data Sources"},
							{ "name" : "Two", 		"label"  : "Data from UIHP"},
							{ "name" : "Three", 	"label" : "Data from label"}
						],
						"Header_Label" : "Difference Data Sources to drive other options"
					},
					{
						"Header_Name" : "Header-2// radioButton", 
						"Header_ID" : 2,
						"Header_Type" : "radioButton",
						"Header_Info" : [
							{ "name" : "rdio_1","label" : "Radio Button : 1"},
							{ "name" : "rdio_2","label" : "Radio Button : 2"}
						],
						"Header_Label" : "Difference Data Sources to drive other options"
					},
					{
						"Header_Name" : "Header-3// checkBox", 
						"Header_ID" : 2,
						"Header_Type" : "checkBox",
						"Header_Info" : [
							{ "name" : "Chk_1","label" : "Check Box : 1"},
							{ "name" : "Chk_2","label" : "Check Box : 2"},
							{ "name" : "Chk_3","label" : "Enrolled Data Source"}
						],
						"Header_Label" : "Difference Data Sources to drive other options"
					},
					{	
						"Header_Name" : "Header-4// radioButton", 
						"Header_ID" : 3,
						"Header_Type" : "radioButton",
						"Header_Info" : [
							{ "name" : "Min" ,"label" : "Minimum Value"},
							{  "name" : "Max" ,"label" : "Maximum Value"},
						],
						"Header_Label" : "Different Ages for the data"
					},
					{
						"Header_Name" : "Header-5// checkBox", 
						"Header_ID" : 4,
						"Header_Type" : "checkBox",
						"Header_Info" : [
							{ "name" : "One" ,"label" : "InPatient Encounters","checked" : false},
							{ "name" : "Two" ,"label" : "OutPatient Encounters","checked" : false},
							{ "name" : "Three" ,"label" : "3rd Party","checked" : false},
							{ "name" : "Four" ,"label" : "Emergency Department Encounters","checked" : false}
						],
						"Header_Label" : "Default Label "
					},
					{
						"Header_Name" : "Header-6// button",
						"Header_ID" : 5,
						"Header_Type" : "button",
						"Header_Info" : [
							{ "name" : "BtnX1" },
							{ "name" : "BtnX2" }
						]
					},
					{
						"Header_Name" : "Header-7// slider",
						"Header_ID" : 6,
						"Header_Type" : "slider"
					},
					{
						"Header_Name" : "Header-8// button",
						"Header_ID" : 7,
						"Header_Type" : "button",
						"Header_Info" : [
							{ "name" : "Button1" },
							{ "name" : "Button2" },
							{ "name" : "Button3" },
							{ "name" : "Button4" }
						]
					},

				]
			}
		]
	}
];