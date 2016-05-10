<?php
    $username = "check_web"; 
    $password = "check_web";   
    $host = "172.17.0.117";
    $database="UIHP";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	/*$sql = "SELECT U.RecipientZip, 
                SUM(Total_Charges) Total_Charges, 
                SUM(Medication_cost) Medication_Cost, 
                SUM(Asthma) Asthma,
                -- COUNT(Asthma) Asthma_Count,
                SUM((Diabetes)) Diabetes,
                SUM((SCD)) SCD,
                SUM(Prematurity) Prematurity,
                SUM(Epilepsy) Epilepsy,
                SUM(NewbornBrainInjury) NewBorn
          FROM  UIHP_FINAL_REPORT U, 
                PATIENT_DEMOGRAPHY P
         WHERE U.RecipientID = P.RecipientID
         -- AND (Asthma > 0 OR Diabetes > 0 OR SCD >0 OR Prematurity > 0 OR NewbornBrainInjury >0 OR Epilepsy > 0 )
         AND U.RecipientCity = 'CHICAGO'
         GROUP BY U.RecipientZip
         ORDER BY U.RecipientZip ASC
        ;";	
*/

    // Change for the map  
      /*  $sql="SELECT U.RecipientZip, 
                SUM(Total_Charges) Total_Charges, 
                SUM(Medication_cost) Medication_Cost, 
                SUM(Asthma) Asthma,
                SUM(Asthma + Diabetes + SCD + Prematurity + Epilepsy + NewbornBrainInjury) Total_Participants,
                -- COUNT(Asthma) Asthma_Count,
                SUM((Diabetes)) Diabetes,
                SUM((SCD)) SCD,
                SUM(Prematurity) Prematurity,
                SUM(Epilepsy) Epilepsy,
                SUM(NewbornBrainInjury) NewBorn
          FROM  UIHP_FINAL_REPORT U, 
                PATIENT_DEMOGRAPHY P
         WHERE U.RecipientID = P.RecipientID
         -- AND (Asthma > 0 OR Diabetes > 0 OR SCD >0 OR Prematurity > 0 OR NewbornBrainInjury >0 OR Epilepsy > 0 )
         AND U.RecipientCity = 'CHICAGO'
         GROUP BY U.RecipientZip
         ORDER BY U.RecipientZip ASC;";
      */
         $sql="(SELECT Zip code,
                   Age,
                SUM(A.Total_Charges) Total_Charges, 
                SUM(A.Medication_cost) Medication_Cost, 
                SUM(A.Asthma) Asthma,
                SUM(A.Asthma + A.Diabetes + A.SCD + A.Prematurity + A.Epilepsy + A.NewBorn) Total_Participants,
                -- COUNT(Asthma) Asthma_Count,
                SUM((A.Diabetes)) Diabetes,
                SUM((A.SCD)) SCD,
                SUM(A.Prematurity) Prematurity,
                SUM(A.Epilepsy) Epilepsy,
                SUM(A.NewBorn) NewBorn,
                    SUM(IP_encounters) IP_encounters,
                    SUM(IP_charges) IP_charges,
                    SUM(OP_encounters) OP_encounters,
                    SUM(OP_charges) OP_charges,
                    SUM(NIPS_encounters) NIPS_encounters,
                    SUM(NIPS_charges) NIPS_charges
              FROM 
              (SELECT Zip code , 
                (CASE
                     WHEN U.Age > 25 
                      THEN 'ABOVE'
                 WHEN U.Age <=25 
                      THEN 'UNDER'
                      END) Age,
                SUM(Total_Charges) Total_Charges, 
                SUM(Medication_cost) Medication_Cost, 
                SUM(Asthma) Asthma,
                SUM(Asthma + Diabetes + SCD + Prematurity + Epilepsy + NewbornBrainInjury) Total_Participants,
                -- COUNT(Asthma) Asthma_Count,
                SUM((Diabetes)) Diabetes,
                SUM((SCD)) SCD,
                SUM(Prematurity) Prematurity,
                SUM(Epilepsy) Epilepsy,
                SUM(NewbornBrainInjury) NewBorn,
                    SUM(IP_encounters) IP_encounters,
                    SUM(IP_charges) IP_charges,
                    SUM(OP_encounters) OP_encounters,
                    SUM(OP_charges) OP_charges,
                    SUM(NIPS_encounters) NIPS_encounters,
                    SUM(NIPS_charges) NIPS_charges
              FROM  CHECK_ELIGIBLE U 
              WHERE 1=1
               AND (Asthma > 0 OR Diabetes > 0 OR SCD >0 OR Prematurity > 0 OR NewbornBrainInjury >0 OR Epilepsy > 0 )
               AND U.RecipientCity = 'CHICAGO'
               GROUP BY Zip code, Age
               ORDER BY Zip code ASC) A
            GROUP BY Zip code,
                 A.Age)
            UNION
              (SELECT Zip code, 
                'TOTAL' Age,
                Total_Charges, 
                Medication_Cost, 
                Asthma,
                Total_Participants,
                -- COUNT(Asthma) Asthma_Count,
                Diabetes,
                SCD,
                Prematurity,
                Epilepsy,
                NewBorn,
                    IP_encounters,
                    IP_charges,
                    OP_encounters,
                    OP_charges,
                    NIPS_encounters,
                    NIPS_charges
                FROM 
                (SELECT U.RecipientZip, 
                SUM(Total_Charges) Total_Charges, 
                SUM(Medication_cost) Medication_Cost, 
                SUM(Asthma) Asthma,
                SUM(Asthma + Diabetes + SCD + Prematurity + Epilepsy + NewbornBrainInjury) Total_Participants,
                -- COUNT(Asthma) Asthma_Count,
                SUM((Diabetes)) Diabetes,
                SUM((SCD)) SCD,
                SUM(Prematurity) Prematurity,
                SUM(Epilepsy) Epilepsy,
                SUM(NewbornBrainInjury) NewBorn,
                    SUM(IP_encounters) IP_encounters,
                    SUM(IP_charges) IP_charges,
                    SUM(OP_encounters) OP_encounters,
                    SUM(OP_charges) OP_charges,
                    SUM(NIPS_encounters) NIPS_encounters,
                    SUM(NIPS_charges) NIPS_charges
              FROM  CHECK_ELIGIBLE U 
              WHERE 1=1
               AND (Asthma > 0 OR Diabetes > 0 OR SCD >0 OR Prematurity > 0 OR NewbornBrainInjury >0 OR Epilepsy > 0 )
               AND U.RecipientCity = 'CHICAGO'
               GROUP BY U.RecipientZip
               ORDER BY U.RecipientZip ASC)B
                 );";
         
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
