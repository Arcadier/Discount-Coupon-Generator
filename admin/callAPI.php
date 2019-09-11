<?php
function callAPI($method, $access_token, $url, $data = false) {
    $curl = curl_init();
    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data) {
                $jsonDataEncoded = json_encode($data);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonDataEncoded);
            }
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
            if ($data) {
                $jsonDataEncoded = json_encode($data);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonDataEncoded);
            }
            break;
        case "DELETE":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'DELETE');
            // if ($data) {
            //     $jsonDataEncoded = json_encode($data);
            //     curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonDataEncoded);
            // }
            break;   
        default:
            if ($data) {
                $url = sprintf("%s?%s", $url, http_build_query($data));
            }
    }
    $headers = ['Content-Type: application/json'];
    if ($access_token != null && $access_token != '') {
        array_push($headers, sprintf('Authorization: Bearer %s', $access_token));
    }
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);
    curl_close($curl);
    return json_decode($result, true); 
}

function getMarketplaceBaseUrl() {
    $marketplace = $_COOKIE["marketplace"];
    $protocol = $_COOKIE["protocol"];

    $baseUrl = $protocol . '://' . $marketplace;
    return $baseUrl;
}

function getPackageID() {
    $requestUri = "$_SERVER[REQUEST_URI]";
    preg_match('/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/', $requestUri, $matches, 0);
    return $matches[0];
}

function getCustomFieldPrefix() {
    $requestUri = "$_SERVER[REQUEST_URI]";
    preg_match('/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/', $requestUri, $matches, 0);
    $customFieldPrefix = str_replace('-', '', $matches[0]);
    return $customFieldPrefix;
}




?>

