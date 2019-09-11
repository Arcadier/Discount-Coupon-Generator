
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
//VALIDATE IF THIS INVOICE NUMBER ALREADU REDEEMED A COUPON
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
        error_log('no, i dont exists,');
    }else{
        //get the current status of the transaction invoice
        $curr_order_id = json_encode($couponDetails['Records'][0]['Id']);
        $curr_status =  json_encode($couponDetails['Records'][0]['Status']);

        echo json_encode(['result' => $couponDetails['Records'][0]['Status']]);
    }
?>