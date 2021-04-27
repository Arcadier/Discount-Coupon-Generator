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
    const url = window.location.href.toLowerCase();
//get coupon value to display in Admin transaction details page
function getDiscountValue(priceCal,invoice){
    var invoiceNo = invoice; //window.location.pathname.split("/").slice(-1)[0];
    //$('.transaction-detail .fields-group:contains("INVOICE ID") p').text();
    console.log(invoiceNo);  // 
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
            // if (Object.keys(discountDetails.result).length === 0) {
                if (Object.keys(discountDetails.result).length === 0) {
                
                console.log('wth')
                } else {
                
                console.log('else')
                couponname = discountDetails.result[0].CouponCode;
                coupondiscount = discountDetails.result[0].DiscountValue;  
                //var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
               //     $('.page-transaction-details').append(couponspan);
               discount_orderDetails(priceCal)

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
       // waitForElement('#couponhidden',function(){
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
          //  var total = parseFloat(coupondiscount) * t_subtotal / 100;  
            // console.log(total);    
            priceCal.find('.amount').text('- ' + $('#currencyWithSymbol').val() + formatter.format(coupondiscount));
            
            if ($(".amount", priceCal).find("#couponname").length == 0) {
                $('.amount', priceCal).prepend('<label id ="couponname"> </label>');
                $('.amount').children('label').text(couponname);
            }

            var Total = parseFloat(t_subtotal) + parseFloat(t_delivery) - t_adminfee
            
            // console.log(parseFloat(t_subtotal) - total);
            // console.log(parseFloat(t_delivery) - t_adminfee);

            Total = Total.toFixed(2)
            //console.log(Total.toFixed(2));
        
        waitForElement('.details-col .description h1',function(){
            var parents = priceCal.parent();
            var totalLabel = parents.find('.description:contains("TOTAL ORDER PAYOUT") h1');
            var test = formatter.format(Total); 
          //  console.log(test);
            totalLabel.text($('#currencyWithSymbol').val() + formatter.format(Total));

           // console.log(formatter.format(Total));
    });
   // })
}
    $(document).ready(function() {
           // const url = window.location.href.toLowerCase();
        
            //admin transaction page loads
       
        

        if (url.indexOf("&isfailedtransaction=true") >= 0) {
            var new_invoice = pathname.split("=")[1];
            var invoiceNumber =  new_invoice.split("&").shift();
            console.log(invoiceNumber);
            $(".transaction-detail .panel-order .price-cal").each(function(){
                var $this =  $(this);
                getDiscountValue($this, invoiceNumber);
                // discount_orderDetails($this);
            
            });

        } else {
            if (url.indexOf('/admin/transactions/details') >= 0) {
                var invoiceNo = window.location.pathname.split("/").slice(-1)[0];
                
                    $(".transaction-detail .panel-order .price-cal").each(function(){
                        var $this =  $(this);
                        getDiscountValue($this, invoiceNo);
                        // discount_orderDetails($this);
                    
                    });
            }
        }


    });
})();