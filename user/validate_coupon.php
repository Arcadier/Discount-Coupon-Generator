
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

//TODO:: Validate if the current ORDER ID exists, UPDATE ?? SAVE
//VALIDATE IF ORDER ID EXISTS
$order_exists = array(array('Name' => 'OrderId', "Operator" => "in",'Value' => $order_guid));
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

        //update 
        //check if the coupon code is redeemable
        $coupon_details = array(array('Name' => 'CouponCode', 'Value' => $curr_coupon_code));
        $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon';
        $coupondetails1 =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);

        echo json_encode(['result' => $coupondetails1['Records']]);

    }
    ?>