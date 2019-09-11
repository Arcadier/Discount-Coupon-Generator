<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$couponId = $content['couponId'];
$redeemswitch = $content['status'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

$isenabled = array('IsEnabled' => $redeemswitch);
//3. Save the Coupon details along with the fetched campaign ID
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon/rows/'. $couponId;
$result =  callAPI("PUT",$admin_token['access_token'], $url, $isenabled);
error_log(json_encode($result));

?>