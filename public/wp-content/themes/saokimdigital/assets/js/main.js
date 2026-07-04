jQuery(function ($) {

    const menuItem = $('.menu-company');
    const megaMenu = $('.mega-menu-cat-content');

    let hideTimer;


    menuItem.on('mouseenter', function () {
        clearTimeout(hideTimer);

        megaMenu.addClass('active');
    });


    menuItem.on('mouseleave', function () {

        hideTimer = setTimeout(function () {

            if (!megaMenu.is(':hover')) {
                megaMenu.removeClass('active');
            }

        }, 150);

    });


    megaMenu.on('mouseenter', function () {

        clearTimeout(hideTimer);

        megaMenu.addClass('active');

    });


    megaMenu.on('mouseleave', function () {

        megaMenu.removeClass('active');

    });

});

jQuery(function ($) {

    const menuItem = $('.menu-product');
    const megaMenu = $('.mega-menu-product-content');

    let hideTimer;


    menuItem.on('mouseenter', function () {
        clearTimeout(hideTimer);

        megaMenu.addClass('active');
    });


    menuItem.on('mouseleave', function () {

        hideTimer = setTimeout(function () {

            if (!megaMenu.is(':hover')) {
                megaMenu.removeClass('active');
            }

        }, 150);

    });


    megaMenu.on('mouseenter', function () {

        clearTimeout(hideTimer);

        megaMenu.addClass('active');

    });


    megaMenu.on('mouseleave', function () {

        megaMenu.removeClass('active');

    });

});


// Letron progress-wrap logic has been migrated to React ScrollToTop component




jQuery(function ($) {


    new Swiper('.letron-sp-slider', {

        loop: true,
        centeredSlides: true,

        slidesPerView: 1.2,
        spaceBetween: 20,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.letron-next',
            prevEl: '.letron-prev',
        },

        breakpoints: {

            768: {
                slidesPerView: 2.2,
            },

            1024: {
                slidesPerView: 3.6,
                spaceBetween: 24,
            }

        }

    });




    new Swiper(".customer-review-slider", {
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 20,
        speed: 800,
        grabCursor: true,

        navigation: {
            nextEl: ".review-next",
            prevEl: ".review-prev",
        },

        breakpoints: {
            767: {
                spaceBetween: 80
            },
            967: {
                spaceBetween: 100
            },
            1550: {
                spaceBetween: 129
            }
        }

    });

});

jQuery(function ($) {


    if ($(window).width() > 768) {

        $('.group-cop-info').hover(
            function () {
                $(this).find('.box-sub-home')
                    .stop(true, true)
                    .fadeIn(200);
            },
            function () {
                $(this).find('.box-sub-home')
                    .stop(true, true)
                    .fadeOut(200);
            }
        );

    }


    $('.group-cop-info').on('click', function (e) {

        if ($(window).width() <= 768) {

            e.stopPropagation();

            $('.box-sub-home').not($(this).find('.box-sub-home'))
                .fadeOut(200);

            $(this).find('.box-sub-home')
                .stop(true, true)
                .fadeToggle(200);
        }

    });


    $(document).on('click', function () {

        if ($(window).width() <= 768) {

            $('.box-sub-home')
                .stop(true, true)
                .fadeOut(200);

        }

    });

});
jQuery(document).ready(function ($) {



    function doLogoMarqueeToLeft() {

        if (!$('.logo_carousel_trackToLeft').length) {

            return;

        }



        const marquee = document.querySelector(".logo_carousel_trackToLeft");

        const speed = 0.8; // Scrolling Speed

        let scrollAmount = 0;

        let isHovered = false;



        // Duplicates the content

        const marqueeContent = marquee.innerHTML;

        marquee.innerHTML += marqueeContent;



        const startScrolling = () => {

            if (!isHovered) {

                scrollAmount -= speed;

                if (Math.abs(scrollAmount) >= marquee.scrollWidth / 2) {

                    scrollAmount = 0;

                }

                marquee.style.transform = `translateX(${scrollAmount}px)`;

            }

            requestAnimationFrame(startScrolling);

        };



        marquee.addEventListener("mouseover", () => {

            isHovered = true;

        });



        marquee.addEventListener("mouseout", () => {

            isHovered = false;

        });



        startScrolling();

    }



    function doLogoMarqueeToRight() {

        if (!$('.logo_carousel_trackToRight').length) {

            return;

        }



        const marquee2 = document.querySelector(".logo_carousel_trackToRight");

        //let scrollAmount = 0;

        let scrollAmount = marquee2.scrollWidth / 2 * -1;

        let isHovered = false;



        // Duplicates the content

        const marqueeContent2 = marquee2.innerHTML;

        marquee2.innerHTML += marqueeContent2;



        const startScrolling2 = () => {

            if (!isHovered) {

                scrollAmount += 0.8;

                //if (scrollAmount >= marquee2.scrollWidth / 2) {

                //    scrollAmount = 0;

                //}



                // Khi về vị trí 0 thì reset lại vị trí âm ban đầu

                if (scrollAmount >= 0) {

                    scrollAmount = marquee2.scrollWidth / 2 * -1;

                }

                marquee2.style.transform = `translateX(${scrollAmount}px)`;

            }

            requestAnimationFrame(startScrolling2);

        };



        marquee2.addEventListener("mouseover", () => {

            isHovered = true;

        });



        marquee2.addEventListener("mouseout", () => {

            isHovered = false;

        });



        startScrolling2();

    }



    doLogoMarqueeToLeft();

    doLogoMarqueeToRight();











    $('.job-closed').each(function () {

        var value = $(this).text().trim();



        if (value === "1") {

            $(this).text("CLOSED").show();

        } else {

            $(this).hide();

        }

    });



    if ($('.my_cv_btn').length) {



        $('.my_cv_btn').on('click', function (e) {



            e.preventDefault();



            $('.form_apply_job .elementor-upload-field[type="file"]').click();



        });







        $('.form_apply_job .elementor-upload-field[type="file"]').on('change', function (e) {



            var filename = $(this).val().replace(/C:\\fakepath\\/i, '');



            if (filename == '') {



                $('.my_file_cv_name').html('Không có tệp nào được chọn');



            } else {



                $('.my_file_cv_name').html(filename);



            }



        });



    };

});
