$(document).ready(function () {
  var characters = {
    "Jon Snow": {
      name: "Jon Snow",
      health: 100,
      attack: 10,
      imageURL: "assets/images/jon-snow.png",
      enemyAttackBack: 8,
    },
    "Night King": {
      name: "Night King",
      health: 140,
      attack: 15,
      imageURL: "assets/images/night-king.jpg",
      enemyAttackBack: 15,
    },
    "Tormund Giantsbane": {
      name: "Tormund Giantsbane",
      health: 75,
      attack: 20,
      imageURL: "assets/images/tormund.jpeg",
      enemyAttackBack: 5,
    },
    "Karl Tanner": {
      name: "Karl Tanner",
      health: 65,
      attack: 18,
      imageURL: "assets/images/karl-tanner.jpg",
      enemyAttackBack: 8,
    },
    "Sir Bronn": {
      name: "Sir Bronn",
      health: 100,
      attack: 15,
      imageURL: "assets/images/sir-bronn.jpeg",
      enemyAttackBack: 20,
    },
  }
  var attacker
  var combatants = []
  var defender
  var turnCounter = 1
  var killCount = 0

  const renderCharacter = function (character, renderArea) {
    var charDiv = $(
      "<div class='character' data-name='" + character.name + "'>"
    )
    var charName = $("<div class='character-name'>").text(character.name)
    var charImage = $("<img alt='image' class='character-image'>").attr(
      "src",
      character.imageURL
    )
    var charHealth = $("<div class='character-health'>").text(character.health)
    charDiv.append(charName).append(charImage).append(charHealth)
    $(renderArea).append(charDiv)
  }
  const initializeGame = function () {
    for (var key in characters) {
      renderCharacter(characters[key], "#characters-section")
    }
  }
  initializeGame()
  var updateCharacter = function (charObj, areaRender) {
    $(areaRender).empty()
    renderCharacter(charObj, areaRender)
  }
  var renderEnemies = function (enemyArr) {
    for (var i = 0; i < enemyArr.length; i++) {
      renderCharacter(enemyArr[i], "#available-to-attack-section")
    }
  }
  var renderMessage = function (message) {
    var gameMessageSet = $("#game-message")
    var newMessage = $("<div>").text(message)
    gameMessageSet.append(newMessage)
  }
  var restartGame = function (resultMessage) {
    var restart = $("<button>Restart</button>").click(function () {
      location.reload()
    })
    var gameState = $("<div>").text(resultMessage)
    $("body").append(gameState)
    $("body").append(restart)
  }
  var clearMessage = function () {
    var gameMessage = $("#game-message")

    gameMessage.text("")
  }

  // onclick events
  // onclick event for selecting character
  $("#characters-section").on("click", ".character", function () {
    var name = $(this).attr("data-name")
    if (!attacker) {
      attacker = characters[name]
      for (var key in characters) {
        if (key !== name) {
          combatants.push(characters[key])
        }
      }
      $("#characters-section").hide()
      updateCharacter(attacker, "#selected-character")
      renderEnemies(combatants)
    }
  })

  // onclick event for each enemy
  $("#available-to-attack-section").on("click", ".character", function () {
    var name = $(this).attr("data-name")
    if ($("#defender").children().length === 0) {
      defender = characters[name]
      updateCharacter(defender, "#defender")
      $(this).remove()
      clearMessage()
    }
  })
  // onclick event for attack button and game logic
  $("#attack-button").on("click", function () {
    if ($("#defender").children().length !== 0) {
      var attackMessage =
        "You attacked " +
        defender.name +
        " for " +
        attacker.attack * turnCounter +
        " damage."
      var counterAttackMessage =
        defender.name +
        " attacked you back for " +
        defender.enemyAttackBack +
        " damage."
      clearMessage()

      defender.health -= attacker.attack * turnCounter

      if (defender.health > 0) {
        updateCharacter(defender, "#defender")

        renderMessage(attackMessage)
        renderMessage(counterAttackMessage)

        attacker.health -= defender.enemyAttackBack

        updateCharacter(attacker, "#selected-character")

        if (attacker.health <= 0) {
          clearMessage()
          restartGame("You have been defeated...GAME OVER!!!")
          $("#attack-button").off("click")
        }
      } else {
        $("#defender").empty()

        var gameStateMessage =
          "You have defeated " +
          defender.name +
          ", you can choose to fight another enemy."
        renderMessage(gameStateMessage)

        killCount++

        if (killCount >= combatants.length) {
          clearMessage()
          $("#attack-button").off("click")
          restartGame("You Won!!!! GAME OVER!!!")
        }
      }
      turnCounter++
    } else {
      clearMessage()
      renderMessage("No enemy here.")
    }
  })
})
