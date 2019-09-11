<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<!-- begin header --> 
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Discount Coupon</title>

    <link href="css/adminstyle.css" rel="stylesheet" type="text/css">
    <link href="css/coupon.css" rel="stylesheet" type="text/css">
</head>
<!-- end header --> 
        <div class="page-coupon">
                <div class="pull-left">
              
            </div>
            <div class="page-content page-layout">
                <div class="gutter-wrapper">
                    <div class="panel-box">
                        <div class="page-content-top private-setting-container-switch">
                            <div class="row">
                                <div class="col-md-8">
                                    <div><i class="icon icon-3x discount-icon-big"></i></div>
                                    <div>
                                        <p><b>Create coupons for buyers to use on your marketplace for discounts</b></p>
                                    </div>
                                </div>
                                <div class="col-md-4 text-right">
                                    <a href="#" class="blue-btn al-middle" data-toggle="modal" data-target="#createcampaign">Create New Campaign</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-box ">
                        <div class="blsl-list-tblsec1">
                            <table id ="campaigntable" class="sortable">
                                <thead>
                                    <tr>
                                        <th>Campaign Name</th>
                                        <th>Last Updated</th>
                                        <th>Coupon Code</th>
                                        <th>Discount Value</th>
                                        <th>Redemption</th>
                                        <th>Actions</th>
                                     
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- <tr> -->
                                    <?php   
                                        include 'get_details.php';
                                        $campaign =  getCampaignDetails();
                                        $admin_token = getAdminToken();
                                        $customFieldPrefix = getCustomFieldPrefix();
                                        $baseUrl = getMarketplaceBaseUrl(); 
                                        $url = $baseUrl . '/api/v2/marketplaces/';
                                        $marketplaceInfo = callAPI("GET", $admin_token['access_token'], $url, false);
                                        
                                        foreach ($marketplaceInfo['CustomFields'] as $cf) {
                                            if ($cf['Name'] == 'Timezone' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
                                                $tz= $cf['Values'][0];
                                            }
                                        }
                                        foreach($campaign['Records'] as $campaigndetails){
                                        ?>

                                            <!-- <tr> -->
                                                <?php
                                            error_log($campaign_id = $campaigndetails['Id']);
                                             $campaign_name = $campaigndetails['CampaignName'];  
                                             $last_updated =  $campaigndetails['LastUpdated'];
                                             $coupon =  getCouponDetails($campaign_id);
                                                 foreach($coupon['Records'] as $coupondetails) {
                                                    $coupon_id = $coupondetails['Id'];
                                                    $coupon_code = $coupondetails['CouponCode'];
                                                    $coupon_discount = $coupondetails['DiscountValue'];
                                                    $coupon_maxredeem = $coupondetails['MaxRedeem'];
                                                    $coupon_quantity =  $coupondetails['Quantity'];
                                                    $coupon_enabled = $coupondetails['IsEnabled'];
                                                    $coupon_limited = $coupondetails['IsLimited'];

                                                    $timezone_name = timezone_name_from_abbr("", $tz*60, false);
                                                    date_default_timezone_set($timezone_name);

                                                    $date = date('d/m/Y H:i', $last_updated);
                                                    if($coupon_enabled == 1){
                                                        error_log('index '. $coupon_enabled);
                                                       $checked = "checked = checked";
                                                    }else { 
                                                       $checked = "";
                                                       error_log($coupon_enabled);
                                                    
                                                    }
                                   
                                                    echo  "<td id = 'campaignname'>" . $campaign_name . "</td>";
                                                    echo "<td>" .  $date . "</td>";
                                                    echo "<td>" .  $coupon_code . "</td>";
                                                    echo  "<td>". $coupon_discount . '%' . "</td>";
                                                    echo "<td>";
                                        ?>

                                            <?php
                                                    if($coupon_limited == '1') {
                                                        echo "<span>  $coupon_quantity  </span>  <span> / $coupon_maxredeem </span>" ;
                                                    }else{
                                                        echo "<div class='onoffswitch yn'>";
                                                        echo "<input type='checkbox' value= $coupon_id name='onoffswitch' class='onoffswitch-checkbox switch-private-checkbox' id= $coupon_id $checked>";
                                                        echo "<label class='onoffswitch-label' for= $coupon_id > <span class='onoffswitch-inner'></span> <span class='onoffswitch-switch'></span> </label>";
                                                        echo "</div> ";    
                                                }
                                            ?> 
                                        </td>
                                        <td>
                                            <a href="#" data-toggle="modal" dir="<?php echo $coupon_id; ?>"data-target="#createcampaign" id="edit" data-id="<?php echo $campaign_id; ?>"><i class="icon icon-edit"></i></a>
                                            <a href="#" dir= "<?php echo $campaign_id; ?>" class="btn_delete_act" id = "del"><i class="icon icon-delete"></i></a>
                                        </td>
                                    </tr>
                                    <?php
                                             }
                                        }
                                    ?>
                                </tbody>
                            </table>

                          </div>
                        </div>
                    </div>
                </div>
            <div class="col-md-12"> 
            <nav class="text-center" aria-label="Page navigation">
              <ul class="pagination justify-content-center">

              </ul>
            </nav>
        </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="popup  popup-area popup-delete-confirm page-coupon" id="DeleteCustomMethod">
        <input type="hidden" class="record_id" value="">
            <div class="wrapper"> <a href="javascript:;" class="close-popup"><img src="images/cross-icon.svg"></a>
                <div class="content-area">
                    <p>Are you sure you want to delete this?</p>
                </div>
                <div class="btn-area text-center smaller">
                    <input type="button" value="Cancel" class="btn-black " id="popup_btncancel">
                    <input id="popup_btnconfirm" type="button" value="Okay" class="my-btn btn-blue">
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="createcampaign" id="createcampaign">

            <input type="hidden" class="coupon_id" value="" dir="">
            <input type="hidden" class="camp_id" value="" dir="">
           
            <div class="modal-dialog modal-cm" role="document">
                <div class="modal-content">
                    <form class="needs-validation" action=" " method="post" id="createcampaign2" novalidate>
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><img src="images/cross-icon.svg"></button>
                            <h4 class="modal-title" id="gridSystemModalLabel">Campaign Details</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-element">
                                        <label>Campaign Name</label>
                                        <input type="text" name="" class="w-100 " id = "campaign_name"  required="required"/>
                                    </div>
                                </div>
                                <div class="col-sm-12" id ="limitedoption">
                                    <div class="form-element">
                                        <label>Is this a limited coupon?</label>
                                        <div class="onoffswitch ">
                                            <input type="checkbox" value = "<?php echo $campaign_id; ?>" name="limited" class="onoffswitch-checkbox switch-private-checkbox " id="limited">
                                            <label class="onoffswitch-label" for="limited"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span> </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12">
                                    <div class="form-element">
                                        <label>Maximum Redemptions</label>
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <input type="number" onkeypress="return isNumber1(event)" name="" class="w-100" id="redeem" disabled="disabled">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-sm-6">
                                    <div class="form-element">
                                        <label>Coupon Code</label>
                                        <input type="text" name="" class="w-100" id="coupon_code" maxlength="10 "  required="required"/>
                                    </div>
                                </div>
                                <div class="clearfix">   </div>
                                <div class="col-sm-6">
                                    <div class="form-element val-change">
                                        <label>Discount Value</label>
                                        <input type="number" onkeypress="return isNumber(event)" name="" id="d-val" class="w-100"  min="0" max="100" id="discount_value"  required="required"/>
                                        <span>%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer text-left">
                            <input type="button" class="blue-btn" value="Save changes" id ="save_details">
                            <!-- data-dismiss="modal" -->
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <!-- End Start Seller popup-->
        <div id="cover"></div>
        <div id="coverdark"></div>

        <!-- begin footer --> 
    
        <script type="text/javascript">

        jQuery("#myModal").on('shown.bs.modal', function() {
            jQuery('#modaldialog').html5imageupload({});
        });
        /*fixed canvas size issue while edit*/
        jQuery("#myModal").on('show.bs.modal', function() {
            jQuery(window).resize('trigger');
        });
        jQuery('.model-img-crop a.download').attr('data-dismiss', 'modal');
        jQuery('body').on('click', '.model-img-crop .download', function() {
            var src = jQuery(this).attr('href');
            var name = jQuery(this).attr('download');
            jQuery(".browse-control input[name='file_name']").val(name);
            jQuery(".cover-photo.bg-image-photo").html('');
            jQuery(".cover-photo.bg-image-photo").append("<img src=" + src + " alt=" + name + ">");
            jQuery("#myModal").modal("hide")
            return false;
        });


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isNumber1(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

$('#redeem').keyup(function(e){         
      if($(this).val().match(/^0/)){
          $(this).val('');
          return false;
      }
    });

    $('#d-val').keyup(function(e){         
      if($(this).val().match(/^0/)){
          $(this).val('');
          return false;
      }
    });
                                
$(document).ready(function() {
        
        $('#campaigntable').DataTable(
        {
        // "paging":   false,
        "order": [[ 1, "desc" ]],
        "lengthMenu": [[20], [20]],
        // "ordering": false,
        "info":     false,
        "searching" :false,
        "pagingType": "first_last_numbers",
        "columnDefs": [{ orderable: false, targets: [5] }]
        }
    );

    waitForElement('#campaigntable_wrapper',function(){
        var pagediv =  "<div class ='paging' id = 'pagination-insert'> </div>";
        $('#campaigntable_wrapper').append(pagediv);
    });

    waitForElement('#campaigntable_length',function(){
         $('#campaigntable_length').css({ display: "none" });
    });

    $('#coupon_code').keypress(function(e) { var regex = new RegExp("^[a-zA-Z0-9]+$"); var str = String.fromCharCode(!e.charCode ? e.which : e.charCode); if (regex.test(str)) { return true; } e.preventDefault(); return false; });
    $('.pr-text').keypress(function(e) { var regex = new RegExp("^[a-zA-Z0-9]+$"); var str = String.fromCharCode(!e.charCode ? e.which : e.charCode); if (regex.test(str)) { return true; } e.preventDefault(); return false; });
    
        });

        jQuery(window).bind('scroll', function() {

            // jQuery(".sidebar").getNiceScroll().resize();

        });

        jQuery(".mobi-header .navbar-toggle").click(function(e) {

            e.preventDefault();

            jQuery("body").toggleClass("sidebar-toggled");

        });

        jQuery(".navbar-back").click(function() {

            jQuery(".mobi-header .navbar-toggle").trigger('click');

        });

    

            jQuery('.btn_delete_act').click(function() {
            var page_id = $(this).attr('dir');
             console.log(page_id);

             $('.record_id').val(page_id);


                jQuery(this).parents("tr").addClass("active");
                jQuery('#DeleteCustomMethod').show();
                jQuery('#cover').show();

            });

            //update button
            jQuery('#edit').click(function() {
         
    
            });
            jQuery('#popup_btnconfirm').click(function() {

                jQuery('#DeleteCustomMethod').hide();
                jQuery("tr.active").remove();
                jQuery('#cover').hide();

            });

            jQuery('#save_details').click(function() {

            jQuery('#DeleteCustomMethod').hide();
            jQuery("tr.active").remove();
            jQuery('#cover').hide();

            });
        
            jQuery('#popup_btncancel,.close-popup').click(function() {
                jQuery("tr.active").removeClass("active");
                jQuery('#DeleteCustomMethod').hide();

                jQuery('#cover').hide();

            });
            
            checklimit();
            
            $("#limited").on("click", function() {
                checklimit();
            });

     //   });
        function checklimit(){
            if ($("#limited").prop("checked") == false) {
                var isUpdate =  $('.coupon_id').attr('dir');
                if (isUpdate ==  'update') {
                    $("#redeem").removeAttr("disabled");
                 $("#coupon_code").attr("disabled", "disabled");
                }else {
                $("#redeem").attr("disabled", "disabled");
                $("#coupon_code").removeAttr("disabled");
                }
                
            } else {
                $("#redeem").removeAttr("disabled");
                 $("#coupon_code").attr("disabled", "disabled");
                 //GENERATE RANDOM COUPON CODE
                var randcoupon =  Math.random().toString(36).substr(2, 10);
                randcouponstring = randcoupon.toUpperCase();
                $("#coupon_code").val(randcouponstring);
            }
        }
        </script>
        
        <script type="text/javascript">
        (function() {
     'use strict';
     window.addEventListener('load', function() {
         // Fetch all the forms we want to apply custom Bootstrap validation styles to
         var forms = document.getElementsByClassName('needs-validation');
         // Loop over them and prevent submission
         var validation = Array.prototype.filter.call(forms, function(form) {
             form.addEventListener('submit', function(event) {
                 if (form.checkValidity() === false) {
                     event.preventDefault();
                     event.stopPropagation();
                 }
                 form.classList.add('was-validated');
             }, false);
         });
     }, false);
 })();


  function waitForElement(elementPath, callBack){
	window.setTimeout(function(){
	if($(elementPath).length){
			callBack(elementPath, $(elementPath));
	}else{
			waitForElement(elementPath, callBack);
	}
	},10)
}


waitForElement('#pagination-insert',function(){
var pagination  = $('#campaigntable_paginate');
$('#pagination-insert').append(pagination);

});

</script>
<script type="text/javascript" src="scripts/package.js"></script>
<script type="text/javascript" src="scripts/pagination.js"></script>
<script type="text/javascript" src="scripts/jquery.dataTables.js"></script>
<!-- end footer --> 
