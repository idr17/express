$(document).ready(function(){
	$(".kino-header-slider").slick({
		autoplaySpeed:8000,
		infinite: true,
		arrows:false,
		slidesToShow: 1,
		dots:true,
		appendDots:".kino-header-slider-pagination",
	});
	
	$("#click-more").on("click", function (e) {
		$('#click-more').toggleClass('active');
		$('#list-channel').css("display") == "none" ? $('#list-channel').css("display", "block") : setTimeout(function () {
					$('#list-channel').css("display", "none");
				}, 500);
	});
});