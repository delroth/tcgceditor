// SPDX-License-Identifier: CC0-1.0
// SPDX-FileCopyrightText: 2025 Pierre Bourdon <delroth@gmail.com>
//
// A default card to use for the editor on startup and reset.


export default JSON.stringify({
  "name": "Venusaur ex",
  "expansion": {
    "id": "531",
    "name": "Venusaur, Charizard & Blastoise Random Constructed Starter Decks",
    "series": "PCG Era",
    "tcgRegion": "Japan",
    "code": null,
    "releaseDate": "2004-03-19T00:00:00Z",
    "cardNumberRightPart": "052"
  },
  "number": "004/052",
  "numberSortingOrder": 4,
  "variants": [
    {
      "type": "Normal Holo",
      "exclusiveCardLanguages": [],
      "sortingOrder": null,
      "needsReview": false,
      "notesMd": null
    },
    {
      "type": "1st Edition Holo",
      "exclusiveCardLanguages": [],
      "sortingOrder": null,
      "needsReview": false,
      "notesMd": null
    }
  ],
  "supertype": "Pokémon",
  "types": [
    "Pokémon ex"
  ],
  "pokemonStage": "Stage 2",
  "evolvesFrom": "Ivysaur",
  "evolvesInto": [],
  "hitPoints": 150,
  "energyTypes": ["Grass"],
  "rules": [
    {
      "description": "When Pokémon-ex has been Knocked Out, your opponent takes 2 Prize cards.",
      "sortingOrder": 1
    }
  ],
  "effects": [
    {
      "type": "Poké-POWER",
      "name": "Energy Trans",
      "description": "As often as you like during your turn (before your attack), move a Grass Energy card attached to 1 of your Pokémon to another of your Pokémon. This power can't be used if Venusaur ex is affected by a Special Condition.",
      "sortingOrder": 1
    }
  ],
  "attacks": [
    {
      "name": "Pollen Hazard",
      "energies": [
        {
          "type": "Grass",
          "quantity": 1,
          "sortingOrder": 1
        },
        {
          "type": "Colorless",
          "quantity": 2,
          "sortingOrder": 2
        }
      ],
      "damage": "20",
      "description": "The Defending Pokémon is now Poisoned, Burned, and Confused.",
      "sortingOrder": 1
    },
    {
      "name": "Solarbeam",
      "energies": [
        {
          "type": "Grass",
          "quantity": 3,
          "sortingOrder": 1
        },
        {
          "type": "Colorless",
          "quantity": 2,
          "sortingOrder": 2
        }
      ],
      "damage": "90",
      "sortingOrder": 2
    }
  ],
  "weaknesses": [
    {
      "type": "Fire",
      "value": "x2",
      "sortingOrder": 1
    },
    {
      "type": "Psychic",
      "value": "x2",
      "sortingOrder": 2
    }
  ],
  "resistances": [],
  "retreatCost": 3,
  "rarity": null,
  "illustrators": ["Ryo Ueda"],
  "pokedexNumbers": [3],
  "format": "Unlimited",
  "regulationMark": null,
  "imageReference": null,
  "isComplete": true,
  "needsReview": true
}, null, 2)
