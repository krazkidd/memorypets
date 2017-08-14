var selected = null;

init();

function init() {
  initGrid(4);
}

function initGrid(num) {
  // create rows
  for (var i = 0; i < num; i++) {
    var row = $("<div/>").attr("class", "row").appendTo("#grid");

    // create cells in row
    for (var j = 0; j < num; j++) {
      var cell = $("<div/>").attr("class", "cell").appendTo(row);

      cell.on("click", cellClickHandler(j, i));
    }
  }
}

// special closure for handling cell clicks
function cellClickHandler(x, y) {
  return function(event) {
    console.log("clicked cell - x: " + x + ", y: " + y);
    $(event.target).toggleClass("selected");

    // set as selected if it's the first to be flipped
    if (!selected) {
      console.log("set as selected");
      selected = event.target;
    } else {
      // else compare to selected
      //TODO

      // reset both selected cards
      $(selected).toggleClass("selected");
      $(event.target).toggleClass("selected");
      selected = null;
    }
  };
}
