(function (window, document, exportName, undefined) {
    'use strict';
    var version = '0.0.1';
    var animationend = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    var transitionend = 'webkitTransitionEnd msTransitionEnd MSTransitionEnd oTransitionEnd transitionend';
    var interactiveElements = 'input, select, textarea, button, a, area';
    var DIRECTION = { HORIZONTAL: 'horizontal', VERTICAL: 'vertical' };
    function Rumble(container, opts) {
        var that = this;
        that.setting = {
            direction: 'vertical',
            slidesPerView: 1,
            initSlideIndex: 0,
            loop: false,
            threshold: 50,
            disabled: false
        };

        $.extend(that.setting, opts || {});

        that.container = $(container);

        if (that.container.length != 1) {
            console.error('The container is error.');
            return;
        }
        that.wrapper = that.container.children('.rumble-wrapper:first');
        that.sliding = false;
        that.timeout = [];
        that.disabled = that.setting.disabled;
        that.length = that.wrapper.children('.slide').length;
        that.flag = Math.random().toString(36).replace(/\D/, '');

        var cache = {},
            direction = that.setting.direction,
            threshold = that.setting.threshold,
            delegator = that.container;

        delegator.on('touchstart mousedown', start);
        delegator.on('touchend mouseup', end);

        that.init();

        function start(event) {
            event = event.originalEvent;

            if (!$(event.target).is(interactiveElements) && ($(event.target).parents(interactiveElements).length === 0)) {
                event.preventDefault();
            }
            cache.startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
            cache.startY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
        }

        function end(event) {
            event = event.originalEvent;
            //event.preventDefault();            
            //event.stopPropagation();

            cache.endX = event.type === 'touchend' ? event.changedTouches[0].clientX : event.clientX;
            cache.endY = event.type === 'touchend' ? event.changedTouches[0].clientY : event.clientY;

            //if (!that.sliding) {                
            if (direction === DIRECTION.VERTICAL) {

                if (Math.abs(cache.endY - cache.startY) > threshold) {

                    if (typeof that.setting.onSwipeEnd === 'function') {
                        that.setting.onSwipeEnd(event);
                    }
                    if (cache.endY > cache.startY) {
                        that.previous();
                    } else {
                        that.next();
                    }
                }
            } else if (direction === DIRECTION.HORIZONTAL) {
                if (Math.abs(cache.endX - cache.startX) > threshold) {
                    if (typeof that.setting.onSwipeEnd === 'function') {
                        that.setting.onSwipeEnd(event);
                    }
                    if (cache.endX > cache.startX) {
                        that.previous();
                    } else {
                        that.next();
                    }
                }
            }
            //}
        }

    }
    Rumble.prototype = {

        init: function () {
            var that = this,
                container = that.container,
                wrapper = that.wrapper,
                direction = that.setting.direction,
                initSlideIndex = that.setting.initSlideIndex,
                slidesPerView = that.setting.slidesPerView,
                viewIndex = Math.floor(initSlideIndex / slidesPerView);
            container.removeClass('cloak');
            if (direction === DIRECTION.HORIZONTAL) {
                container.addClass(DIRECTION.HORIZONTAL);
            } else if (direction === DIRECTION.VERTICAL) {
                container.addClass(DIRECTION.VERTICAL);
            }
            wrapper.children('.slide').find('.animated').addClass('cloak').attr('data-flag', that.flag);
            wrapper.children('.slide').each(function (i) {
                $(this).attr('data-original-sequence', i);
            });
            //wrapper.children('.slide:eq(' + initSlideIndex + ')').addClass('active');            
            var slideIndexsInView = that.getSlideIndexsInView(viewIndex),
                j = slideIndexsInView.length - 1;
            for (; j > -1; j--) {
                wrapper.children('.slide[data-original-sequence="' + (slideIndexsInView[j]) + '"]').addClass('active');
            }

            that.act();

        },
        next: function () {
            var that = this,
                wrapper = that.wrapper,
                slidesPerView = that.setting.slidesPerView,
                to = Number(wrapper.children('.slide.active').attr('data-original-sequence')) + slidesPerView;
            that.go(to, 1);
        },
        previous: function () {
            var that = this,
                wrapper = that.wrapper,
                slidesPerView = that.setting.slidesPerView,
                to = Number(wrapper.children('.slide.active').attr('data-original-sequence')) - slidesPerView;
            that.go(to, -1);
        },
        act: function () {
            var that = this,
                wrapper = that.wrapper;
            wrapper.children('.slide.active').find('.animated[data-flag="' + that.flag + '"]').each(function (i) {
                var target = this;
                var duration = Number($(target).attr('data-animation-duration')),
                    animation = $(target).attr('data-animation'),
                    delay = Number($(target).attr('data-animation-delay'));
                if (!isNaN(duration)) {
                    $(target).css({ animationDuration: duration + 'ms' });
                }
                $(target).css({ animationDelay: (isNaN(delay) ? 300 * i : delay) + 'ms' });

                $(target).removeClass('cloak').addClass(animation);
            });
        },
        locate: function () {
            var that = this,
                wrapper = that.wrapper,
                direction = that.setting.direction,
                matrix;
            if (direction === DIRECTION.HORIZONTAL) {
                matrix = 'matrix(1,0,0,1,' + (-wrapper.children('.slide.active').position().left) + ',0)';
            } else if (direction === DIRECTION.VERTICAL) {
                matrix = 'matrix(1,0,0,1,0,' + (-wrapper.children('.slide.active').position().top) + ')';
            }
            wrapper.css({ transform: matrix, webkitTransform: matrix });
        },
        go: function (to, way) {
            var that = this;
            way = way || 1;
            if (!that.sliding && !that.disabled) {
                var wrapper = that.wrapper,
                    index = Number(wrapper.children('.slide.active').attr('data-original-sequence')),
                    length = that.length,
                    loop = that.setting.loop,
                    slidesPerView = that.setting.slidesPerView,
                    slideIndexsInToView,
                    slideIndexsInView,
                    matrix,
                    direction = that.setting.direction,
                    i = 0,
                    j;


                if (loop) {
                    if (to > length - 1) {
                        to -= length;
                    } else if (to < 0) {
                        to += length;
                    }
                } else {
                    if (way === 1) {
                        to = to > length - 1 ? length - 1 : to;
                    } else if (way === -1) {
                        to = to < 0 ? 0 : to;
                    }
                }

                slideIndexsInToView = that.getSlideIndexsInView(to, way);

                if (loop) {
                    for (j = slideIndexsInToView.length - 1; j > -1; j--) {
                        if (way === 1) {
                            wrapper.children('.slide.active:last').after(wrapper.children('.slide[data-original-sequence="' + slideIndexsInToView[j] + '"]'));
                        } else if (way === -1) {
                            wrapper.children('.slide.active:first').before(wrapper.children('.slide[data-original-sequence="' + slideIndexsInToView[j] + '"]'));
                        }
                    }
                    that.locate();
                }

                //index 当前的slide
                //to 即将滑动到的slide
                if (slideIndexsInToView.indexOf(index) === -1) {
                    that.sliding = true;

                    if (direction === DIRECTION.HORIZONTAL) {
                        matrix = 'matrix(1,0,0,1,' + (-(wrapper.children('.slide[data-original-sequence="' + slideIndexsInToView[way === 1 ? 0 : slideIndexsInToView.length - 1] + '"]').position().left)) + ',0)';
                    } else if (direction === DIRECTION.VERTICAL) {
                        matrix = 'matrix(1,0,0,1,0,' + (-(wrapper.children('.slide[data-original-sequence="' + slideIndexsInToView[way === 1 ? 0 : slideIndexsInToView.length - 1] + '"]').position().top)) + ')';
                    }
                    //wrapper.children('.slide:eq(' + to + ')').addClass('entering');
                    var j = slideIndexsInToView.length - 1;
                    for (; j > -1; j--) {
                        wrapper.children('.slide[data-original-sequence="' + (slideIndexsInToView[j]) + '"]').addClass('entering');
                    }

                    wrapper.children('.slide.active').addClass('leaving');

                    //开始每个slide内的动画前，增加cloak样式隐藏每个animated
                    //去除animation（上次的animation可能没有结束，所以animation还在，重新开始前移除掉）
                    wrapper.children('.slide.entering').find('.animated[data-flag="' + that.flag + '"]').each(function () {
                        $(this).addClass('cloak').removeClass($(this).attr('data-animation'));
                    });
                    wrapper.addClass('alive').css({ transform: matrix, webkitTransform: matrix }).one(transitionend, function (event) {
                        //阻止transitionend冒泡<div id="x" class="slide"><div class="rumble"><div id="y" class="slide"></div></div></div>
                        //否则x也会监听到y的transitionend事件

                        event.originalEvent.stopPropagation();

                        wrapper.removeClass('alive');
                        wrapper.children('.slide').removeClass('leaving').removeClass('active');
                        wrapper.children('.slide.entering').removeClass('entering').addClass('active');

                        that.locate();
                        that.act();

                        if (typeof that.setting.onSlideEnd === 'function') {
                            that.setting.onSlideEnd();
                        }

                        that.sliding = false;
                    });

                    if (typeof that.setting.onSlideStart === 'function') {
                        that.setting.onSlideStart();
                    }
                }

            }
        },
        slideTo: function (i) {
            var that = this,
                wrapper = that.wrapper;
            that.go(i);
        },
        getActiveSlideIndexs: function () {
            var that = this,
                indexs = [];
            that.wrapper.children('.slide.active').each(function (i) {
                indexs.push(Number($(this).attr('data-original-sequence')));
            });
            return indexs;
        },
        getSlideIndexsInView: function (index, way) {
            way = way || 1;
            var that = this,
                i = 0,
                j,
                length = that.length,
                slidesPerView = that.setting.slidesPerView,
                loop = that.setting.loop,
                indexs = [];

            if (loop) {
                //循环的情况下，每个view必须有slidesPerView个数量的slide
                j = slidesPerView;
                var x;
                for (; i < j; i++) {

                    x = index + i;
                    if (x > length - 1) {
                        x -= length;
                    } else if (x < 0) {
                        x += length;
                    }
                    indexs.push(x);
                }
                if (way === -1) {
                    indexs = indexs.reverse();
                }
            } else {
                j = length;
                for (; i < j; i++) {
                    if (Math.floor(i / slidesPerView) === Math.floor(index / slidesPerView)) {
                        indexs.push(i);
                    }
                }
            }
            return indexs;
        },
        clearAnimationTimeout: function () {
            var that = this,
                timeout = that.timeout;
            var j = timeout.length;
            for (; j > -1; j--) {
                clearTimeout(timeout[j]);
            }
            timeout.length = 0;
        }
    };
    window[exportName] = Rumble;
})(window, document, 'Rumble');