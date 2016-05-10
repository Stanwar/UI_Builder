 <?php

    $username = "karthick2"; 
    $password = "checkmysql";   
    $host = "10.176.25.15";
    $database="UIHP";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT 
				RecipientID,
				DataSource,
				Zip,
				Age,
				Gender,
				CASE RecordIDCd
				 WHEN 'I' THEN 'IP'
				 WHEN 'O' THEN 'OP'
				 WHEN 'N' THEN 'NIPS'
				 WHEN 'E' THEN 'ED'
				 WHEN 'M' THEN 'MEDICARE'
				END AS RecordIDCd,
				Patient_Charges,
				Patient_Encounters,
				Asthma,
				Diabetes,
				SCD,
				Epilepsy,
				Newborn,
				Prematurity,
				Disease_Total
			FROM Map_Viz_tbl
			WHERE Age IS NOT NULL;";	

    $query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }

	$data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    
    echo json_encode($data);      
    mysql_close($server);
?>
