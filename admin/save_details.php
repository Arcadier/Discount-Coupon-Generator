<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
date_default_timezone_set($timezone_name);
$timestamp = date("d/m/Y H:i"); 
$campaign_name =$content['campaign_name'];
$last_updated = $content['last_updated'];
$coupon_code = $content['coupon_code'];
$isLimited = $content['isLimited'];
$isEnabled =   $content['isEnabled'];
$discount_value = $content['discount_value'];
$max_redeem = $content['max_redeem'];

//TIMEZONE
$tz = date_default_timezone_get();
$timezone_name = timezone_name_from_abbr("", $last_updated*60, false);
date_default_timezone_set($timezone_name);
$date = date("d/m/Y H:i"); 
$timestamp = $last_updated*60;

$date1 = strtotime($timestamp);
error_log($date1);
$now = new DateTime($timezone_name);
echo $now->format('Y-m-d H:i:s');    // MySQL datetime format
$dates = $now->getTimestamp(); 

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);
// Query to get package custom fields
$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

//***CAMPAIGN DETAILS SAVING*
//1. Save the campaign details to the Campaign Custom table 
$campaign_details = array('CampaignName' => $campaign_name, 'LastUpdated' => $dates);
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Campaign/rows';
$result =  callAPI("POST",$admin_token['access_token'], $url, $campaign_details);
//2. Get the generated campaign ID 
$campaign_id =  $result['Id'];
$coupon_details = array('CouponCode' => $coupon_code, 'isLimited' => $isLimited, 'isEnabled' => $isEnabled, 'MaxRedeem' => $max_redeem,  'Quantity'=> '0','DiscountValue' => $discount_value,'CampaignId'=> $campaign_id);
//3. Save the Coupon details along with the fetched campaign ID
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon/rows';
$result =  callAPI("POST",$admin_token['access_token'], $url, $coupon_details);
?>