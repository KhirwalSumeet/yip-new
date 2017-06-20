var Navbar = {};

Navbar.navigationClassToggle = function() {
    var initialPos = $('.navbar').position().top;
    $(window).scroll(function(){ 
        if($(window).scrollTop() > initialPos) {
            $('#nav_bar').addClass('navbar-fixed-top');
            $("#abC").css({"margin-top":"80px"});
        } else {
            $('#nav_bar').removeClass('navbar-fixed-top');
            $("#abC").css({"margin-top":"0"});
        }
    });
}

Navbar.tooltipToogle = function() {
    $('[data-toggle="tooltip"]').tooltip(); 
    $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function(){
                window.location.hash = hash;
            });
        }
    });
}

$(document).ready(function(){
    Navbar.navigationClassToggle();
    Navbar.tooltipToogle();
});