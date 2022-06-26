// global 
const recipeCardTemplate = document.querySelector("[data-recipe-template]")
const recipeCardContainer = document.querySelector("[data-recipe-cards-container]")
const searchInput = document.querySelector("[data-search]")
const filterInput = document.querySelector("[data-categories]")
var currentCategory = filterInput[filterInput.selectedIndex].value
var categoryClickNum = 0;
let recipes = []

/**
 * onclick the dropdown filter option
 */
filterInput.addEventListener('click', function () {
  const selectedCategory = filterInput[filterInput.selectedIndex].value.toLowerCase()
  categoryClickNum++;
  if (categoryClickNum % 2 == 0) {
    document.getElementsByClassName("recipe-cards")[0].style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 400px))"
    if (selectedCategory === "all") {
      recipes.forEach(recipe => {

        document.getElementsByClassName("expanded-wrapper")[recipe.id].style.display = "none"
        recipe.element.classList.toggle("hide", false)

      })
    } else {
      recipes.forEach(recipe => {
        const isVisible =
        recipe.category.toLowerCase().includes(selectedCategory)
        recipe.element.classList.toggle("hide", !isVisible)
        document.getElementsByClassName("expanded-wrapper")[recipe.id].style.display = "none"
      })

    }
  }
}, false);

/**
 * onclick the search input feature
 */
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  recipes.forEach(recipe => {
    document.getElementsByClassName("expanded-wrapper")[recipe.id].style.display = "none"

    const isVisible =
    recipe.name.toLowerCase().includes(value) ||
    recipe.category.toLowerCase().includes(value)
    recipe.element.classList.toggle("hide", !isVisible)
  })
})


/**
 * get recipes from json and populate recipe cards
 */
fetch("data/recipes-public.json")
  .then(res => res.json())
  .then(data => {
    recipes = data.map(recipe => {
      const card = recipeCardTemplate.content.cloneNode(true).children[0]
      const image = card.querySelector("[data-image]")
      const name = card.querySelector("[data-name]")
      const time = card.querySelector("[data-time]")
      const category = card.querySelector("[data-category]")
      const id = recipe.id

      // update image
      let imagePath = "img/" + recipe.image
      image.style.backgroundImage = "url(" + imagePath + ")"

      // update condensed card display
      name.textContent = recipe.name
      time.textContent = recipe.time
      category.textContent = recipe.category

      /**
       * onclick individual cards
       * hide all other cards and expand selected card
       */
      card.addEventListener('click', function () {
        categoryClickNum = 0;
        recipes.forEach(recipe => {
          if (recipe.id != id) {
            recipe.element.classList.toggle("hide", true)
          }
        })

        document.getElementsByClassName("recipe-cards")[0].style.gridTemplateColumns = "repeat(auto-fit, minmax(400px, 800px))"
        card.querySelector(".expanded-wrapper").style.display = "grid"
        const ingredients = card.querySelector("[data-ingredients]")
        const directions = card.querySelector("[data-directions]")

        ingredients.textContent = ""
        recipe.ingredients.forEach(ingredient => {
          ingredients.innerHTML += ingredient + "<br>"
        })

        directions.textContent = ""
        recipe.directions.forEach(direction => {
          directions.innerHTML += direction + "<br>"
        })
      }, false);

      // pass card to container
      recipeCardContainer.append(card)
      return { id: recipe.id, name: recipe.name, category: recipe.category, element: card }
    })
  })

