 <?php

    $username = "stanwa2"; 
    $password = "Foundation1$";   
    $host = "10.176.25.15";
    $database="UIHP";
    // $username = "check_web"; 
    // $password = "check_web";   
    // $host = "172.17.0.117";
    // $database="UIHP";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT
                                RecipientID,
                                DataSource,
                                RecipientZip zip,
                                Age,
                                CASE Gender
                                 WHEN 'Male'
                                 THEN 1
                                 WHEN 'Female'
                                 THEN 2
                                END Gender,
                                'IP' RecordIDCd,
                                CASE 
                                 WHEN IP_charges> 0
                                 THEN IP_charges
                                END Patient_Charges,
                                CASE 
                                 WHEN IP_encounters> 0
                                 THEN IP_encounters
                                END Patient_Encounters,
                                Asthma,
                                Diabetes,
                                SCD,
                                Epilepsy,
								BrainInjury Newborn,
                                Prematurity
                        FROM test_CPAR.tbl_user_check_eligible_enrolled
                        WHERE Age IS NOT NULL
                         AND IP_charges >0
                         AND EnrolledFlag = 1
UNION 
SELECT
                                RecipientID,
                                DataSource,
                                RecipientZip zip,
                                Age,
                                CASE Gender
                                 WHEN 'Male' 
                                 THEN 1
                                 WHEN 'Female'
                                 THEN 2
                                END Gender,
                                'OP' RecordIDCd,
                                CASE 
                                 WHEN OP_charges> 0
                                 THEN OP_charges
                                END Patient_Charges,
                                CASE 
                                 WHEN OP_encounters> 0
                                 THEN OP_encounters
                                END Patient_Encounters,
                                Asthma,
                                Diabetes,
                                SCD,
                                Epilepsy,
								BrainInjury Newborn,
                                Prematurity
                        FROM test_CPAR.tbl_user_check_eligible_enrolled
                        WHERE Age IS NOT NULL
                         AND OP_charges >0
                         AND EnrolledFlag = 1
UNION 
SELECT
                                RecipientID,
                                DataSource,
                                RecipientZip zip,
                                Age,
                                CASE Gender
                                 WHEN 'Male'
                                 THEN 1
                                 WHEN 'Female'
                                 THEN 2
                                END Gender,
                                'NIPS' RecordIDCd,
                                CASE 
                                 WHEN NIPS_charges> 0
                                 THEN NIPS_charges
                                END Patient_Charges,
                                CASE 
                                 WHEN NIPS_encounters> 0
                                 THEN NIPS_encounters
                                END Patient_Encounters,
                                Asthma,
                                Diabetes,
                                SCD,
                                Epilepsy,
								BrainInjury Newborn,
                                Prematurity
                        FROM test_CPAR.tbl_user_check_eligible_enrolled
                        WHERE Age IS NOT NULL
                         AND NIPS_charges >0
                         AND EnrolledFlag = 1
UNION
SELECT
                                RecipientID,
                                DataSource,
                                RecipientZip zip,
                                Age,
                                CASE Gender
                                 WHEN 'Male' 
                                 THEN 1
                                 WHEN 'Female'
                                 THEN 2
                                END Gender,
                                'ED' RecordIDCd,
                                CASE 
                                 WHEN ED_charges> 0
                                 THEN ED_charges
                                END Patient_Charges,
                                CASE 
                                 WHEN ED_encounters> 0
                                 THEN ED_encounters
                                END Patient_Encounters,
                                Asthma,
                                Diabetes,
                                SCD,
                                Epilepsy,
								BrainInjury Newborn,
                                Prematurity
                        FROM test_CPAR.tbl_user_check_eligible_enrolled
                        WHERE Age IS NOT NULL
                         AND ED_charges >0
                         AND EnrolledFlag = 1
UNION
SELECT
                                RecipientID,
                                DataSource,
                                RecipientZip zip,
                                Age,
                                CASE Gender
                                 WHEN 'Male'
                                 THEN 1
                                 WHEN 'Female'
                                 THEN 2
                                END Gender,
                                'MEDICARE' RecordIDCd,
                                CASE 
                                 WHEN Medicare_charges> 0
                                 THEN Medicare_charges
                                END Patient_Charges,
                                CASE 
                                 WHEN Medicare_encounters> 0
                                 THEN Medicare_encounters
                                END Patient_Encounters,
                                Asthma,
                                Diabetes,
                                SCD,
                                Epilepsy,
								BrainInjury Newborn,
                                Prematurity
                        FROM test_CPAR.tbl_user_check_eligible_enrolled
                        WHERE Age IS NOT NULL
                         AND Medicare_charges >0
                         AND EnrolledFlag = 1;";	

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
