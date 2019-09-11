<?php
include 'callAPI.php';
include 'admin_token.php';
function getCampaignDetails(){
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Campaign';
$couponDetails =  callAPI("GET",$admin_token['access_token'], $url, false);
return $couponDetails;
}
function getCouponDetails($campaignID) {
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// 'Operator' => 'equal', 
$coupon_details = array(array('Name' => 'CampaignId', 'Value' => $campaignID));
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon';
$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);
return $couponDetails;
}
?>
