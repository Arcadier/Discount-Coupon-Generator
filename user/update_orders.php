<?php
include 'callAPI.php';
include 'admin_token.php';
//when the coupon is applied -> call to adfbascd.php -> send orderguid -> in the server side, query the total -> apply the coupon % -> call update API
//1. GET the orderguid when the coupon is applied.

$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$order_guid = $content['order_guid'];
$coupon_value = $content['discount_val'];
$coupon_name = $content['coupon_code']; 
$isLimited = $content['isLimited'];
$coupon_qty = $content['coupon_qty'];
$coupon_id = $content['coupon_id'];
$total_with_discount;
//2. Query the total, apply the discount coupon
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$customFieldPrefix = getCustomFieldPrefix();

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];
error_log('usr ' . $userId);

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
error_log('admin ' . json_encode($result));
$admin_id = $result['ID'];
error_log('admin id ' . $admin_id);

//get the current total
$url = $baseUrl . '/api/v2/users/'. $userId . '/orders/' . $order_guid;
error_log('get order ' . $url);
$paymentGateways = callAPI("GET", $admin_token['access_token'], $url, false);
error_log('api result ' . json_encode($paymentGateways));
error_log($paymentGateways['Total']);

$subtotal = $paymentGateways['Total'];
//4.apply the coupon
$total_with_discount = $subtotal - $coupon_value;
error_log($total_with_discount);

//5. call update API
 //update the order details
 $data = [
    [
        'ID' => $order_guid,
        'DiscountAmount' =>  $coupon_value,
    ],
];    
    error_log(json_encode($data));
    //update the current total;
    $url =  $baseUrl . '/api/v2/admins/'. $admin_id .'/orders';
    error_log('orders url ' . $url);
    $updateOrders =  callAPI("POST", $admin_token['access_token'], $url, $data); 
    error_log('update response ' . json_encode($updateOrders)); //no response means success

    //============================================================*******************save the coupon to custom fields
// Query to get marketplace id
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);

// Query to get package custom fields
$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

//TODO:: Validate if the current ORDER ID exists, UPDATE ?? SAVE
//========================================================================VALIDATE IF ORDER ID EXISTS=======================================================================
$order_exists = array(array('Name' => 'OrderId', "Operator" => "in",'Value' => $order_guid));
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $order_exists);
 $rec = json_encode($couponDetails['Records']);
 $curr_order_id = json_encode($couponDetails['Records'][0]['Id']);
 $curr_orderid = str_replace('"', '', $curr_order_id); 

    if ($rec == '[]') {
        error_log('no, i dont exists,');
        $couponCode = '';
        $order_details = array('OrderId' => $order_guid, 'CouponCode' => $coupon_name, 'DiscountValue' => $coupon_value);
        //3. Save the Coupon details along with the fetched campaign ID
        $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders/rows';
        $result =  callAPI("POST",$admin_token['access_token'], $url, $order_details);
        error_log($url);
        error_log(json_encode($result));
        // $log_file = "error.log"; 
        // logging error message to given log file 
        // error_log(json_encode($result), 3, $log_file); 
    }else{
        //update 
        $update_details = array('CouponCode' => $coupon_name, 'DiscountValue' => $coupon_value);
        $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders/rows/'. $curr_orderid;
        $result =  callAPI("PUT",$admin_token['access_token'], $url, $update_details);
    }
?>