(function ($) {
	'use strict';

	var transition = window.mt.transition;

	function _move($elem, options, callback) {
		if ($elem.data('status') === 'moving') return;

		var left = parseInt($elem.css('left')),
			top = parseInt($elem.css('top')),
			x = (options.x !== undefined) ? options.x : left,
			y = (options.y !== undefined) ? options.y : top;
		if ((left === x) && (top === y)) return;

		$elem.data('status', 'moving').trigger('move');
		callback();
	}

	var silent = {
		init: function ($elem) {
			$elem.removeClass('transition');
		},
		to: function ($elem, options) {
			silent._move($elem, options);
		},
		x: function ($elem, x) {
			silent._move($elem, {
				'x': x
			});
		},
		y: function ($elem, y) {
			silent._move($elem, {
				'y': y
			});
		}
	};
	silent._move = function ($elem, options) {
		_move($elem, options, function () {
			$elem.css({
				top: options.y,
				left: options.x
			});
			$elem.data('status', 'moved').trigger('moved');
		});
	};

	var css3 = {
		init: function ($elem, options) {
			$elem.addClass('transition');
			$elem.css({
				top: $elem.css('top'),
				left: $elem.css('left'),
				'transition-duration': options.speed + 's',
				'transition-timing-function': options.easing
			});
		},
		to: function ($elem, options) {
			css3._move($elem, options);
		},
		x: function ($elem, x) {
			css3._move($elem, {
				'x': x
			});
		},
		y: function ($elem, y) {
			css3._move($elem, {
				'y': y
			});
		}
	};
	css3._move = function ($elem, options) {
		_move($elem, options, function () {
			$elem.css({
				top: options.y,
				left: options.x
			});
			$elem.one(transition.end, function () {
				$elem.data('status', 'moved').trigger('moved');
			});
		});
	};

	var js = {
		init: function ($elem) {
			$elem.removeClass('transition');
		},
		to: function ($elem, options) {
			js._move($elem, options);
		},
		x: function ($elem, x) {
			js._move($elem, {
				'x': x
			});
		},
		y: function ($elem, y) {
			js._move($elem, {
				'y': y
			});
		}
	};
	js._move = function ($elem, options) {
		_move($elem, options, function () {
			$elem.animate({
				top: options.y,
				left: options.x
			}, function () {
				$elem.data('status', 'moved').trigger('moved');
			});
		});
	};

	var defaults = {
		css3: false,
		js: false,
		speed: 1,
		easing: 'swing'
	};
	var move = function (elem, options) {
		var $elem = $(elem),
			mode = null;

		options = $.extend({}, defaults, options);

		if (options.css3 && transition.isSupport) { // css3 transition
			mode = css3;
			mode.text = 'css3';
		} else if (options.js) { // js animation
			mode = js;
			mode.text = 'js';
		} else { // no animation
			mode = silent;
			mode.text = 'silent';
		}

		mode.init($elem, options);
		return {
			mode: mode.text,
			init: $.proxy(mode.init, this, $elem, options),
			to: $.proxy(mode.to, this, $elem),
			x: $.proxy(mode.x, this, $elem),
			y: $.proxy(mode.y, this, $elem)
		};
	};

	window.mt = window.mt || {};
	window.mt.move = function (elem, options) {
		var $elem = $(elem),
			data = $elem.data('move');

		if (!data) { // first time
			$elem.data('move', (data = move($elem, options)));
		}

		return data;
	};
})(jQuery);
