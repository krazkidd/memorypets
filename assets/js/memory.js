// selected DOM elements
var selected1;
var selected2;

init();

// initialize the game
function init() {
  initGrid(Number($("select[name='mem_size']").val()));

  $("select[name='mem_size']").on("change", function() {
    initGrid(Number($("select[name='mem_size']").val()));
  });

  $("button[name='mem_reset']").on("click", function() {
    initGrid(Number($("select[name='mem_size']").val()));
  });
}

// build the grid
function initGrid(num) {
  console.log("reset");

  // reset grid
  $(".mem_cell").remove();
  $(".mem_row").remove();
  selected1 = null;
  selected2 = null;

  // get glyphs
  var glyphs = getGlyphs(num * num);

  for (var i = 0; i < num; i++) {
    // create row
    var row = $("<div/>").attr("class", "mem_row").appendTo("#mem_grid");

    row.height(Math.floor($("#mem_grid").css("height") / num));

    for (var j = 0; j < num; j++) {
      // create cell; fade in over short random amount of time
      var cell = $("<div/>").hide().attr("class", "mem_cell").appendTo(row).fadeIn(Math.random() * 500 + 500);

      var cellSize = Math.floor(Number(row.width()) / num);
      cell.outerWidth(cellSize - 10);
      cell.outerHeight(cellSize - 10);
      console.log("cell size - " + cellSize + "x" + cellSize);

      // add card face content
      $("<span/>").text(glyphs.pop()).appendTo(cell);

      // add click handler (closure)
      cell.on("click", cellClickHandler(j, i));
    }
  }
}

// special closure for handling cell clicks
function cellClickHandler(x, y) {
  return function() {
    console.log("clicked cell - x: " + x + ", y: " + y);

    // NOTE: We leave both selected cards facing player until
    //       we can get animations to work well.

    // flip previous selected
    if (selected1 && selected2) {
      // don't remove selected class so flickering doesn't occur
      if (this !== selected1) {
        $(selected1).removeClass("selected");
      }
      if (this !== selected2) {
        $(selected2).removeClass("selected");
      }

      selected1 = null;
      selected2 = null;
    }

    // set as selected if it's the first to be flipped
    if (!selected1) {
      console.log("first selected");

      $(this).addClass("selected");
      selected1 = this;
    } else if (this !== selected1) {
      console.log("second selected");

      $(this).addClass("selected");
      selected2 = this;

      console.log("comparing");

      if ($(selected1).text() === $(selected2).text()) {
        console.log("match!")

        $(selected1).css("visibility", "hidden");
        $(selected2).css("visibility", "hidden");
      } else {
        console.log("no match!")

        // $(this).removeClass("selected");
        // $(this).removeClass("selected");
      }
    }
  };
}

// return a randomized array of glyphs to use on the card faces.
// num must be an even number
function getGlyphs(num) {
  if (num % 2 != 0) {
    throw "getGlyphs(): num parameter must be an even number.";
  } else if (num > 26) {
    throw "getGlyphs(): Currently, this function cannot generate more than 26 glyphs. (" + num + " requested.)";
  }

  var glyphs = new Array(num);

  for (var i = 0; i < num / 2; i++) {
    // select two random indices or the first unocuppied ones
    // following those
    var index1 = Math.floor(Math.random() * num);
    while (glyphs[index1]) {
      index1++;
      if (index1 === glyphs.length) {
        index1 = 0;
      }
    }

    var index2 = Math.floor(Math.random() * num);
    while (glyphs[index2] || index2 === index1) {
      index2++;
      if (index2 === glyphs.length) {
        index2 = 0;
      }
    }

    // generate random glyph not already used
    var r;
    do {
      //TODO use unicode symbol range
      r = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
    } while (glyphs.indexOf(r) >= 0);

    // put the glyph at those two indices
    glyphs[index1] = r;
    glyphs[index2] = r;
  }

  return glyphs;
}
