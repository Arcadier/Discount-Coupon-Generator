<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$invoice_number = $content['invoice_number'];
error_log($invoice_number);
$invoice_number = str_replace(' ', '', $invoice_number);

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];


// get admin id
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
error_log('admin ' . json_encode($result));
$admin_id = $result['ID'];



//get the discount value
$url =  $baseUrl . '/api/v2/admins/' . $admin_id .'/transactions/'. $invoice_number;
$result = callAPI("GET", $admin_token['access_token'], $url, false);
//echo json_encode(['result' => $result['Orders'][0]['ID']]);
$orderId = $result['Orders'][0]['ID'];

$coupon_details = array(array('Name' => 'OrderId', 'Value' => $invoice_number));
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);
echo json_encode(['result' => $couponDetails['Records']]);

?>
