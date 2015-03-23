/***
 * onload we are here with initialization
 */
$(function(){
    /***
     * start/stop animation process
     */
    window.startAnimation = function() {
        if (!SortingAnimation.animationInProcess) {
            SortingAnimation.start(500);
            $("#start").hide();
            $("#stop").show();
        } else {
            clearInterval(SortingAnimation.interval);
            SortingAnimation.animationInProcess = false;
            $("#stop").hide();
            $("#start").show();
        }
    };

    /***
     * Creates li containers for digits
     */
    for(var i=1;i<21;i++) {
        var $liEl = $('<li class="ui-state-default"></li>');
        var $inputEl = $('<input type="text" size="2" idx="' + i +'" class="edit" style="display:none"/>');
        var $spanEl = $('<span class="display" id="s' + i +'"></span>');
        $liEl.append($spanEl).append($inputEl);
        $("#sortable").append($liEl);
    }

    $("#sortable").disableSelection();

    //edit digit on click
    $(".display").click(function(){
        if(!SortingAnimation.animationInProcess) {
            $(this).hide().siblings(".edit").show().val($(this).text()).focus();
        }
    });

    //when mouseout at after edit input field
    $(".edit").focusout(function(){
        // regex pattern tests if user enters not more than two digits and only digits
        if( /^(\d|\d\d)$/.test($(this).val())) {
            $(this).hide().siblings(".display").show().text($(this).val());
            var idx = parseInt($(this).attr('idx')) - 1;
            SortingAnimation.srcData[idx] = parseInt($(this).val());
            SortingAnimation.prepareAnimation(bubble, "#bubble");
        } else {
            $(this).hide().siblings(".display").show();
        }
    });

    //on Enter submit input field
    $(".edit").keypress(function(e) {
        if(e.which == 13){
            if (/^(\d|\d\d)$/.test($(this).val())) {
                $(this).hide().siblings(".display").show().text($(this).val());
            } else {
                $(this).hide().siblings(".display").show();
            }
        }
    });

    //sets button styles for input fields
    $('input:text, input:password, input[type=email]').button().addClass('textfield');
    $('#start').button();
    $('#stop').button();
    $("#stop").hide();

    SortingAnimation.prepareAnimation(bubble, "#bubble");
});
