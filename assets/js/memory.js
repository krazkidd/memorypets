// first selected card (DOM element object)
var firstSelectedCard;

// number of attempted pairings
var turnCount;
// number of cards
var cardCount;
// number of matches (at end of game, matchCount * 2 === cardCount)
var matchCount;

init();

// initialize the page
function init() {
  resetGame();

  // dropdown handler
  $("select[name='mem_size']").on("change", function() {
    resetGame();
  });

  // reset button handler
  $("button[name='mem_reset']").on("click", function() {
    resetGame();
  });

  // game board handler
  $("#mem_game").on("click", ".mem_cellback", cellClickHandler);
}

function resetGame() {
  console.log("reset");

  var selectedSize = Number($("select[name='mem_size']").val());

  // reset game
  firstSelectedCard = null;
  turnCount = 0;
  cardCount = selectedSize * selectedSize;
  matchCount = 0;

  // reset grid
  $("#mem_game").empty();
  $("<div/>").attr("id", "mem_grid")
             .appendTo("#mem_game");

  // rebuild the grid with the current size selection
  initGrid(selectedSize);

  updateGameStatus();
}

// build the grid
function initGrid(num) {
  // get glyphs
  var glyphs = getGlyphs(num * num);

  for (var i = 0; i < num; i++) {
    // create row
    var row = $("<div/>")
              .attr("class", "mem_row")
              .height(Math.floor($("#mem_grid").css("height") / num))
              .appendTo("#mem_grid");

    for (var j = 0; j < num; j++) {
      var cellSize = Math.floor(Number(row.width()) / num);

      // NOTE: We create two divs for each card because CSS transitions
      //       and jQuery animations weren't working well together.

      // colorfully styled backside of card
      var cardBack = $("<div/>")
                       .attr("class", "mem_cellback")
                       .outerWidth(cellSize - 10)
                       .outerHeight(cellSize - 10)
                       .hide()
                       .appendTo(row)
                       .fadeIn(Math.random() * 500 + 500);

      // animated frontside of card
      var cardFace = $("<div/>")
                          .attr("class", "mem_cellface")
                          .outerWidth(cellSize - 10)
                          .outerHeight(cellSize - 10)
                          .hide()
                          .appendTo(cardBack);

      // add card face content
      $("<span/>").text(glyphs.pop())
                  .appendTo(cardFace);
    }
  }
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

// implements the game logic
function cellClickHandler(event) {
  //TODO try different animations

  var cellface = $(this).children(".mem_cellface").first().get();

  // set as selected if it's the first to be flipped
  if (!firstSelectedCard) {
    $(cellface).fadeIn();

    firstSelectedCard = cellface;
  } else if ( !$(cellface).is(firstSelectedCard)) {
    $(cellface).fadeIn(fadeOutHandler($(cellface).add(firstSelectedCard)));

    if ($(cellface).text() === $(firstSelectedCard).text()) {
      matchCount++;

      var $toHide = $(cellface).parent();
      $toHide = $toHide.add($(firstSelectedCard).parent().get());

      $(cellface).queue(hideHandler($toHide));
    }

    turnCount++;
    firstSelectedCard = null;

    updateGameStatus();
  }
}

// (closure) helper to asynchronously fade out the elements in
// the given jQuery object
function fadeOutHandler(jObject) {
  return function() {
    jObject.fadeOut();
  }
}

// (closure) helper to asynchronously hide the elements in
// the given jQuery object
function hideHandler(jObject) {
  return function() {
    jObject.css("visibility", "hidden");
  }
}

function updateGameStatus() {
  $("#mem_turncount").text("Turns: " + turnCount);

  if (cardCount === matchCount * 2) {
    $("#mem_state").text("Game over!");
  } else {
    $("#mem_state").text("");
  }
}
