/*
Template: Farmilk - Dairy Farm & Milk Html Template
Author: peacefulqode.co.in
Version: 1.1
Design and Developed by: Peacefulqode
NOTE: This is main javascript file of template.
*/
/*====================================
[  Table of contents  ]
======================================
==> Page Loader
==> Search Button
==> Sidebar Toggle
==> Sticky Header
==> Back To Top
======================================
[ End table content ]
======================================
*/

(function ($) {
    "use strict";
    $(window).on('load', function () {
        /*================================================
           Loader
        ================================================*/
        setTimeout(function () {
            var $preloader = $("#pq-loading");
            $preloader.addClass("hide");
            setTimeout(function () {
                $preloader.remove();
            }, 300);
        }, 300);

        /*================================================
          slick slider
        ================================================*/
        if ($('.slick-slider-main').length) {
            var $slider = $('.slick-slider-main').slick({
                slidesToShow: 1,
                infinite: false,
                arrows: true,
                autoplay: false,
                dots: false,
                lazyLoad: 'ondemand',
                autoplaySpeed: 3000,
                loop: true,
                asNavFor: '.slick-slider-thumb'
            });
            var $slider2 = $('.slick-slider-thumb').slick({
                slidesToShow: 3,
                infinite: false,
                lazyLoad: 'ondemand',
                asNavFor: '.slick-slider-main',
                autoplay: false,
                dots: false,
                Default: '50px',
                arrows: false,
                centerMode: false,
                loop: true,
                focusOnSelect: true
            });
        }

        /*================================================
         counter
        ================================================*/
        $(window).on('scroll', function () {
            $('.pq-counter').each(function () {
                var $this = $(this);
                var elementTop = $this.offset().top;
                var windowBottom =
                    $(window).scrollTop() + $(window).height();
                if (windowBottom > elementTop) {
                    if (!$this.hasClass('counted')) {
                        $this.addClass('counted');
                        $this.find('.pq-count').each(function () {
                            var $count = $(this);
                            var countTo = $count.attr('data-count');
                            /*
                             * Radix parameter added.
                             */
                            var Toduration = parseInt(
                                $count.attr('data-pq-duration'),
                                10
                            );
                            /*
                             * Fallback duration if data attribute
                             * is not a valid number.
                             */
                            if (isNaN(Toduration)) {
                                Toduration = 1000;
                            }
                            $({
                                countNum: 0
                            }).animate({
                                countNum: countTo
                            }, {
                                duration: Toduration,
                                easing: 'swing',
                                step: function () {
                                    $count.text(
                                        Math.floor(this.countNum)
                                    );
                                },
                                complete: function () {
                                    $count.text(this.countNum);
                                }
                            });

                        });
                    }
                }
            });
        });

        /*------------------------
             magnific-popup
        --------------------------*/
        // jQuery('.popup-youtube, .popup-video, .popup-gmaps').magnificPopup({
        //     disableOn: 700,
        //     type: 'iframe',
        //     mainClass: 'mfp-fade',
        //     removalDelay: 160,
        //     preloader: false,
        //     fixedContentPos: false
        // });
        $('.gallery').each(function () {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });

        /*================================================
        active hover
        ================================================*/
        $('.pq-hover-active').each(function () {
            var $container = $(this);
            $container
                .find('.pq-hover-item:nth-child(2)')
                .addClass("pq-active");
            $container
                .find('.pq-hover-item')
                .on('mouseenter', function () {
                    $container
                        .find('.pq-hover-item')
                        .removeClass('pq-active');
                    $(this).addClass('pq-active');
                });
        });

        /*================================================
        video popup
        ================================================*/
        /*
         * Removed unnecessary nested document.ready().
         * This code is already inside window load.
         */
        var $popupBtn = $('.pq-popup-animation');
        var $section = $('.pq-video-popup');
        if ($section.length && $popupBtn.length) {
            var mouseX = 0;
            var mouseY = 0;
            var btnX = 0;
            var btnY = 0;
            var speed = 0.1;
            $section.on('mousemove', function (e) {
                var offset = $(this).offset();
                mouseX = e.pageX - offset.left;
                mouseY = e.pageY - offset.top;
            });
            $section.on('mouseenter', function () {
                $(this).css('cursor', 'none');
                $popupBtn
                    .stop(true, true)
                    .fadeIn(150);
            });
            $section.on('mouseleave', function () {
                $(this).css('cursor', 'default');
                $popupBtn
                    .stop(true, true)
                    .fadeOut(150);
            });
            function animateButton() {
                btnX += (mouseX - btnX) * speed;
                btnY += (mouseY - btnY) * speed;
                $popupBtn.css({
                    left: btnX + 'px',
                    top: btnY + 'px'
                });
                requestAnimationFrame(animateButton);
            }
            animateButton();
        }

        /*================================================
        owl-carousel
        ================================================*/
        $('.owl-carousel').each(function () {
            var app_slider = $(this);
            var rtl = false;
            var prev = 'ti-angle-left';
            var next = 'ti-angle-right';
            if ($('body').hasClass('pq-is-rtl')) {
                rtl = true;
                prev = 'ti-angle-right';
                next = 'ti-angle-left';
            }
            app_slider.owlCarousel({
                rtl: rtl,
                items: app_slider.data("desk_num"),
                loop: app_slider.data("loop"),
                margin: app_slider.data("margin"),
                nav: app_slider.data("nav"),
                dots: app_slider.data("dots"),
                autoplay: app_slider.data("autoplay"),
                center: app_slider.data("center"),
                autoplayHoverPause: true,
                autoplayTimeout:
                    app_slider.data("autoplay-timeout"),
                navText: [
                    "<i class='" + prev + "'></i>",
                    "<i class='" + next + "'></i>"
                ],
                responsiveClass: true,
                responsive: {
                    0: {
                        items: app_slider.data("mob_sm"),
                        dots: false
                    },
                    480: {
                        items: app_slider.data("mob_num"),
                        dots: false
                    },
                    786: {
                        items: app_slider.data("tab_num")
                    },
                    1023: {
                        items: app_slider.data("lap_num")
                    },
                    1199: {
                        items: app_slider.data("desk_num")
                    }
                }
            });
            if (
                app_slider.data("mouse-scroll") === true ||
                app_slider.data("mouse-scroll") === "true"
            ) {
                function handleMouseScroll() {
                    var viewportWidth = window.innerWidth;
                    if (viewportWidth > 1679) {
                        if (!app_slider.data("wheel-enabled")) {
                            app_slider.on(
                                'wheel',
                                wheelHandler
                            );
                            app_slider.data(
                                "wheel-enabled",
                                true
                            );
                        }
                    } else {
                        if (app_slider.data("wheel-enabled")) {
                            app_slider.off(
                                'wheel',
                                wheelHandler
                            );
                            app_slider.data(
                                "wheel-enabled",
                                false
                            );
                        }
                    }
                }
                function wheelHandler(e) {
                    e.preventDefault();
                    if (e.originalEvent.deltaY > 0) {
                        app_slider.trigger(
                            'next.owl.carousel'
                        );
                    } else {
                        app_slider.trigger(
                            'prev.owl.carousel'
                        );
                    }
                }
                handleMouseScroll();
                $(window).on(
                    'resize',
                    handleMouseScroll
                );
            }
        });

        /*================================================
        accordian
        ================================================*/
        $(
            '.pq-accordion-block .pq-accordion-box .pq-accordion-details'
        ).hide();

        $(
            '.pq-accordion-block .pq-accordion-box:first'
        )
            .addClass('pq-active')
            .children()
            .slideDown('slow');
        $(
            '.pq-accordion-block .pq-accordion-box'
        ).on('click', function () {
            if (
                $(this)
                    .children('div.pq-accordion-details')
                    .is(':hidden')
            ) {
                $(
                    '.pq-accordion-block .pq-accordion-box'
                )
                    .removeClass('pq-active')
                    .children('div.pq-accordion-details')
                    .slideUp('slow');
                $(this)
                    .toggleClass('pq-active')
                    .children('div.pq-accordion-details')
                    .slideDown('slow');
            }
        });

        /*------------------------
             progressbar
        --------------------------*/
        /*
         * Removed unnecessary nested document.ready().
         */
        $(".sonny_progressbar").each(function () {
            var width = $(this).data("width");
            $(this)
                .find(".bar")
                .css("width", "0%")
                .animate({
                    width: width + "%"
                }, 2000);
        });

        /*------------------------
                    wow animation
        --------------------------*/
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }

        /*================================================
        isotope
        ================================================*/

        if ($('.pq-masonry').length) {
            $('.pq-masonry').isotope({
                itemSelector: '.pq-masonry-item',
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });
        }
        if (
            $('.pq-grid, .pq-job-list, .pq-job-grid').length
        ) {
            $(
                '.pq-grid, .pq-job-list, .pq-job-grid'
            ).isotope({
                itemSelector:
                    '.pq-grid-item, .pq-job-item, .pq-job-grid-item'
            });
        }

        /*================================================
        isotope filter
        ================================================*/
        $('.pq-filter-button-group').on(
            'click',
            '.pq-filter-btn',
            function () {
                var filterValue =
                    $(this).attr('data-filter');
                if ($('.pq-masonry').length) {
                    $('.pq-masonry').isotope({
                        filter: filterValue
                    });
                }
                if (
                    $('.pq-grid, .pq-job-list, .pq-job-grid').length
                ) {
                    $(
                        '.pq-grid, .pq-job-list, .pq-job-grid'
                    ).isotope({
                        filter: filterValue
                    });
                }
                $('.pq-filter-button-group .pq-filter-btn')
                    .removeClass('active');
                $(this).addClass('active');
                if ($('.pq-end-message').hasClass('visible')) {
                    $('.pq-end-message')
                        .removeClass('visible');
                }
                updateFilterCounts();
            }
        );

        /*================================================
        load more
        ================================================*/
        var initial_items = 5;
        var next_items = 3;
        if ($('.pq-masonry').length > 0) {
            initial_items =
                $('.pq-masonry')
                    .data('initial_items') ||
                initial_items;
            next_items =
                $('.pq-masonry')
                    .data('next_items') ||
                next_items;
        }
        if (
            $('.pq-grid, .pq-job-list, .pq-job-grid').length > 0
        ) {
            initial_items =
                $(
                    '.pq-grid, .pq-job-list, .pq-job-grid'
                ).data('initial_items') ||
                initial_items;
            next_items =
                $(
                    '.pq-grid, .pq-job-list, .pq-job-grid'
                ).data('next_items') ||
                next_items;
        }

        /*================================================
        Show More Items
        ================================================*/
        function showNextItems(pagination) {
            var itemsMax =
                $('.visible_item').length;
            var itemsCount = 0;
            $('.visible_item').each(function () {
                if (itemsCount < pagination) {
                    $(this)
                        .removeClass('visible_item');
                    itemsCount++;
                }
            });
            if (itemsCount >= itemsMax) {
                $('#showMore').hide();
                $('.pq-end-meassge')
                    .addClass('visible');
            }
            $(
                '.pq-masonry, .pq-grid, .pq-job-list, .pq-job-grid'
            ).isotope('layout');
        }

        /*================================================
        Hide Items
        ================================================*/
        function hideItems(pagination) {
            var itemsMax =
                $('.pq-filter-items').length;
            var itemsCount = 0;
            $('.pq-filter-items').each(function () {
                if (itemsCount >= pagination) {
                    $(this)
                        .addClass('visible_item');
                }
                itemsCount++;
            });
            if (
                itemsCount < itemsMax ||
                initial_items >= itemsMax
            ) {
                $('#showMore').hide();
            }
            $(
                '.pq-masonry, .pq-grid, .pq-job-list, .pq-job-grid'
            ).isotope('layout');
        }

        /*================================================
        Update Filtered Items Count
        ================================================*/
        function updateFilterCounts() {
            var itemElems = [];
            if ($('.pq-masonry').length > 0) {
                itemElems =
                    $('.pq-masonry')
                        .isotope(
                            'getFilteredItemElements'
                        );
            }
            if (
                $('.pq-grid, .pq-job-list, .pq-job-grid').length > 0
            ) {
                itemElems =
                    $(
                        '.pq-grid, .pq-job-list, .pq-job-grid'
                    ).isotope(
                        'getFilteredItemElements'
                    );
            }
            var count_items =
                $(itemElems).length;
            if (count_items > initial_items) {
                $('#showMore').show();
            } else {
                $('#showMore').hide();
            }
            $('.pq-filter-items')
                .removeClass('visible_item');
            var index = 0;
            $(itemElems).each(function () {
                if (index >= initial_items) {
                    $(this)
                        .addClass('visible_item');
                }
                index++;
            });
            $(
                '.pq-masonry, .pq-grid, .pq-job-list, .pq-job-grid'
            ).isotope('layout');
        }

        /*================================================
        Click To Load
        ================================================*/
        if ($('.click_to_load').length > 0) {
            $('#showMore').on(
                'click',
                function (e) {
                    e.preventDefault();
                    var $loader =
                        $('#pq-loaderIcon');
                    $loader.show();
                    setTimeout(function () {
                        showNextItems(next_items);
                        $loader.hide();
                    }, 1500);
                }
            );

            /*================================================
            Scroll To Load
            ================================================*/
        } else if ($('.scroll_to_load').length > 0) {
            var scrolling = false;
            $(window).on(
                'scroll',
                function () {
                    if (!scrolling) {
                        scrolling = true;
                        var scrollPosition =
                            $(window).scrollTop() +
                            $(window).height();
                        var seventyFivePercent =
                            $(document).height() * 0.75;
                        if (
                            scrollPosition >=
                            seventyFivePercent
                        ) {
                            var remainingItems =
                                $('.visible_item').length;
                            if (remainingItems > 0) {
                                var $loader =
                                    $('#pq-loaderIcon');
                                $loader.show();
                                setTimeout(function () {
                                    showNextItems(next_items);
                                    $loader.hide();
                                    if (
                                        $('.visible_item').length === 0
                                    ) {
                                        $('.end_message').show();
                                    }
                                    scrolling = false;
                                }, 2000);
                            } else {
                                $('.end_message').show();
                                scrolling = false;
                            }
                        } else {
                            scrolling = false;
                        }
                    }
                }
            );
        }
        // Hide items initially
        hideItems(initial_items);

        /*================================================
        back to top
        ================================================*/
        var progressPath =
            document.querySelector(
                '.progress-wrap path'
            );
        /*
         * Safety check:
         * Prevent JS error if progress path does not exist.
         */
        if (progressPath) {
            var pathLength =
                progressPath.getTotalLength();
            progressPath.style.transition = 'none';
            progressPath.style.strokeDasharray =
                pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset =
                pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition =
                'stroke-dashoffset 10ms linear';
            var updateProgress = function () {
                var scroll =
                    $(window).scrollTop();
                var height =
                    $(document).height() -
                    $(window).height();
                if (height > 0) {
                    var progress =
                        pathLength -
                        (
                            scroll *
                            pathLength /
                            height
                        );
                    progressPath.style.strokeDashoffset =
                        progress;
                }
            };
            updateProgress();
            $(window).on(
                'scroll',
                updateProgress
            );
        }
        var offset = 50;
        var duration = 550;
        $(document).on(
            'scroll',
            function () {
                if (
                    $(this).scrollTop() > offset
                ) {
                    $('.progress-wrap')
                        .addClass(
                            'active-progress'
                        );
                } else {
                    $('.progress-wrap')
                        .removeClass(
                            'active-progress'
                        );
                }
            }
        );
        $(document).on(
            'click',
            '.progress-wrap',
            function (event) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: 0
                }, duration);
                return false;
            }
        );
    });
})(jQuery);