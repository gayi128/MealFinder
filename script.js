document.getElementById('search-btn').addEventListener('click', function () {
  const query = document.getElementById('search-input').value.trim();

  if (query === "") {
    alert("Please enter a meal name.");
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(response => response.json())
    .then(data => {
      displayMeals(data.meals);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
});

function displayMeals(meals){
  const container = document.getElementById('meals-container');
  container.innerHTML = "";

  if (!meals) {
    container.innerHTML = `<p class="text-danger">No meals found. Try another search.</p>`;
    return;
  }

  meals.forEach(meal => {
    const mealCard = document.createElement('div');
    mealCard.className = 'col-md-4';

    mealCard.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
  <h5 class="card-title">${meal.strMeal}</h5>
  <button class="btn btn-sm btn-outline-info mt-2" onclick="getMealDetails(${meal.idMeal})">View Recipe</button>
</div>

      </div>
    `;
    container.appendChild(mealCard);
  });

  function getMealDetails(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      showMealPopup(meal);
    })
    .catch(error => {
      console.error("Error fetching meal details:", error);
    });
}

function showMealPopup(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }

  document.addEventListener("DOMContentLoaded", loadCategories);

function loadCategories() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("category-select");
      data.categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.strCategory;
        option.textContent = category.strCategory;
        select.appendChild(option);
      });
    });
}


  const mealDetailsWindow = window.open("", "_blank", "width=600,height=700,scrollbars=yes");
  mealDetailsWindow.document.write(`
    <html>
    <head>
      <title>${meal.strMeal}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="p-3">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
      <h5>Ingredients:</h5>
      <ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
      <h5 class="mt-3">Instructions:</h5>
      <p>${meal.strInstructions}</p>
    </body>
    </html>
  `)
}
window.getMealDetails = getMealDetails;
document.getElementById("category-select").addEventListener("change", function () {
  const selectedCategory = this.value;

  if (selectedCategory === "") return;

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
    .then(res => res.json())
    .then(data => {
      displayMeals(data.meals);
    });
});

}


