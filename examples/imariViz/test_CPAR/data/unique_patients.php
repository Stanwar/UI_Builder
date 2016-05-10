 <?php

    $username = "check_web"; 
    $password = "check_web";   
    $host = "172.17.0.117";
    $database="UIHP";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT COUNT(1) Patient, 
	   SUBSTR(C.zip_code,1,5) zip
		FROM CH_RD_ENROLLMENT C
		WHERE C.city = 'CHICAGO'
		GROUP BY zip;";	

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

