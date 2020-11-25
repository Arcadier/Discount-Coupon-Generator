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
    var invoiceNo = $('.transaction-detail .fields-group:contains("INVOICE ID") p').text();
    console.log(invoiceNo);  // window.location.pathname.split("/").slice(-1)[0];
	var data = { 'invoice_number': invoiceNo }; 
    var apiUrl = packagePath + '/get_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (result)
        {
            console.log(JSON.stringify(result))
            var discountDetails = $.parseJSON(result);
            if (discountDetails.result.length == 0) {
            }else{
                couponname = discountDetails.result[0].CouponCode;
                coupondiscount = discountDetails.result[0].DiscountPercentage;  
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

function discount_orderDetails(priceCal) {
        waitForElement('#couponhidden',function(){
        //1. get the current order sub total
            var subtotal = priceCal.find('p:contains("Order Subtotal")').text();
            var t_subtotal =  subtotal.replace(/[^\d.-]/g, '');
        
        //2. get the delivery fee
            var delivery = priceCal.find('p:contains("Delivery")').text();
            if (delivery == '') {
                var t_delivery = 0;
            }else {
                var t_delivery = delivery.replace(/[^\d.-]/g, '');
            }
        //3. get the admin fee
            var adminfee = priceCal.find('p:contains("Order Admin Fee")').text();
            var t_adminfee = adminfee.replace(/[^\d.-]/g, '');
            t_adminfee = t_adminfee.replace(/-/g, "");
        
            
        var promo = '<p class = "amount"> </p>';
        priceCal.append(promo);
        var total =   parseFloat(coupondiscount) * t_subtotal / 100;    
        priceCal.find('.amount').text('- ' + $('#currencyWithSymbol').val() + formatter.format(total));
        $('.amount').prepend('<label id ="couponname"> </label>');
        $('.amount').children('label').text(couponname);     

        var Total = parseFloat(t_subtotal) - total + parseFloat(t_delivery) - t_adminfee;
        
        waitForElement('.details-col .description h1',function(){
            var parents = priceCal.parent();
            var totalLabel = parents.find('.description:contains("TOTAL ORDER PAYOUT") h1');
            var test =  formatter.format(Total); 
            totalLabel.text($('#currencyWithSymbol').val() + formatter.format(Total));
    });
    })
}
    $(document).ready(function() {
            const url = window.location.href.toLowerCase();
        
            //admin transaction page loads
            if(url.indexOf('/admin/transactions/details') >= 0) {
            
                $(".transaction-detail .panel-order .price-cal").each(function(){
                    var $this =  $(this);
                    getDiscountValue();
                    discount_orderDetails($this);
                
                });
            }
    });
})();