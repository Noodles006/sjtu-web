(function ($) {
	'use strict';

	// $('.dropdown').dropdown({
	// 	event: 'hover',
	// 	css3: true,
	// 	js: true,
	// 	animation: 'slideUpDown',
	// 	delay: 0
	// });

	// banner-carousel
	$('#banner-carousel').carousel({
		css3: true,
		js: true,
		animation: 'fade', // fade slide
		interval: 3000,
		activeIndex: 0
	});

	// 倒计时
	(function ($) {
		'use strict';
	
		var deadline = new Date('2017/6/23').getTime();
		var curTime = new Date().getTime();
		var span = (deadline - curTime) / 1000;

		$('#countdown-time').html(Math.ceil(span / (24 * 60 * 60)));
	})(jQuery);

	// news
	// (function ($) {
	// 	'use strict';
	
	// 	var $newsContent = $('#main-news-content');
	// 	var contentHeight = $('#main-news-content').height() / 2;
	// 	var top = 0;
	// 	var speed = 0.2;
	// 	var timer = null;

	// 	$newsContent.hover(function () {
	// 		clearTimeout(timer);
	// 	}, function () {
	// 		moveNews();
	// 	});
	// 	moveNews();

	// 	function moveNews() {
	// 		top += speed;
	// 		if (top >= contentHeight) {
	// 			top = 0;
	// 			$newsContent.css('top', top);
	// 		} else {
	// 			$newsContent.css('top', -1 * top);
	// 		}
	// 		timer = setTimeout(moveNews, 13);
	// 	}
	// })(jQuery);

	// photos-carousel
	(function ($) {
		'use strict';
	
		var $photosCarousel = $('#photos-carousel');
		var $photosContainer = $photosCarousel.find('.carousel-container');
		var $photosItems = $photosCarousel.find('.carousel-item');
		var photosWidth = 0;
		var left = 0;
		var speed = 1;
		var timer = null;

		$photosItems.each(function (i) {
			photosWidth += $photosItems.eq(i).width() + 5;
		});
		$photosContainer.append($photosContainer.html());

		$photosCarousel.hover(function () {
			clearTimeout(timer);
		}, function () {
			moveCarousel();
		});
		moveCarousel();

		function moveCarousel() {
			left += speed;
			if (left >= photosWidth) {
				left = 0;
				$photosContainer.css('left', left);
			} else {
				$photosContainer.css('left', -1 * left);
			}
			timer = setTimeout(moveCarousel, 13);
		}
	})(jQuery);

})(jQuery);
