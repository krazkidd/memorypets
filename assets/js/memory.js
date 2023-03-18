// This file is part of Memory Pets.
//
// Copyright © 2017 Mark Ross <krazkidd@gmail.com>
//
// Memory Pets is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Memory Pets is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Memory Pets.  If not, see <http://www.gnu.org/licenses/>.


var $firstSelectedCard;

// number of attempted pairings
var turnCount;
// number of cards
var cardCount;
// number of matches (at end of game, matchCount * 2 === cardCount)
var matchCount;

$(function () {
  $("#mem_size,#reset").on("change", function() {
    resetGame();

    $(this).blur();
  });

  resetGame();
});

function resetGame() {
  var selectedSize = Number($("#mem_size").val());

  $firstSelectedCard = null;

  turnCount = 0;
  cardCount = selectedSize * selectedSize;
  matchCount = 0;

  $("#game").empty();

  // rebuild the grid with the current size selection
  initGrid(selectedSize);

  updateGameStatus();
}

// build the grid
function initGrid(num) {
  var glyphs = getGlyphs(num * num);
  var imageList = getImageList(glyphs);

  var $game = $("#game").empty();

  for (var i = 0; i < num; i++) {
    var $row = $("<div>")
      .addClass("row")
      .appendTo($game);

    for (var j = 0; j < num; j++) {
      var glyph = glyphs.pop();

      // NOTE: We create two divs for each card because CSS transitions
      //       and jQuery animations weren't working well together.

      var $col = $("<div>")
        .addClass("col")
        .appendTo($row);

      // colorfully styled backside of card
      var $cardBack = $("<div>")
        .addClass("game-cell")
        .on("click", cellClickHandler)
        .appendTo($col)
        .fadeIn(Math.random() * 500 + 500);

      // animated frontside of card
      var $cardFace = $("<div>")
        .addClass("cellface invisible")
        .css("backgroundImage", "url(" + imageList[glyph] + ")")
        .appendTo($cardBack);

      $("<span>")
        .addClass("invisible")
        .text(glyph)
        .appendTo($cardFace);
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

function getImageList(glyphs) {
  //TODO use AJAX to get list of images from server
  var hardCodedList = [];
  for (var i = 0; i < glyphs.length / 2; i++) {
    hardCodedList.push("assets/images/game/" + i + ".jpg");
  }

  var images = {};

  for (var i = 0; i < glyphs.length; i++) {
    if (!images[glyphs[i]]) {
      images[glyphs[i]] = hardCodedList.pop();
    }
  }

  return images;
}

// implements the game logic
function cellClickHandler(event) {
  var $cellface = $(this).children(".cellface");

  // set as selected if it's the first to be flipped
  if (!$firstSelectedCard) {
    $cellface.toggleClass("visible invisible");

    $firstSelectedCard = $cellface;
  } else if (!$cellface.is($firstSelectedCard)) {
    $cellface.toggleClass("visible invisible");

    if ($cellface.text() === $firstSelectedCard.text()) {
      matchCount++;

      var $first = $firstSelectedCard;
      setTimeout(function () {
        $first.parent().addClass("invisible");
        $cellface.parent().addClass("invisible");
      }, 500);
    }

    // we have to always set .cellface visibility as it overrides parent visibility
    var $first = $firstSelectedCard;
    setTimeout(function () {
      $first.toggleClass("visible invisible");
      $cellface.toggleClass("visible invisible");
    }, 500);

    turnCount++;
    $firstSelectedCard = null;

    updateGameStatus();
  }
}

function updateGameStatus() {
  $("#score").text(turnCount);

  if (cardCount === matchCount * 2) {
    $("#mem_state").text("Game over!");
  } else {
    $("#mem_state").html("&nbsp;");
  }
}
