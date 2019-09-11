<?php 
include 'callAPI.php';
include 'admin_token.php';

$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$order_guid = $content['order_guid'];
$total_with_discount;
//2. Query the total, apply the discount coupon
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$customFieldPrefix = getCustomFieldPrefix();

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];
//get the current total
$url = $baseUrl . '/api/v2/users/'. $userId . '/orders/' . $order_guid;
$paymentGateways = callAPI("GET", $admin_token['access_token'], $url, false);
$subtotal = $paymentGateways['Total'];
//4.apply the coupon
$total_with_discount = $subtotal - $coupon_value;
error_log($total_with_discount);

//5. call update API
 //update the discount amount
 $data = [
    [
        'ID' => $order_guid,
        'DiscountAmount' =>  0.00,
    ],
];    
    error_log(json_encode($data));
    //update the current total;
    $url =  $baseUrl . '/api/v2/admins/'. $admin_id .'/orders';
    $updateOrders =  callAPI("POST", $admin_token['access_token'], $url, $data); 
    error_log('update response ' . json_encode($updateOrders)); //no response means success

// delete the current details of the current order
$order_exists = array(array('Name' => 'OrderId', "Operator" => "in",'Value' => $order_guid));
$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $order_exists);
 $rec = json_encode($couponDetails['Records']);
 $curr_order_id = json_encode($couponDetails['Records'][0]['Id']);
 $curr_orderid = str_replace('"', '', $curr_order_id); 
 $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders/rows/'. $curr_orderid;
 $result =  callAPI("DELETE",$admin_token['access_token'], $url);
?>