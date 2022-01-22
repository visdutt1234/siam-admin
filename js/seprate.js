    $('.vrticlTopFilter').click(function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        $(this).toggleClass('active');
        $(this).siblings('.fltrList').slideToggle();
    });

   // search filed js 
    $('#searchBox').click(function(){
       $(this).hide();
       $('#filterSearchBoxID').show();
    });
    $('.searchRemove').click(function(){
       $('#filterSearchBoxID').hide();
       $('.search').show();
    });

    $(document).ready(function(){
      $('.filterHdr').click(function(){
         $('.leftContainer').show();
      })
      $('.fltrRemove').click(function(){
         $('.leftContainer').hide();
      });
    });

    $(document).ready(function(){
           $('.fliterClear').click(function(){
             $(this).hide();
             $('.vrticlslcted').hide();
           });
          
        // expend show more and less more fltrbox js

          $('.showMore').click(function(){
             $(this).parents('ul').addClass('showAll');
             $(this).hide();
          });
          $('.lessMore').click( function() {
             $(this).parents('ul').removeClass('showAll');
             $(this).next().show();
          });

        // filter popup js start here 
         $('#popUpFilter').click(function(){
             function offsetTopValue(){
               var element = document.getElementById('popUpFilter');
                var topPos = element.getBoundingClientRect().top + window.scrollY;
                var leftPos = element.getBoundingClientRect().left + window.scrollX;
                $('.fltrPopUp').css({
                   top: topPos - 440,
                });
             }
             offsetTopValue();
             // get position of element 
             $('.PopUpOverLay').show();
             // add box-shadow on scroll
              $('.PopUpOverLay').scroll(function(){
                var sideStickyBtn = $('#fltrPopUpMobiHdr'),
                    scroll = $('.PopUpOverLay').scrollTop();

                if (scroll >= 50) sideStickyBtn.addClass('boxShadow');
                else sideStickyBtn.removeClass('boxShadow');
              });
         });


         $(".close, .arrowBack").click(function(){
            $('.PopUpOverLay').hide();
         });
         $('.PopUpOverLay').click(function(){
            $(this).hide();
         })
         $('.fltrPopUp').click(function(event){
           event.stopPropagation();
        });

    });


const OPEN = 'is-open'; // state
const documentEvent = $(document);
const defaultSelect = $('#select-name');

let dynamicCustomSelect = (defaultSelectFieldID) => {
  if(defaultSelectFieldID.length){ // prevent errors and code will not run if ID doesn't exist
    let currentValue,
        currentText,
        selectedID,
        mainParent,
        appendParent,
        customSelectID,
        defaultOptions,
        customSelectedField,
        customOptionsField,
        customOptionListField,
        extractedData = []; // adding variables that we can use

    selectedID = defaultSelectFieldID;
    // get data of the default select attributes
    mainParent = `js-${selectedID.attr('id')}`;
    customSelectID = selectedID.attr('name');
    defaultOptions = selectedID.find('option');
    
    // extract the data in the select field
    defaultOptions.each(function(){
      extractedData.push({value: $(this).val(), text: $(this).text()});
    });

    selectedID.after(`<div class="select-dropdown" id="${mainParent}"></div>`); // append parent wrapper of our custom select next to the select field

    // assign variables to the class and id that will be usefull in the functionality
    currentValue = extractedData[0];
    appendParent = $(`#${mainParent}`);
    customSelectedField = `js-${customSelectID}-head`;
    customOptionsField = `js-${customSelectID}-options`;
    customOptionListField = `js-${customSelectID}-option-list`;
    
    // append the custom selected field which class is select-head and the wrapper for our options which class is select-option
    appendParent.append(`
      <div class="select-head" id="${customSelectedField}">${currentValue['text']}
      </div>
      <div class="select-options">
         <div class="siamCustomScroll" id="${customOptionsField}"></div>
      </div>
    `);
    
    // append the datas in the list
    for(let i = 0; i < extractedData.length; i++){
      $(`#${customOptionsField}`).append(`<div class="select-option-list ${customOptionListField}" data-value="${extractedData[i]['value']}">
          <label class="gs_control gs_radio">${extractedData[i]['text']}
            <input name="radio" type="radio">
            <span class="gs_control__indicator"></span>
         </label>
        </div>`);
    }
    
    // add toggle state which open the select-option when select-head is clicked
    documentEvent.on('click',`#${customSelectedField}`, function() {
      $(this).parent().toggleClass(OPEN);
      
      if($(this).parent().hasClass(OPEN)){
        $(this).next().slideDown(); 
      }else{
        $(this).next().slideUp();
      }
    });
    
    // adding selected data in the selected data field and default select field after clicking the select-option list
    documentEvent.on('click',`.${customOptionListField}`,function(){
      currentText = $(this).text();
      currentValue = $(this).attr('data-value');
      selectedID.find(`option[value="${currentValue}"]`).prop('selected',true);
      $(`#${customSelectedField}`).text(currentText).next().slideUp().parent().removeClass(OPEN);
    });

    // clicking outside the custom select field will close the opened option field
    documentEvent.click(() => {
     $(`.${OPEN}`).removeClass(OPEN);
     // $(`#${customOptionsField}`).slideUp();
     $('.select-options').slideUp();
    });
    documentEvent.on('click',`#${mainParent}`,(event) => {
      event.stopPropagation();
    });
    
  }
}

dynamicCustomSelect(defaultSelect);
