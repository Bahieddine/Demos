(function ($) {
    $(document).ready(function () {
        //create cookie
        var IsDocCookieValue = getCookie('IsDocCookie');
        if (IsDocCookieValue != 'True') {
            $('#hcp-site.modal').modal('show');
            $('#hcp-site.modal button').click(function () {
                $(window).on('load', function () {
					console.log('animate btn');
					$('#home-hero').addClass('animate')
				})
				if(document.readyState === 'complete') {
					$('#home-hero').addClass('animate')
				}
            })
			$('#hcp-site').on('hidden.bs.modal', function (e) {
				$(window).on('load', function () {
					console.log('animate modal hidden');
					$('#home-hero').addClass('animate')
				})
				if(document.readyState === 'complete') {
					$('#home-hero').addClass('animate')
				}
			})
        } else {
            $(window).on('load', function () {
				console.log('window loaded');
				$('#home-hero').addClass('animate')
			})
			if(document.readyState === 'complete') {
				console.log('document readyState', document.readyState);
				$('#home-hero').addClass('animate')
			}
        }        
        setCookie('IsDocCookie', 'True', 30);


        

        //declare isi and isi_tray
        var isi = $('#isi');
        var isiTray = $('#isi_tray');
        // isi view
        $("#isi_tray .glyphicon").click(function () {
            console.log(this);
            if (!$(this).hasClass('rotate-180')) {
                $(this).addClass('rotate-180');
                isiTray.addClass('isi-open');
            } else {
                $(this).removeClass('rotate-180');
                isiTray.removeClass('isi-open');
            }
        })
        // isi hide on scroll
        // var pathname = window.location.href;
        // var expr = /isi/;
        // if (expr.test(pathname)) { 
        //     isiTray.addClass('hide');
        // }
        // $(window).scroll(function () {
        //     if (isi.offset().top < ($(window).scrollTop() + $(window).height())) {
        //         isiTray.addClass('remove');
        //     } else {
        //         isiTray.removeClass('remove');
        //     }
        // });

        //menu desktop dropdown on hover
        //menu dropdown fix on hover
       
        /*$('.dropdown').hover(function() {
            $(this).addClass('open');
        }, function () {
            $(this).removeClass('open');
        });*/

        var timer;
        $('.dropdown').hover(function() {
            clearTimeout(timer);
            openSubmenu($(this));
        }, function () {
            timer = setTimeout(
                closeSubmenu
            , 500);
        });
    

        function openSubmenu(menu) {
            $('.dropdown').removeClass('open');
            $(menu).addClass("open");
        }
        function closeSubmenu() {
            $('.dropdown').removeClass("open");
        }

        $('#navbar .dropdown-toggle').click(function (e) {
            if ($(window).width() > 768 && !isMobile()) {
                window.location = $(this).attr('href');
            }
        })


        // menu animation
        $('#navbar .navbar-toggle').click(function () {
            if (!$('#navbar-collapse').hasClass('in')) {
                if ($(window).width() > 767) {
                    $('body').css('right', '50%');
                    $('#navbar-collapse').addClass('in-half');
                } else {
                    $('body').css('right', '100%');
                    $('#navbar-collapse').addClass('in-full');
                }
            }
        })

        $('#navbar .close-menu').click(function () {
            $('#navbar-collapse').removeClass('in');
            $('#navbar-collapse').removeClass('in-half');
            $('#navbar-collapse').removeClass('in-full');
            $('body').css('right', '0');
        })

        //fixing submenu postion
        function fixSubmenu() {
            if ($(window).width() > 991) {
                var subMenuWidth,
                    parentCenter,
                    subMenuCenter,
                    paddingLeft;
                
                $('#navbar ul.dropdown-menu').each(function (parentKey) {
                    subMenuWidth = 0;
                    parentCenter = 0;
                    subMenuWidth = 0;
                    paddingLeft = 0;
                    paddingRight = 0;
    
                    $(this).css({ 'display': 'block', 'opacity': '0' });
                    $(this).find('li').each(function (key, el) {
                        subMenuWidth += $(this).width();
                    });
    
                    parentCenter = $(this).parent().position().left + ($(this).parent().outerWidth(true) / 2);
                    subMenuCenter = subMenuWidth / 2;
                    paddingLeft = parentCenter.toFixed(0) - subMenuCenter.toFixed(0);
                    paddingRight = ($(window).width() - subMenuCenter.toFixed(0)) - parentCenter.toFixed(0);
                    
                    if ((($(this).children().last().position().left + $(this).children().last().width()) + paddingLeft) > ($(window).width() - 15)) {
                        
                        $(this).attr('style', '');
                        $(this).css({'text-align': 'right', 'padding-right': paddingRight, 'padding-left': '0'});
                    } else {
                        
                        $(this).attr('style', '');
                        if (paddingLeft < 0) {
                            paddingLeft = $(this).parent().position().left;
                        }
                        $(this).css('padding-left', paddingLeft);
                    }                
                });
            }
        }

        fixSubmenu();
        $(window).on('resize', function () {
            fixSubmenu();
        })

        //fix branch position
        fixBranch($('.branch-js'), 'margin-right');
        fixBranch($('.branch-js-left'), 'margin-left');
        $(window).on('resize', function () {
            fixBranch($('branch-js'), 'margin-right');
            fixBranch($('branch-js-left'), 'margin-left');
        });

        function fixBranch(el, marginDirection) {
            if (el === undefined) {
                return false;
            }
            var mainWrapperWidth = parseFloat($('.main-wrapper').width());
            var containerWidth = parseFloat($('.container').outerWidth());
            var margin = ( mainWrapperWidth - containerWidth ) / 2;

            el.css(marginDirection, '-' + margin + 'px');
        }
        
        // Modals
        var modals = [];
        $('.modal').each(function (key, modal) {
            modals.push(modal.id);
        });
        
        $('a[target="_blank"]').click(function (e) {
            var linkClass = $(this).attr('class').split(" ");
            modalIndex = modals.indexOf(linkClass[0]);
            if ( modalIndex > -1) {
                e.preventDefault();
                $('#' + modals[modalIndex]).modal('show');
            } else {
                console.log('no modal');
            }
            var url = $(this).attr('href');
            $('.modal .modal-body a.btn').attr('href', url);
        })
        $('.modal .btns a.btn').click(function () {
            $('.modal').modal('hide');
        })

        

        //webform radio check
        var signUpFormId = '#webform-submission-sign-up-for-updates-node-33-add-form';
        var infusionRegFormId = '#webform-submission-infusion-center-registration-node-34-add-form';

        if ($(signUpFormId + ' #edit-i-am-a---wrapper').length > 0) {
            $(signUpFormId + ' #edit-i-am-a---wrapper input:checked').parent().addClass('checked');
        }
        $(signUpFormId + ' #edit-i-am-a---wrapper input').click(function () {
            if ($(this).parent().text().toLowerCase() === 'other') {
                window.open($(this).val(), '_blank');
                return false;
            }
            $(signUpFormId + ' #edit-i-am-a---wrapper label').removeClass('checked');
            $(this).parent().addClass('checked');
        })
        if ($(infusionRegFormId).length > 0) {
            $(infusionRegFormId + ' #edit-state option:first-child').html('State*');
            $(infusionRegFormId + ' .day-hours > div:nth-child(2) select option:first-child').html('Open');
            $(infusionRegFormId + ' .day-hours > div:nth-child(4) select option:first-child').html('Close');
        }



        //check if mobile
        function isMobile() {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                return true;
            }
            return false;
        }

        //Dosing Calculator
        if ($('.calculator-wrapper').length > 0) {
            $('.calculator-wrapper .weight span').html($('.calculator-wrapper .units input:checked').val());
        }

        $('.calculator-wrapper .units input').click(function () {
            $('.calculator-wrapper .dosage p span').html('');
            $('.calculator-wrapper .vials p span').html('');
            $('.calculator-wrapper .weight span').html($('.calculator-wrapper .units input:checked').val());
            $('.dosing-note').addClass('hide');
        })

        $('.calculator-wrapper .calculate .btn').click(function () {
            var weight = $('.calculator-wrapper .weight input').val();
            var unit = $('.calculator-wrapper .units input:checked').val();
            if (weight === undefined) {
                alert('Please enter weight value!');
                return;
            }
            var DosVials = calcDoseVials(weight, unit);
            $('.calculator-wrapper .dosage p span').html(DosVials.ml);
            $('.calculator-wrapper .vials p span').html(DosVials.vials);
        });

        $('.calculator-wrapper .weight input').focus(function () {
            $('.calculator-wrapper .dosage p span').html('');
            $('.calculator-wrapper .vials p span').html('');
            $('.dosing-note').addClass('hide');
        })

        function calcDoseVials(weight, unit) {
            var obj = {};
            if (unit === 'kg') {
                obj.ml = (weight * 0.15);
                if (((weight >= 27) && (weight <= 33)) || ((weight >= 61) && (weight <= 66)) || ((weight >= 94) && (weight <= 99))) {
                    $('.dosing-note').removeClass('hide');
                }
            } else {
                obj.ml = ((weight / 2.2) * 0.15);
                if (((weight >= 57) && (weight <= 73)) || ((weight >= 133) && (weight <= 146)) || ((weight >= 206) && (weight <= 220))) {
                    $('.dosing-note').removeClass('hide');
                }
            }
            obj.vials = Math.ceil((obj.ml + 1) / 5);
            obj.ml = parseFloat(obj.ml).toFixed(2);
            return obj;
        }

        //webform validation design fixes
        //1- cehck if this is the sign up for updates page
        if (
            $('article.page.full').attr('about') === '/signup-for-updates' || $('article.page.full').attr('data-history-node-id') === '33'
            ||
            $('article.page.full').attr('about') === '/infusion-center-registration' || $('article.page.full').attr('data-history-node-id') === '34'
        ) {
            console.log(true);
            //2- check if there is an error
            if ($('.highlighted .alert-danger').length > 0) {
                $('.highlighted .alert-danger').appendTo('.err-msg');
                $('.err-msg .alert-danger h4').html('Please correct the following errors:').removeClass('sr-only');
                if ($('.err-msg  .alert-danger span.email-duplication').length > 0) {
                    console.log($('.err-msg  .alert-danger span.email-duplication').length)
                    $('#update-email').modal('show');
                }
                if ($('.err-msg  .alert-danger span.verification-sent').length > 0) {
                    $(signUpFormId + ' input, ' + infusionRegFormId + ' input').val('').attr('value', '').removeClass('error').parent().removeClass('has-error');
                    $(signUpFormId + ' select, ' + infusionRegFormId + ' select').val('').attr('value', '').removeClass('error').closest('.has-error').removeClass('has-error');
                    $('.err-msg').empty();
                    $('#verify-sent').modal('show');
                    $('#verify-sent').on('hidden.bs.modal', function (e) {
                        window.location.href = '/sign-up';
                    })
                }

            }

            //small fix for select
            $('article.page.full ' + signUpFormId + ' #edit-medical-specialization option:first-child').html('Medical specialization');
            $('article.page.full ' + signUpFormId + ' #edit-professional-designation option:first-child').html('Professional designation');
            
            $('#update-email .btn.update').click(function () {
                $(signUpFormId + ' #edit-email-update').val('update');
                $(signUpFormId + '')[0].submit();
            });
        }

        //video modals
        $('a.video').click(function (e) {
            e.preventDefault();
            var modalName = $(this).attr('data-target');
            $(modalName + ' iframe').attr('src', $(this).attr('href'));
        });

        $('.modal.video').on('hide.bs.modal', function () {
            $(this).children().find('iframe').attr('src', '');
        })

        //ask-now
        $('#seek .link a').click(function (e) {
            e.preventDefault();
            $('#seek .results-table').slideToggle(500);
            $(this).toggleClass('open');
        });

        // isi hide on scroll
        
        var askExpr = /tab=#ask/;
        var seekExpr = /tab=#seek/;
        var knowExpr = /tab=#know/;
        if (askExpr.test(pathname)) { 
            $('.ask-now .tabs .nav li:first-child a').tab('show');
        }
        if (seekExpr.test(pathname)) { 
            $('.ask-now .tabs .nav li:nth-child(2) a').tab('show');
        }
        if (knowExpr.test(pathname)) { 
            $('.ask-now .tabs .nav li:nth-child(3) a').tab('show');
        }
        $('.ask-now .tabs .nav li a').click(function () {
            var tabName = $(this).attr('href');
            history.pushState(null, '', '/ask-now?tab=' + tabName);            
            $(this).tab('show');
        })
        

        
        //select options
    })
})(jQuery);