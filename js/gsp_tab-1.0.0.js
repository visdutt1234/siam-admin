/**
 * Tab/Accordion Plugin
 * @desc Builds Tabbing and accordions.
 * @package Girnar Soft OneJs
 * @author Vineet Kumar <vineet.vaishnav@girnarsoft.com>
 * @version 1.0.0
 * @created May 10, 2016
 *
 * Depends:
 *    jQuery
 */
(function ($, window) {
    "use strict";
    var $window = $(window),
        defaults = {
            layout: 'auto',     // auto|tab|accordion
            responsive: false,  // true | false
            defaultOpen: 1,   // Index of default open tab
            breakpoint: 767     // Breakpoint to convert into accordion
        },
        layout = '',
        tabs = {
            _init: function ($tabWrap, options) {
                options = $.extend(defaults, options);
                $tabWrap.each(function () {
                    var $tEle = $(this),
                        $tabs = $(),
                        $allTabs = $(),
                        $clones = $(),
                        tabWidth = 0,
                        tabName = $tEle.data('gstab-wrap') || options.tabName || '',
                        $contEle = $('*[data-gstab-container-wrap="' + tabName + '"]'),
                        $contChildren = $contEle.find('> *[data-gstab-container]'),
                        $clone = $(),
                        tabAttr = 'data-gstab',
                        isRes = options.layout == "auto" ? options.responsive : false;
                    options.responsive ? $tEle.hide() : $tEle.wrap('<div class="gsc-ta-overHide"><div class="gsc_ta_scroll"></div></div>');
                    $tEle.find('*[' + tabAttr + ']').each(function (i) {
                        var $e = $(this),
                            $assocCont = $contChildren.eq(i);

                        //Pushing tabs into array//
                        $tabs.push(this);
                        $allTabs.push(this);

                        //If tab is not responsive then calculate width for tab container for swiping effect//
                        if (!isRes) {
                            tabWidth += $e.outerWidth(true) + 1;
                        }

                        //Adding active class to the default open tab on page load//
                        if (i == options.defaultOpen - 1) {
                            $e.addClass('gsc-ta-active');
                        }

                        //Restructure tabs for responsiveness//
                        if (options.layout == 'accordion' || options.responsive) {
                            $clone = $e.clone().insertBefore($assocCont, null).wrap('<ul data-gsta-responsivetab style="display:none;"></ul>')[0];
                            $clone.className+=' gsc-ta-clone';
                            //$allTabs will contain the original tab elements as well as their clones//
                            $allTabs.push($clone);

                            //$clones will contain all the cloned elements//
                            $clones.push($clone);
                        }
                        //binding click event on tabs//
                        $e.add($clone).click(function () {
                            var $t = $(this);

                            //Preventing activated tab to be activated again//
                            if($t.is('.gsc-ta-active')){
                                return;
                            }

                            //Remove gsc-ta-active class from all tabs (including clones)
                            $allTabs.removeClass('gsc-ta-active');

                            //Trigger custom gse_tab_click event and adding gsc-ta-active class to the clicked element//
                            $t.trigger('gse_tab_click', [$t, $assocCont]).add($clones.eq(i)).addClass('gsc-ta-active');

                            //If clone is clicked then add active class to corresponding tab//
                            if($t.is('.gsc-ta-clone')){
                                $tabs.eq($clones.index($t)).addClass('gsc-ta-active');
                            }

                            //Hiding all containers and showing the associated container//
                            $contChildren.hide();
                            $assocCont.fadeIn(150);

                            //If layout is accordion then scroll the page to the activated tab for user's better experience//
                            if (layout == 'accordion') {
                                //Scrolling to top when expand the container for accordion//
                                $('html, body').animate({'scrollTop': $t.offset().top - 5});
                            }

                            //When tab is activated, trigger gse_lazyload event to show the images//
                            $window.trigger('gse_lazyload');
                        });
                    });

                    //If tab is not responsive then add width to the tabs container for swipe effect//
                    if (!isRes) {
                        $tEle.width(tabWidth);
                    }

                    //Showing the default tab on page load//
                    $contChildren.eq(options.defaultOpen - 1).show();

                    //Binding responsiveness on page load and on window.resize event//
                    tabs.responsiveTabs(options, $tEle, $contEle);
                    if (options.responsive) {
                        var resizeTimeout = 0;
                        $window.resize(function () {
                            clearTimeout(resizeTimeout);
                            resizeTimeout = setTimeout(function(){
                                tabs.responsiveTabs(options, $tEle, $contEle);
                            }, 50);
                        });
                    }
                });
            },
            responsiveTabs: function (options, $tEle, $contEle) {
                var wrapper = $tEle,
                    responsiveTab = $contEle.find('*[data-gsta-responsivetab]');
                tabs.setLayout(options);
                if (layout == "accordion") {
                    wrapper.hide();
                    responsiveTab.show();
                } else {
                    wrapper.show();
                    responsiveTab.hide();
                }
            },
            setLayout: function (options) {
                layout = options.layout;
                if (layout == 'auto' && options.responsive) {
                    layout = options.responsive && $window.innerWidth() < options.breakpoint ? 'accordion' : 'auto';
                }
            }
        };
    $.fn.gsp_tab = function (options) {
        var $tEle = $(this),
            tabName = 'gsp_tab_' + $.now(),
            $contEle = $(options.content_wrap);
        if ($contEle.length) {
            $tEle.attr('data-gstab-wrap', tabName);
            $contEle.attr('data-gstab-container-wrap', tabName);
            tabs._init($tEle, options);
        }
    };
    $(function () {
        //Auto _initialization//
        tabs._init($('*[data-gstab-wrap]'));
    })
})(jQuery, window);