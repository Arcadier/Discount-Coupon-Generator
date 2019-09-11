<?php
include 'callAPI.php';
include 'admin_token.php';
$log_file = "error.log"; 
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$campaign_id = $content['campaignId'];
$userId = $content['userId'];
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

error_log('Campaign id ' . $campaign_id);
$coupon_details = array(array('Name' => 'CampaignId', 'Value' => $campaign_id));
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon';
$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);
error_log('result ' . json_encode($couponDetails));
//delete the coupon 
//GET THE coupon ID first based on campaign ID given
$couponid = $couponDetails['Records'][0]['Id'];
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon/rows/'.$couponid;
$result =  callAPI("DELETE",$admin_token['access_token'], $url);
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Campaign/rows/'.$campaign_id;
$result =  callAPI("DELETE",$admin_token['access_token'], $url);
?>
