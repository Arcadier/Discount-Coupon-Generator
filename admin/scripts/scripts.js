(function() {
    var scriptSrc = document.currentScript.src;
    var pathname = (window.location.pathname + window.location.search).toLowerCase();
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    console.log(packagePath);
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    const HOST = window.location.host;
    var customFieldPrefix = packageId.replace(/-/g, "");
    var token = commonModule.getCookie('webapitoken');
    var userId = $('#userGuid').val();
    var campaign_id;
    var timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    var couponname, coupondiscount;
//get coupon value to display in Admin transaction details page
function getDiscountValue(){
    var invoiceNo  = window.location.pathname.split("/").slice(-1)[0];
	var data = { 'invoice_number': invoiceNo }; 
    var apiUrl = packagePath + '/get_discount.php';
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
                $('.page-transaction-details').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

//SPECIAL FUNCTIONS============================
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

function discount_orderDetails() {
    waitForElement('#couponhidden',function(){
    //1. get the current order sub total

        var subtotal = $('.price-cal p:contains("Order Subtotal")').text();
        var t_subtotal =  subtotal.replace(/[^\d.-]/g, '');
    
    //2. get the delivery fee
  
        var delivery = $('.price-cal p:contains("Delivery")').text();
        var t_delivery = delivery.replace(/[^\d.-]/g, '');
      
    //3. get the admin fee
        var adminfee = $('.price-cal p:contains("Order Admin Fee")').text();
        var t_adminfee = adminfee.replace(/[^\d.-]/g, '');
      
    var promo = '<p id = "amount"> </p>';
    $('.price-cal').append(promo);
    $('#amount').text('- ' + $('#currencyCode').val() + formatter.format(coupondiscount));
    $('#amount').prepend('<label id ="couponname"> </label>');
    $('#amount').children('label').text(couponname);     
   
     var total =   parseFloat(t_adminfee) + parseFloat(coupondiscount);
     var Total = parseFloat(t_subtotal) - total + parseFloat(t_delivery);

     waitForElement('.details-col .description h1',function(){
        var totalLabel = $('.description:contains("TOTAL ORDER PAYOUT") h1');
        var test =  formatter.format(Total); 
        totalLabel.text($('#currencyCode').val() + formatter.format(Total));
   });
})
  }
    $(document).ready(function() {
        const url = window.location.href.toLowerCase();
     
//admin transaction page loads
if(url.indexOf('/admin/transactions/details') >= 0) {
    getDiscountValue();
    discount_orderDetails()
}
    });
    
})();