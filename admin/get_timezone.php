<?php
   
   include 'callAPI.php';
   include 'admin_token.php';
   $contentBodyJson = file_get_contents('php://input');
   $content = json_decode($contentBodyJson, true);
   $timezone = $content['timezone'];
   $baseUrl = getMarketplaceBaseUrl();
   $admin_token = getAdminToken();
   $customFieldPrefix = getCustomFieldPrefix();
   // Query to get marketplace id
   $url = $baseUrl . '/api/v2/marketplaces/';
   $marketplaceInfo = callAPI("GET", null, $url, false);
   $url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
   $packageCustomFields = callAPI("GET", null, $url, false);
   
   $tz = '';
   foreach ($packageCustomFields as $cf) {
       if ($cf['Name'] == 'Timezone' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
              $tz= $cf['Code'];
       }
   }
   $data = [
       'ID' => $marketplaceInfo['ID'],
       'CustomFields' => [
           [
               'Code' => $tz,
               'Values' => [$timezone],
           ],
       ],
   ];
   $id =  $marketplaceInfo['ID'];
   $url = $baseUrl . '/api/v2/marketplaces/';
   $result = callAPI("POST", $admin_token['access_token'], $url, $data);
   ?>