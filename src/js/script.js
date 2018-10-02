$(function() {

  $('*[data-js="shoping-cart-item"]').each(function(index) {
    var parent = $(this);
    parent.find('input').on('change', function(e) {
      var type = $(this).attr('type');
      var value;
      if(type == 'number' || type == 'text') {
        value = parseFloat($(this).val()) * parseFloat(parent.find('*[data-js="unit-price"] .value').text());
      } else if(type == 'checkbox') {
        if($(this).prop('checked') == true) {
          console.log('checked');
          value = parseFloat(parent.find('*[data-js="cost"] .value').text()) + parseFloat($(this).parent().find('.value').text());
        } else {
          console.log('unchecked');
          value = parseFloat(parent.find('*[data-js="cost"] .value').text()) - parseFloat($(this).parent().find('.value').text());
        }
      }
      updateCost(parent, value);
    });
  });

  $('.count-ctrl .ctrl-btn').on('click', function(e) {
    e.preventDefault();
    var action = $(this).attr('data-js');
    var input = $(this).parent().find('input');
    if(action == 'increment') {
      input.val(parseFloat(input.val()) + 1);
    } else if(action == 'decrement') {
      if(input.val() > 1) {
        input.val(parseFloat(input.val()) - 1);
      }
    }
    input.trigger('change');
  });

  $('.btn--burger').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });

  equalHeight('.shoping-cart-item__price-generator h4');

  $(window).on('resize', function() {
    equalHeight('.shoping-cart-item__price-generator h4');
  });

  function updateCost(parent, value) {
    var newValue = value;
    parent.find('*[data-js="cost"] .value').text(newValue.toFixed(2));
    updateTotalCost();
  }

  updateTotalCost();

  function updateTotalCost() {
    var total = 0;
    $('*[data-js="cost"]').each(function() {
      total += parseFloat($(this).find('.value').text());
    });
    total += parseFloat($('.shiping-price .value').text());
    total -= parseFloat($('.discount .value').text());
    $('.total .value').text(total.toFixed(2));
  }

  function equalHeight(el) {
    var elHeight = 0;
    $(el).each(function(index) {
      elHeight = (parseFloat($(this).height()) > elHeight) ? parseFloat($(this).height()) : elHeight;
    });
    $(el).css('height', elHeight + 'px');
  }

  $('select').niceSelect();

  $('.tabs .item').tab();
  $('.ui.accordion').accordion();
});