<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
date_default_timezone_set($timezone_name);
$timestamp = date("d/m/Y H:i"); 
$coupon_id =  $content['couponId'];
$campaign_id = $content['campaignId'];
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

    $coupon_details = array('CouponCode' => $coupon_code, 'isLimited' => $isLimited, 'isEnabled' => $isEnabled, 'MaxRedeem' => $max_redeem,  'DiscountValue' => $discount_value);
    $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon/rows/'. $coupon_id;
    $result =  callAPI("PUT",$admin_token['access_token'], $url, $coupon_details);
    error_log(json_encode($result));

    $campaign_details = array('CampaignName' => $campaign_name);
    $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Campaign/rows/'. $campaign_id;
    $result =  callAPI("PUT",$admin_token['access_token'], $url, $campaign_details);
    error_log(json_encode($result));

?>