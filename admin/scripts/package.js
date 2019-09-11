(function() {
    var scriptSrc = document.currentScript.src;
    var pathname = (window.location.pathname + window.location.search).toLowerCase();
    var packagePath = scriptSrc.replace('/scripts/package.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    const HOST = window.location.host;
    var customFieldPrefix = packageId.replace(/-/g, "");
    var token = commonModule.getCookie('webapitoken');
    var userId = $('#userGuid').val();
    var campaign_id;
    var timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    var rrpStatus,ifLimited;
    var id,ids;
    function setTimezone(){
        var timezone_offset_minutes = new Date().getTimezoneOffset();
        timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
        var data = { 'timezone': timezone_offset_minutes  }; 
        var apiUrl = packagePath + '/get_timezone.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
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

     $('input[type="checkbox"]').click(function(){
        if($(this).attr('id')== 'limited'){

        }else{

        var tempId =  $(this).attr('value');
         $(this).removeAttr('id');
         $(this).attr('id', tempId);
         var par =  $(this).parent('div');
         par.find('.onoffswitch-label').attr('for',tempId);
         id = $(this).attr('id');
            if( $('#'+id).length){
                saveStatus(tempId);
            }
         
     }
    });

//get coupon value to display in Admin transaction details page
function getDiscountValue(){
    // var invoiceNumber = pathname.split('=')[1]; 
    var invoiceNo  = window.location.pathname.split("/").slice(-1)[0];
	var data = { 'invoice_number': invoiceNo }; 
    var apiUrl = packagePath + '/get_discount.php';
    $.ajax({
        url: apiUrl,
        headers: {
            'Authorization': 'Bearer ' + token,
        },
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

$('#coupon_code').blur(function() {
   ValidateCoupon();
  });

  function ValidateCoupon() {
    var couponinput = $('#coupon_code').val();
	var data = { 'coupon_code': couponinput }; 
    var apiUrl = packagePath + '/validate_coupon.php';
    $.ajax({
        url: apiUrl,
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = $.parseJSON(result);
            if (discountDetails.result.length == 0) {
                $('#msg').remove();
                $('#save_details').prop("disabled",false);
                           
            }else{
                var error = '<span class="coupon-msg" id="msg">Coupon code already exists.</span>';
                var inputparent = $('#coupon_code').parent('.form-element');
                    if ($('.form-element').find('#msg').length == 0) {  
                        inputparent.append(error);
                    }
                         $('#save_details').prop( "disabled", true);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}
    
function saveStatus(id) {
    if ($('#'+id).is(":checked")){
            rrpStatus = 1;
            }else { rrpStatus = 0;}

        console.log(rrpStatus);
        var couponid = $('#'+id).val();
        var data = { 'couponId': couponid , 'status': rrpStatus };
         var apiUrl = packagePath + '/package_switch.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization':  token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
               if(rrpStatus == 1){
               }else { toastr.success('Campaign is disabled.');}
              
            },
            error: function (jqXHR, status, err) {
                  toastr.error('---');
            }
        });
       
       }
            
function getMarketplaceCustomFields(callback) {
        var apiUrl = '/api/v2/marketplaces'
        $.ajax({
            url: apiUrl,
            method: 'GET',
            contentType: 'application/json',
            success: function(result) {
                if (result) {
                    callback(result.CustomFields);
                }
            }
        });
}

function saveCampaignDetails() {
        if ($('#limited').is(":checked")){
            ifLimited =  1;
        }else{ ifLimited = 0}
        var data = { 'campaign_name': $('#campaign_name').val(), 'last_updated': timezone_offset_minutes, 'coupon_code': $('#coupon_code').val(), 'isLimited': ifLimited, 'isEnabled': '1', 'discount_value': $('#d-val').val(), 'max_redeem': $('#redeem').val() };
        var apiUrl = packagePath + '/save_details.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully saved.');
                location.reload(); 
                clearFields();
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });
    }


    function clearFields(){
        $('#campaign_name').val('');
        $('#redeem').val('');
        $('#campaign_name').val('');
        $("#limited").prop("checked", false);
        $('#coupon_code').val('');
        $('#d-val').val('');
       
        }
    function deletePage() {
        var data = { 'campaignId' : campaign_id,'userId': userId};
        // console.log(pagedids);
         var apiUrl = packagePath + '/delete_content.php';
        $.ajax({
            url: apiUrl,          
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully deleted.');
                location.reload(); 
            },
            error: function (jqXHR, status, err) {
            }
        });
    }

    function editPage(col1) {
        var couponname,coupondiscount,islimited,redeemable;
        $('#campaign_name').val(col1);
       
        console.log($('.coupon_id').val());
        var data = { 'couponId' : $('.coupon_id').val()};
         var apiUrl = packagePath + '/get_coupon_details.php';
        $.ajax({
            url: apiUrl,          
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                var discountDetails1 = $.parseJSON(result);
                console.dir(discountDetails1);
                   couponname = discountDetails1.result[0].CouponCode;
                   coupondiscount = discountDetails1.result[0].DiscountValue;  
                   islimited = discountDetails1.result[0].IsLimited; 
                   redeemable =  discountDetails1.result[0].MaxRedeem;
                    
                     $('#redeem').val(redeemable);
                     $('#coupon_code').val(couponname);
                     $('#d-val').val(coupondiscount);
                    if(islimited == 1) {
                        $("#limited").prop("checked", true);
                    }else {
                        //disable max redeem if unlimited
                        $('#redeem').attr("disabled", "disabled");
                    }

            },
            error: function (jqXHR, status, err) {
            }
        });
    }

    //update coupon details

    function updateDetails(){
        if ($('#limited').is(":checked")){
            ifLimited =  1;
        }else{ ifLimited = 0}
        console.log('limited ' + ifLimited);
        var data = { 'couponId' : $('.coupon_id').val(), 'campaignId': $('.camp_id').val(), 'campaign_name': $('#campaign_name').val(), 'last_updated': timezone_offset_minutes, 'coupon_code': $('#coupon_code').val(), 'isLimited': ifLimited, 'isEnabled': '1', 'discount_value': $('#d-val').val(), 'max_redeem': $('#redeem').val() };
        var apiUrl = packagePath + '/update_details.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully updated.');
                location.reload(); 
                clearFields();
               
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });
    }
    $(document).ready(function() {

        $('#d-val').on('input', function () {
    
            var value = $(this).val();
            
            if ((value !== '') && (value.indexOf('.') === -1)) {
                
                $(this).val(Math.max(Math.min(value, 100), -90));
            }
        });

        const url = window.location.href.toLowerCase();
        setTimezone();
        $('#save_details').click(function() {
            var isUpdate =  $('.coupon_id').attr('dir');
            if (isUpdate ==  'update') {
                updateDetails();
                //update function
            }else {
               if($('#campaign_name').val() == "") {
                    $('#campaign_name').css('border','1px solid red');}
                else if ($('#coupon_code').val() == "" ) {
                  $('#coupon_code').css('border','1px solid red');
                } 
                else if ($('#d-val').val() == "" ){
                  $('#d-val').css('border','1px solid red');
                }
           
               else {
                saveCampaignDetails();
                $('#createcampaign').modal().hide();
                $("#modal .close").click();
               }
              
            }           
        });

        $('#createcampaign .close').click(function() {
            $('#limitedoption').show();
            clearFields();
            $('#msg').remove();

            //
          });



  //delete the page contents
  $('#popup_btnconfirm').click(function() {
    campaign_id = $('.record_id').val();
    deletePage();
    //
  });

  $("#campaigntable").on('click', '#edit', function() {

    // get the current row
    // campaign id for campaign name
    var camp_id = $(this).attr('data-id');
    $('.camp_id').val(camp_id);

    var coup_id = $(this).attr('dir');
     $('.coupon_id').val(coup_id);
     $('.coupon_id').attr('dir','update');
      var isUpdate =  $('.coupon_id').attr('dir'); 
   if (isUpdate ==  'update') {
        $("#redeem").removeAttr("disabled");
         $("#coupon_code").attr("disabled", "disabled");
         $('#limitedoption').hide();
    }

    ids = $(this).attr('dir');
    $('.coupon_id').val(ids);
   
    var currentRow = $(this).closest("tr");
    col1 = currentRow.find("#campaignname").html(); // get current row 1st table cell TD value
    editPage(col1);
  });

 

//admin transaction page loads
if(url.indexOf('/admin/transactions/details') >= 0) {
    getDiscountValue();
}


    });
    
})();