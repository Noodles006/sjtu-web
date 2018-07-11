(function ($) {
	'use strict';

	var transition = window.mt.transition;

	var Carousel = function (elem, options) {
		this.$elem = $(elem);
		this.options = options;

		this.$items = this.$elem.find('.carousel-item');
		this.$indicators = this.$elem.find('.carousel-indicator');
		this.$controls = this.$elem.find('.carousel-control');

		this.itemNum = this.$items.length;
		this.itemWidth = this.$items.eq(0).width();

		this.curIndex = this._getCorrectIndex(this.options.activeIndex);
		this.moves = [];

		this._init();
	};
	Carousel.DEFAULTS = {
		css3: false,
		js: false,
		animation: 'fade', // fade slide
		interval: 0,
		activeIndex: 0
	};
	Carousel.prototype._init = function() {
		var self = this;

		// init
		this.$indicators.removeClass('carousel-indicator-active');
		this.$indicators.eq(this.curIndex).addClass('carousel-indicator-active');

		// to
		if (this.options.animation === 'fade') {
			this.$elem.addClass('carousel-fade');
			this.$items.eq(this.curIndex).show();
			showHide();
			Carousel.prototype.to = this._fade;
		} else { // slide
			this.$elem.addClass('carousel-slide');
			this.$items.eq(this.curIndex).css('left', 0);
			setTimeout(function () {
				move();
			}, 20);
			Carousel.prototype.to = this._slide;
		}

		// bind event
		this.$elem.on('click', '.carousel-indicator', function () {
			self.to(self.$indicators.index($(this)));
		}).on('click', '.carousel-control-left', function () {
			self.to(self._getCorrectIndex(self.curIndex - 1), -1);
		}).on('click', '.carousel-control-right', function () {
			self.to(self._getCorrectIndex(self.curIndex + 1), 1);
		}).hover(function () {
			self.$controls.stop().fadeIn();
		}, function () {
			self.$controls.stop().fadeOut();
		});



		if (this.options.interval && !isNaN(Number(this.options.interval))) {
			this.$elem.hover($.proxy(this.pause, this), $.proxy(this.auto, this));
			this.auto();
		}

		// showHide
		function showHide() {
			self.$items.on('show shown hide hidden', function (e) {
				var $this = $(this);

				// if (e.type === 'shown') {
				// 	self.$elem.data('status', 'faded');
				// }
				self.$elem.trigger('carousel-' + e.type, [e.type, self.$items.index($this), $this]);
			});

			self.$items.showHide(self.options);
		}
		// move
		function move() {
			self.$items.each(function (i, item) {
				var $this = $(this),
					type = '';

				$this.on('move moved', function (e) {
					if (e.type === 'moved') {
						// self.$elem.data('status', 'slided');
						if ($this.data('state') === 'in') {
							type = 'shown';
						} else {
							type = 'hidden';
						}
					} else { // move
						if ($this.data('state') === 'in') {
							type = 'show';
						} else {
							type = 'hide';
						}
					}
					self.$elem.trigger('carousel-' + type, [type, i, $this]);
				});

				self.moves[i] = window.mt.move($this, self.options);
			});
		}
	};
	Carousel.prototype.auto = function() {
		if (!this.options.interval) return;
		if (isNaN(Number(this.options.interval))) return;

		var self = this;

		this.intervalId = setInterval(function () {
			self.to(self._getCorrectIndex(self.curIndex + 1), 1);
		}, this.options.interval);
	};
	Carousel.prototype.pause = function() {
		clearInterval(this.intervalId);
	};
	Carousel.prototype._fade = function(index) {
		if (this.curIndex === index) return;
		// if (this.$elem.data('status') === 'fading') return;

		// this.$elem.data('status', 'fading');

		this._setIndicator(index);

		this.$items.eq(this.curIndex).showHide('hide');
		this.$items.eq(index).showHide('show');

		this.curIndex = index;
	};
	Carousel.prototype._slide = function(index, direction) {
		if (this.curIndex === index) return;
		// if (this.$elem.data('status') === 'sliding') return;

		// this.$elem.data('status', 'sliding');
		this.$items.eq(this.curIndex).data('state', 'out');
		this.$items.eq(index).removeClass('transition').data('state', 'in');

		var self = this;

		this._setIndicator(index);

		if (direction === undefined) {
			if (this.curIndex < index) { // →
				direction = 1;
			} else { // ←
				direction = -1;
			}
		}
		
		this.$items.eq(index).css('left', direction * this.itemWidth);
		
		setTimeout(function () {
			if (self.moves[index].mode === 'css3') {
				self.$items.eq(index).addClass('transition');
			}
			self.moves[self.curIndex].x(-1 * direction * self.itemWidth);
			self.moves[index].x(0);

			self.curIndex = index;
		}, 20);
	};
	Carousel.prototype._getCorrectIndex = function(index) {
		if (isNaN(Number(index))) return 0;
		if (index < 0) return this.itemNum - 1;
		if (index > this.itemNum - 1) return 0;
		return index;
	};
	Carousel.prototype._setIndicator = function(index) {
		this.$indicators.eq(this.curIndex).removeClass('carousel-indicator-active');
		this.$indicators.eq(index).addClass('carousel-indicator-active');
	};
	

	function init(option) {
		return this.each(function () {
			var $this = $(this),
				options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option === 'object' && option),
				data = $this.data('carousel');
			if (!data) { // first time
				$this.data('carousel', (data = new Carousel($this, options)));
			}
			if (typeof data[option] === 'function') {
				data[option]();
			}
		});
	}

	$.fn.extend({
		carousel: init
	});
})(jQuery);