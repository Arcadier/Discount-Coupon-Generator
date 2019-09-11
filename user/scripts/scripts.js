(function() {
var scriptSrc = document.currentScript.src;
var pathname = (window.location.pathname + window.location.search).toLowerCase();
var packagePaths = scriptSrc.replace('/scripts/scripts.js', '').trim();
var userId = $('#userGuid').val();
var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
var packageId = re.exec(scriptSrc.toLowerCase())[1];
document.addEventListener('DOMContentLoaded', function () {
const HOST = window.location.host;
var customFieldPrefix = packageId.replace(/-/g, "");
var token = commonModule.getCookie('webapitoken');
var coupon;
var couponcode;
var errorType;
var promocode,isEnabled,isLimited,discountVal,maxRedeem,isInvalid, couponId;
var currentSubtotal;
var mpCurrencycode = $('#currencyCode').val();
var deliveryCharge,currentTotal;
var currentSubtotal1;
var discountfromapi;
var couponname, coupondiscount, couponqty;
var orderguidcheckout;
var orderId;
var subtotal_del2;
var invoiceStatus;

//order history -BUYER
function getDiscountValue(){
    var invoiceNumber = pathname.split('=')[1]; 
	var data = { 'invoice_number': invoiceNumber }; 
    var apiUrl = packagePaths + '/get_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = $.parseJSON(result);
            if (discountDetails.result.length == 0) {
            }else{
                couponname = discountDetails.result[0].CouponCode;
                coupondiscount = discountDetails.result[0].DiscountValue;  
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.purchase-pg-hstry-dtls').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function getDiscountValueCheckout(){
    var invoiceNumber = $('#OrderGuids').val();
	var data = { 'invoice_number': invoiceNumber }; 
    var apiUrl = packagePaths + '/get_discount_checkout.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = $.parseJSON(result);
            console.table(discountDetails);
            if (discountDetails.result.length == 0) {
            }else{
                couponname = discountDetails.result[0].CouponCode;
                coupondiscount = discountDetails.result[0].DiscountValue;  
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-payment').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}


//ORDER HISTORY MERCHANT
function getDiscountValueMerchant(){
    var invoiceNumberMerchant = $('.ordr-dtls-invoiceid:contains("INVOICE ID")').clone().children().remove().end().text();
    invoiceNumberMerchant = invoiceNumberMerchant.replace(/[\. ,:-]+/g, "");
    invoiceNumberMerchant = invoiceNumberMerchant.trim();
	var data = { 'invoice_number': invoiceNumberMerchant }; 
    var apiUrl = packagePaths + '/get_discount_merchant.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails1 = $.parseJSON(result);
            if (discountDetails1.result.length == 0) {
            }else{
                couponname = discountDetails1.result[0].CouponCode;
                coupondiscount = discountDetails1.result[0].DiscountValue;  
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.seller-order-detail-page').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

//ORDER HISTORY ---  MERCHANT SPACETIME
function getDiscountValueMerchant_spacetime(){
    var invoiceNumberMerchant = $('.ordr-dtls-orderid:contains("Invoice id")').clone().children().remove().end().text();
    invoiceNumberMerchant = invoiceNumberMerchant.replace(/[\. ,:-]+/g, "");
    invoiceNumberMerchant = invoiceNumberMerchant.trim();
	var data = { 'invoice_number': invoiceNumberMerchant }; 
    var apiUrl = packagePaths + '/get_discount_merchant.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails1 = $.parseJSON(result);
            if (discountDetails1.result.length == 0) {
            }else{
                couponname = discountDetails1.result[0].CouponCode;
                coupondiscount = discountDetails1.result[0].DiscountValue;  
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-seller').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function getCouponDetails(){
    promocode =  $('#promocode').val().toUpperCase();
	var data = { 'promocode': promocode }; 
    var apiUrl = packagePaths + '/get_coupon_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
           console.dir(coupondetails);
            if (coupondetails.result.length == 0) {
               $('#msg').remove();
                returnError('Invalid');
            }
           else {
                $('#msg').remove();
                couponcode  =  coupondetails.result[0].CouponCode;
                discountVal =  coupondetails.result[0].DiscountValue;
                isLimited   =  coupondetails.result[0].IsLimited;
                isEnabled =    coupondetails.result[0].IsEnabled;
                maxRedeem =    coupondetails.result[0].MaxRedeem;
                couponqty =    coupondetails.result[0].Quantity;
                couponId =     coupondetails.result[0].Id; 
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-review').append(couponspan);
           }
           
        },
        error: function(jqXHR, status, err) {
        }
    });

}

function getCouponDetailsDel2(){
    promocode =  $('#promocode').val().toUpperCase();
	var data = { 'promocode': promocode }; 
    var apiUrl = packagePaths + '/get_coupon_discount.php';
    console.log('api url ' + apiUrl);
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
            if (coupondetails.result.length == 0) {
               $('#msg').remove();
                returnError('Invalid');
            }
           else {
                $('#msg').remove();
                couponcode  =  coupondetails.result[0].CouponCode;
                discountVal =  coupondetails.result[0].DiscountValue;
                isLimited   =  coupondetails.result[0].IsLimited;
                isEnabled =    coupondetails.result[0].IsEnabled;
                maxRedeem =    coupondetails.result[0].MaxRedeem;
                couponqty =    coupondetails.result[0].Quantity;
                couponId =     coupondetails.result[0].Id; 
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-package').append(couponspan);
           }
        },
        error: function(jqXHR, status, err) {
        }
    });
}
function checkRedeemStatus(){
    var orderId  = window.location.pathname.split("/").slice(-1)[0]; // get the invoice number here or from (invoice-id class);
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/check_redeem_status.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
             if (coupondetails.result == null) {
                if( $('#maketplace-type').val() == 'bespoke'){
                    var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                    $('.page-thankyou').append(couponspan); 
                }
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page').append(couponspan); 
                 //do nothing
             }
            else {
        
          }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

//BESPOKE
function checkRedeemStatus_bespoke(){
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/check_redeem_status.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
             if (coupondetails.result == null) {
                if( $('#maketplace-type').val() == 'bespoke'){
                    var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                    $('.page-thankyou').append(couponspan); 
                }
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page').append(couponspan); 
             }
            else {
           
          }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function decrementCoupon() {
    var orderId  = window.location.pathname.split("/").slice(-1)[0]; // get the invoice number here or from (invoice-id class);
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/update_coupon_qty.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function decrementCouponBespoke() {
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/update_coupon_qty.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}
//setting the discount value, total values - discount value
function updateOrders() {
    var data = { 'order_guid' : $('#orderGuids').val(), 'discount_val': couponvalue, 'coupon_code': couponcode, 'isLimited' : isLimited,'coupon_qty':couponqty,'coupon_id' : couponId}; 
    var apiUrl = packagePaths + '/update_orders.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}
// orderGuids

//setting the discount value, total values - discount value
function updateOrders_del2() {
    var data = { 'order_guid' : $('#orderGuids').val(), 'discount_val': couponvalue, 'coupon_code': couponcode, 'isLimited' : isLimited,'coupon_qty':couponqty,'coupon_id' : couponId}; 
    var apiUrl = packagePaths + '/update_orders.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function validate_coupon_checkout(){
    var data = {'order_guid': orderguidcheckout};
    var apiUrl = packagePaths + '/validate_coupon.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
             if (coupondetails.result.length == 0) {
                 //do nothing
             }
            else {
            maxRedeem =  coupondetails.result[0].MaxRedeem;
            couponqty =  coupondetails.result[0].Quantity;
            discountVal =  coupondetails.result[0].DiscountValue;
            isLimited   =  coupondetails.result[0].IsLimited;
            isEnabled =    coupondetails.result[0].IsEnabled;
            var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
            $('.page').append(couponspan); 
          }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function removeDiscount() {
    var data = { 'order_guid' : $('#orderGuids').val() }; 
    var apiUrl = packagePaths + '/remove_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

$(document).ready(function() {
    const url = window.location.href.toLowerCase();
    if (url.indexOf('/user/order/ordersummary') >= 0) {
    //TODO: Validate if the user is a guest. if not, do not display the COUPON OPTIONS.
        if($('.register-link').length){
            //do not show coupon feature
        }else {
            if($('#maketplace-type').val() == 'spacetime'){
                appendCouponSpacetime();
            }else{
                if (document.body.className.includes('delievry-settings')) {
                    appendCouponDelivery2();
                }else {
                appendCoupon();
                }
            }
         }
            if (document.body.className.includes('delievry-settings')) {
            
            $('.sel_del_method').on('change', function() {
                
                if ($('#promocode').val()=='') {  
                }
                else if 
                ($('#promodiv').find('#promocode').length == 0) {  
                
                }
                else {
                    if ($('#promodiv').find('#couponinput').length == 0) { 
                        couponvalue = 0;
                    } else {
                    
                        couponvalue = $('#price_amt').text();
                        coup =  couponvalue.replace(/[^\d.-]/g, '')
                        
                    }
                    subtotal_del4=  $('.l_box p .sub-total').text();
                    deliveryCharge =  $('.l_box p .delivery-costs').text();
                    subtotal_del2 = parseFloat(subtotal_del2);
                    deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
                    deliveryCharge = parseFloat(deliveryCharge).toFixed(2);
                    
                    totalwithcoupon = subtotal_del2 - coup;
                    totalwithDelivery = parseFloat(totalwithcoupon) + parseFloat(deliveryCharge);
                    $('#currencySym').text('-' + mpCurrencycode);
                    //total - coupon discount
                    $('#price_amt').text(couponvalue);
                    //Total
                    $('.total_area .total-cost').text(formatter.format(totalwithDelivery));
                }
            });
        }    
        
    }
    //checkout page - bespoke only
    if (url.indexOf('/user/checkout/select-gateway') >= 0) {
        getDiscountValueCheckout();
        discount_checkout();    
     }

    //ORDER HISTORY - BUYER
    if (url.indexOf('/user/order/orderhistorydetail') >= 0) {
       getDiscountValue();
       if ($('#maketplace-type').val()=='spacetime') {
        discount_orderDetails_spacetime(); 
       }else {
        discount_orderDetails();
       }    
    }

    //ORDER HISTORY - MERCHANT
    if (url.indexOf('/user/manage/order/details') >= 0) {
        if ($('#maketplace-type').val()=='spacetime') {
          getDiscountValueMerchant_spacetime();
          discount_orderDetails_sp_merchant();
         
        }else {
            getDiscountValueMerchant();
            discount_orderDetails();
        }    
     }

//SPACETIME
//NOTE: Page URL may vary. depending on the payment method you use. This one is for payment gateways other than cod.
if (url.indexOf('/user/checkout/success') >= 0) {
    checkRedeemStatus();
    waitForElement('#couponhidden',function(){
    decrementCoupon();  
    })
 }

 //BESPOKE
 //this url is for COD type of payment
 if (url.indexOf('/user/checkout/gateway-selected') >= 0) {
    waitForElement('.invoice-id',function(){
        orderId =  $('.invoice-id').text();
        checkRedeemStatus_bespoke();
    })
    waitForElement('#couponhidden',function() {
         waitForElement('.invoice-id',function(){
            orderId =  $('.invoice-id').text();
            decrementCouponBespoke();
        })
    })
}
    
})

function waitForElement(elementPath, callBack){
	window.setTimeout(function(){
	if($(elementPath).length){
			callBack(elementPath, $(elementPath));
	}else{
			waitForElement(elementPath, callBack);
	}
	},500)
}
const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2
  })

//append the coupon input

function appendCouponSpacetime(){
    var delcostdiv = $(".order-summary-price .review-order-container:nth-child(2)");
    var promodiv = '<div class="promocode-update" id="promodiv"><input name="coupon-code" placeholder="PROMOCODE" class="pr-text" maxlength="10" type="text" id="promocode"><button type="button" class="apply-promo-btn disable" id="applybutton1">Apply</button></div>';
    delcostdiv.after(promodiv);
}
function appendCoupon() {
    var last = $('.checkout-itm-total-sec div.checkout-total-line1:last');
    var promodiv = '<div class="promocode-update" id="promodiv" style="margin-top:10px"><input name="coupon-code" placeholder="PROMOCODE" class="pr-text" maxlength="10" type="text" id="promocode"><button type="button" class="apply-promo-btn disable" id="applybutton">Apply</button></div>';
    var totaldiv = $('.check-total-btm-sec');
    last.append(promodiv);
}

function appendCouponDelivery2(){
    var ordersummaryContainer =  $('.l_box p:contains("Delivery Costs")');
    var promodiv = '<div class="promocode-update" id="promodiv" style="margin-top:10px"><input name="coupon-code" placeholder="PROMOCODE" class="pr-text" maxlength="10" type="text" id="promocode"><button type="button" class="apply-promo-btn disable" id="applybutton2">Apply</button></div>';
    ordersummaryContainer.append(promodiv);
    $('#promocode').css('width','auto');
    $('#promocode').css('margin-right','0');
    $('#applybutton2').css('width','auto');
}
//toggle the promo code and the discount % if the coupon is 

//TODO: Optimize this function
function showPromoCodeSpacetime(){
    mpCurrencycode = $('#currencyCode').val();
    var promo = '<div class="coupon-con review-order-container" id="coupon"><span class="coupon-code" id="couponinput"><i title="Remove" class="fa fa-times remove-coupon" id="remove"></i></span> </div>';
    $('#promodiv').prepend(promo); 
    var discount = '<div class="coupon-con" id="discount"><span class="pull-right"><span id="currencySym"></span><span class="sub-total"> <span id="price_amt" <span id="price_amt"></span></span> </span></span></div>';
    $('#couponinput').append(promocode);
    $('#couponinput').after(discount);
    $('#msg').remove();
    //calculate the current subtotal - the coupon value
    //1.get the current subtotal from DOM
    currentSubtotal = $('.review-order-price:first').text();
    deliveryCharge =  $('.review-order-container:contains("Delivery cost") .review-order-price').text();
    currentTotal =  $('.review-order-container:contains("Total") .review-order-price').text();
    //trim the characters then parse
    currentSubtotal1 = currentSubtotal.replace(/[^\d.-]/g, '');    
    if (deliveryCharge == '') {
        deliveryCharge = 0;
    }else {
        deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
        deliveryCharge = parseFloat(deliveryCharge);
    }
    couponvalue =  parseFloat(calculatePercentage(discountVal,currentSubtotal1));
    totalwithcoupon = currentSubtotal1 - couponvalue ;
    totalwithDelivery = totalwithcoupon + deliveryCharge;
    $('#currencySym').text('-' + mpCurrencycode);
    //total - coupon discount
    $('#price_amt').text(couponvalue.toFixed(2));
    //Total
    $('.review-order-container:contains("Total") .review-order-price').text(mpCurrencycode + formatter.format(totalwithDelivery));
    updateOrders();
}
  function showPromoCode(){
    mpCurrencycode = $('#currencyCode').val();
    var promo = '<div class="coupon-con checkout-total-line1" id="coupon"><span class="coupon-code" id="couponinput"><i title="Remove" class="fa fa-times remove-coupon" id="remove"></i></span> </div>';
    $('#promodiv').prepend(promo); 
    var discount = '<div class="coupon-con" id="discount"><span class="pull-right checkout-itm-tprice"><span id="currencySym"></span><span class="sub-total"><span id="price_amt" <span id="price_amt"></span></span> </span></span></div>';
  
    $('#couponinput').append(promocode);
    $('#coupon').prepend(discount);
 
    waitForElement('#promodiv',function(){
        $('#discount .checkout-itm-tprice').css('margin-right','31px');
        $('#msg').remove();

    });

    //calculate the current subtotal - the coupon value
    //1.get the current subtotal
    currentSubtotal = $('.checkout-itm-tprice:first').text();
    deliveryCharge =  $('.checkout-itm-total-sec .checkout-total-line1:nth-child(2) .checkout-itm-tprice').text();
    //trim the characters then parse
    currentSubtotal1 = currentSubtotal.replace(/[^\d.-]/g, '');
    if (deliveryCharge == '') {
        deliveryCharge = 0;
    }else {
        deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
        deliveryCharge = parseFloat(deliveryCharge);
        
    }
    couponvalue =  parseFloat(calculatePercentage(discountVal,currentSubtotal1));
    totalwithcoupon = currentSubtotal1 - couponvalue ;
    totalwithDelivery = totalwithcoupon + deliveryCharge;
    $('#currencySym').text('-' + mpCurrencycode);
    //total - coupon discount
    $('#price_amt').text(couponvalue.toFixed(2));
    //Total
    $('.chkout-totla-amt').text(mpCurrencycode + formatter.format(totalwithDelivery));
    $('.chkout-item-price').text(mpCurrencycode + formatter.format(totalwithcoupon));
    updateOrders();
 }

//  sub-total
//SHOW PROMOCODE FOR DELIVERY 2.0 
function showPromoCodeDel2(){
    mpCurrencycode = $('#currencyCode').val();
    var promo = '<div class="coupon-con" id="coupon"><span class="coupon-code" id="couponinput"><i title="Remove" class="fa fa-times remove-coupon" id="remove"></i></span> </div>';
    $('#promodiv').prepend(promo); 
    var discount = '<div class="coupon-con pull-right" id="discount"><span class="pull-right"><span id="currencySym"></span><span class="sub-total"><span id="price_amt" <span id="price_amt"></span></span> </span></span></div>';

    $('#couponinput').append(promocode);
    $('#coupon').append(discount);

    waitForElement('#promodiv',function(){
        $('.coupon-con').css('display','inline-flex');
        $('#discount').css('width','auto');
        $('#couponinput').css( "width", "-=5");
        $('#couponinput').css( "margin-right", "3px");
        $('#msg').remove();
    });

    //calculate the current subtotal - the coupon value
    subtotal_del2=  $('.l_box p .sub-total').text();
    deliveryCharge =  $('.l_box p .delivery-costs').text();
    subtotal_del= subtotal_del2.replace(/[^\d.-]/g, '');
    deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
    deliveryCharge = parseFloat(deliveryCharge);
    couponvalue =  parseFloat(calculatePercentage(discountVal,subtotal_del));
    totalwithcoupon = subtotal_del - couponvalue ;
    totalwithDelivery = totalwithcoupon + deliveryCharge;
    $('#currencySym').text('-' + mpCurrencycode);
    //total - coupon discount
    $('#price_amt').text(couponvalue.toFixed(2));
    //Total
    $('.total_area .total-cost').text(formatter.format(totalwithDelivery));
    // updateOrders();
    updateOrders_del2();

}
 function returnError(errorType) {
    if (errorType == 'Invalid') {
        errorType = '<span class="coupon-msg" id="msg">Coupon code invalid</span>';
    }else if (errorType == 'Expired'){
        errorType = '<span class="coupon-msg" id="msg">Coupon code expired.</span>';
    }
        if ($('#promodiv').find('#msg').length == 0) {  
            $('#promodiv').append(errorType);
        }
 }
 function calculatePercentage(num, amount){
    return  parseFloat(num*amount/100).toFixed(2);

  }

function discount_orderDetails() {
    waitForElement('#couponhidden',function(){
        var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span></div>';
        $('.ordr-dtls-trans-info').append(promo);
        $('#coupon_ordetails').css('display','inline-flex');
        var discount = '<div class="coupon-con" id="discount"><span> <span id="currencySym"></span><span id="price_amt"></span></span></div>';
        waitForElement('#discount',function(){
            $('#discount span').css('display','inline');
        });
        $('#couponvalue').text(couponname);
        $('#coupon_ordetails').append(discount);
        $('#currencySym').text('- ' + mpCurrencycode);
        $('#price_amt').text(formatter.format(coupondiscount));
   });
}


function discount_checkout() {
    waitForElement('#couponhidden',function(){
        var last = $('.checkout-itm-total-sec .checkout-total-line1:last');
        var promo = '<div class="checkout-totline-left" id="coupon_ordetails">tash</div> <div class="checkout-itm-tprice" id="couponvalue">13123213</div> <div class="clearfix"></div>';
        last.append(promo);
        $('#coupon_ordetails').text(couponname);
        $('#couponvalue').text('-' + mpCurrencycode + formatter.format(coupondiscount));
   });
} 

function discount_orderDetails_sp_merchant() {
    waitForElement('#couponhidden',function(){
            var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span></div>';
            $('.ordr-dtls-trans-info').append(promo);
            $('#coupon_ordetails').css('display','inline');
            var discount = '<div class="coupon-con" id="discount"><span> <span id="currencySym"></span><span id="price_amt"></span></span></div>';
        waitForElement('#discount',function(){
            $('.coupon-con').css('display','inline');
        });
        $('#couponvalue').text(couponname);
        $('#coupon_ordetails').append(discount);
        $('#currencySym').text('-' + mpCurrencycode);
        $('#price_amt').text(formatter.format(coupondiscount));
        $('#currencySym').css('width','auto');
        $('#price_amt').css('width','auto');
   });
}

//APPEND DISCOUNT DETAIL TO BUYER PURCHASE HISTORY -  SPACETIME
function discount_orderDetails_spacetime() {
    waitForElement('#couponhidden',function(){
        var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span> </div>';
        $('.ordr-dtls-trans-info').append(promo);
        $('#coupon_ordetails').css('display','inline');
        var discount = '<div class="coupon-con" id="discount"><span id="currencySym"></span><span id="price_amt"></span></div>';
        waitForElement('.coupon-con',function(){
            $('.coupon-con').css('display','inline');
        });
     $('#couponvalue').text(couponname);
     $('#coupon_ordetails').append(discount);
     $('#currencySym').text('-' + mpCurrencycode);
     $('#price_amt').text(formatter.format(coupondiscount));
     $('#currencySym').css('width','auto');
     $('#price_amt').css('width','auto');
   });
  }

//FORM ACTIONS
//VALIDATE IF THE COUPON IS EXPIRED OR CONSUMES THE MAX AMOUNT
//DECREMENT THE COUPON QTY ON EACH REDEEM.
//
$('#applybutton').click(function(){
    $('#couponhidden').remove();
     promocode =  $('#promocode').val().toUpperCase();
     getCouponDetails();
    waitForElement('#couponhidden',function(){
        console.log(isEnabled);
    if(isEnabled == 0) {
        returnError('Expired');
     }
     else if (couponqty == maxRedeem) {
        //TODO: Check if the coupon attained it's maximum allowed redeemable quantity
        returnError('Expired');
        console.log('Max redeem '+ maxRedeem);
        console.log('Quantity ' + couponqty);
    }     
    else { //return error
      if ($('#promodiv').find('#coupon').length == 0) {  
        showPromoCode();
      }
    }
})
})
//SPACETIME
$('#applybutton1').click(function(){
    $('#couponhidden').remove();
    promocode =  $('#promocode').val().toUpperCase();
    getCouponDetails();
   waitForElement('#couponhidden',function(){
        if(isEnabled == 0) {
            returnError('Expired');
        }
        else if (couponqty == maxRedeem) {
            returnError('Expired');
        }     
        else { //return error
            if ($('#promodiv').find('#coupon').length == 0) {  
            showPromoCodeSpacetime();
            }
        }
    })
})

$('#applybutton2').click(function(){
    $('#couponhidden').remove();
    promocode =  $('#promocode').val().toUpperCase();
    getCouponDetailsDel2();
   waitForElement('#couponhidden',function(){   
        if(isEnabled == 0) {
            returnError('Expired');
            }
        else if (couponqty == maxRedeem) {
            //TODO: Check if the coupon attained it's maximum allowed redeemable quantity
            returnError('Expired');
        }     
        else { //return error
            if ($('#promodiv').find('#coupon').length == 0) {  
                showPromoCodeDel2()
            }
        }
    })
})
//removing coupon info
$("body").on("click" , "#remove" , function(){  
    $('#coupon').remove();
    //Total without coupon discount
    $('.chkout-totla-amt').text(mpCurrencycode + formatter.format(parseFloat(currentSubtotal1) + deliveryCharge));
    $('.total_area .total-cost').text(formatter.format(totalwithDelivery));
    removeDiscount();
        if ($('#maketplace-type').val() == 'spacetime'){
            currentSubtotal = $('.review-order-price:first').text();
            deliveryCharge =  $('.review-order-container:contains("Delivery cost") .review-order-price').text();
            currentTotal =  $('.review-order-container:contains("Total") .review-order-price').text();
            //trim the characters then parse
            currentSubtotal1 = currentSubtotal.replace(/[^\d.-]/g, '');                                                                        
            deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
            deliveryCharge = parseFloat(deliveryCharge);
                if ($('#promodiv').find('#couponinput').length == 0) { 
                    couponvalue = 0;
                } else {
                    couponvalue =  parseFloat(calculatePercentage(discountVal,currentSubtotal1));
                }
            totalwithcoupon = currentSubtotal1 - couponvalue ;
            totalwithDelivery = totalwithcoupon + deliveryCharge;
            $('#currencySym').text('-' + mpCurrencycode);
            //total - coupon discount
            $('#price_amt').text(couponvalue.toFixed(2));
            //Total
            $('.review-order-container:contains("Total") .review-order-price').text(mpCurrencycode + formatter.format(totalwithDelivery));
        }
    
        if (document.body.className.includes('delievry-settings')) {
            couponvalue = 0;
            subtotal_del2=  $('.l_box p .sub-total').text();
            deliveryCharge =  $('.l_box p .delivery-costs').text();
            //trim the characters then parse
            subtotal_del= subtotal_del2.replace(/[^\d.-]/g, '');
            subtotal_del = parseFloat(subtotal_del).toFixed(2);
            deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
            deliveryCharge = parseFloat(deliveryCharge).toFixed(2);
            // couponvalue =  parseFloat(calculatePercentage(discountVal,subtotal_del));
            couponvalue = parseFloat(couponvalue).toFixed(2);
            totalwithcoupon = subtotal_del - couponvalue ;
            totalwithDelivery = parseFloat(totalwithcoupon) + parseFloat(deliveryCharge);
            $('#currencySym').text('-' + mpCurrencycode);
            //total - coupon discount
            $('#price_amt').text(couponvalue);
            //Total
            $('.total_area .total-cost').text(formatter.format(totalwithDelivery));
        }   
   
});

});
})();