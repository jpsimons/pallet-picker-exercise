
var inventory = null;
var pallets = null;
var product = null;
var selectedPallets = [];

var redrawSelectedPallets = function() {
    jQuery('.selected-pallets').show();
    var tbody = jQuery('.selected-pallets tbody').empty();
    selectedPallets.forEach(function(pallet) {
       tbody.append(jQuery('<tr>')
        .append(jQuery('<td>').text(pallet.friendly_name))
        .append(jQuery('<td>').text(product.code))
        .append(jQuery('<td>').append(jQuery('<a>Remove</a>').on('click', removeSelection.bind(undefined, pallet)))));
    });
};

var addSelection = function(pallet) {
    selectedPallets.push(pallet);
    redrawSelectedPallets();
};

var removeSelection = function(pallet) {
  var index = selectedPallets.indexOf(pallet); // Find by object reference is OK I guess for now
  if (index != -1) {
      selectedPallets.splice(index, 1);
      redrawSelectedPallets();
  }
};

var showPalletsContaining = function(product) {
  var matches = pallets.filter(function(pallet) {
      return pallet.inventory_id == product.id;
  });
  if (matches.length) {
      jQuery('.matching-pallets').show();
      var tbody = jQuery('.matching-pallets tbody');
      tbody.empty();
      matches.forEach(function(match) {
         var row = jQuery('<tr>')
            .append(jQuery('<td>').text(match.friendly_name))
            .append(jQuery('<td>').text(product.code))
            .append(jQuery('<td>').append(jQuery('<a>Add to List</a>').on('click', addSelection.bind(undefined, match))));
         tbody.append(row);
      });
  }
};

var selectProduct = function(match) {
    product = match;
    jQuery('.inventory-matches').hide();
    jQuery('.inventory-selector').val('');
    if (product) {
        jQuery('.selected-product').show().find('label').text(product.code + ' - ' + product.description);
        
        jQuery.get('https://raw.githubusercontent.com/francisd/exercise/master/items.json', function(data) {
            pallets = JSON.parse(data);
            
            showPalletsContaining(product);
        });
    } else {
        jQuery('.selected-product').hide();
        jQuery('.matching-pallets').hide();
    }
};

var showMatching = function(value) {
  var matches = inventory.filter(function(item) {
     return item.code.indexOf(value) != -1 || item.description.indexOf(value) != -1; 
  });
  var menu = jQuery('.inventory-matches');
  if (matches.length) {
      menu.empty();
      matches.forEach(function(match) {
          menu.append(jQuery('<li>')
            .text(match.description)
            .addClass('clickable')
            .on('click', selectProduct.bind(undefined, match)));
      });
  } else {
      menu.empty().append('<li>No matches</li>');
  }
};

jQuery('.inventory-selector').on('input', function() {
    var value = this.value;
    if (inventory) {
        showMatching(value);
    } else {
        jQuery.get('https://raw.githubusercontent.com/francisd/exercise/master/inventory.json', function(data) {
            inventory = JSON.parse(data);
            showMatching(value);
        });
    }
}).on('focus', function() {
    jQuery('.inventory-matches').show();
}).on('blur', function() {
    setTimeout(function() {
        jQuery('.inventory-matches').hide();
    }, 100);
});

jQuery('.selected-product-done').on('click', selectProduct.bind(undefined, null));


