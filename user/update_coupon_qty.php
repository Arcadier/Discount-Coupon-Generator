<?php
include 'callAPI.php';
include 'admin_token.php';
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$customFieldPrefix = getCustomFieldPrefix();
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$order_guid = $content['order_guid'];
error_log('orderid ' . $order_guid);
//TODO:: Validate if the current ORDER ID exists, UPDATE ?? SAVE
//========================================================================VALIDATE IF ORDER ID EXISTS=======================================================================
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];
//get the discount value
$url =  $baseUrl . '/api/v2/admins/' . $userId .'/transactions/'. $order_guid;
$result = callAPI("GET", $admin_token['access_token'], $url, false);
error_log('invoice info' . json_encode($result));
$orderId = $result['Orders'][0]['ID'];

$order_exists = array(array('Name' => 'OrderId', "Operator" => "in",'Value' => $orderId));
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $order_exists);
 $rec = json_encode($couponDetails['Records']);
    if ($rec == '[]') {
       
    }else{
        $curr_order_id = json_encode($couponDetails['Records'][0]['Id']);
        //get the coupon value of the current 
        $curr_coupon_code = json_encode($couponDetails['Records'][0]['CouponCode']);
        $curr_coupon_code = str_replace('"', '', $curr_coupon_code); 
        $curr_orderid = str_replace('"', '', $curr_order_id); 

        //update the status of the coupon in orders.
        $coupon_stat = array('Status' => '1');
        $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders/rows/'.  $curr_orderid;
        $result =  callAPI("PUT",$admin_token['access_token'], $url, $coupon_stat);

        //update 
        //check if the coupon code is redeemable
        $coupon_details = array(array('Name' => 'CouponCode', 'Value' => $curr_coupon_code));
        $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon';
        $coupondetails1 =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);
        $isLimited = json_encode($coupondetails1['Records'][0]['IsLimited']);
        $coupon_qty =  json_encode($coupondetails1['Records'][0]['Quantity']);
        $coupon_id = json_encode($coupondetails1['Records'][0]['Id']);
        $tcoupon_id = str_replace('"', '',  $coupon_id); 
        if($isLimited == 1){
            //1. Get the current quantity and coupon id of the coupon increment by 1
            $coupon_left = $coupon_qty + 1;
            //2. Update the current quantity of the coupon
            $quantity = array('Quantity' => $coupon_left);
            //3. Save the Coupon details along with the fetched campaign ID
            $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon/rows/'. $tcoupon_id;
            $result =  callAPI("PUT",$admin_token['access_token'], $url, $quantity);
            
        }
    }
    ?>