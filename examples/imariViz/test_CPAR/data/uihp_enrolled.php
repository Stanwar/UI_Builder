 <?php
   $username = "check_web";
    $password = "check_web";
    $host = "172.17.0.117"; 
   $database="UIHP";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT RecipientZip,
         Age,
        SUM(A.Total_Charges) Total_Charges,
        SUM(A.Asthma) Asthma,
        -- SUM(Total_Encounter_Participants) Total_Encounter_Participants,
        -- SUM(Total_Disease_Participants) Total_Disease_Participants,
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
      (
SELECT substr(RecipientZip,1,5) RecipientZip, 
      (CASE
         WHEN Age > 25 
          THEN 'ABOVE'
       WHEN Age <=25 
          THEN 'UNDER'
      END) Age,
      SUM(Total_Charges) Total_Charges, 
      SUM(Asthma) Asthma,
      -- SUM(IP_encounters + OP_encounters + NIPS_encounters) Total_Encounter_Participants,
      -- SUM(Asthma + Diabetes + SCD + Prematurity + Epilepsy + NewbornBrainInjury) Total_Disease_Participants,
      -- COUNT(Asthma) Asthma_Count,
      SUM(Diabetes) Diabetes,
      SUM(SCD) SCD,
      SUM(Prematurity) Prematurity,
      SUM(Epilepsy) Epilepsy,
      SUM(NewbornBrainInjury) NewBorn,
        SUM(IP_encounters) IP_encounters,
        SUM(IP_charges) IP_charges,
        SUM(OP_encounters) OP_encounters,
        SUM(OP_charges) OP_charges,
        SUM(NIPS_encounters) NIPS_encounters,
        SUM(NIPS_charges) NIPS_charges 
FROM UIHP_FINAL_REPORT M
WHERE RecipientCity = 'CHICAGO'
  AND RecipientState = 'IL'
  AND lower(DataSource) = lower('uihp')
  GROUP BY RecipientZip, Age
  ORDER BY RecipientZip ASC)A
      GROUP BY RecipientZip,A.Age
      ORDER BY RecipientZip DESC
  ; ";	

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
