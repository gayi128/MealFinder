// Load categories on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});

document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return alert("Enter a meal name");
  fetchMealsByName(query);
});

document.getElementById("category-select").addEventListener("change", (e) => {
  const category = e.target.value;
  if (category) fetchMealsByCategory(category);
});

function loadCategories() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
      // Show category cards
      displayCategories(data.categories);

      // Fill dropdown (optional)
      const select = document.getElementById("category-select");
      data.categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.strCategory;
        opt.textContent = cat.strCategory;
        select.appendChild(opt);
      });
    });
}


function fetchMealsByName(query) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => displayMeals(data.meals));
}

function fetchMealsByCategory(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(res => res.json())
    .then(data => displayMeals(data.meals));
}

function displayMeals(meals) {
  const container = document.getElementById("meals-container");
  container.innerHTML = "";

  if (!meals) {
    container.innerHTML = "<p class='text-danger text-center'>No meals found.</p>";
    return;
  }

  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button class="btn btn-sm btn-outline-info mt-2" onclick="getMealDetails('${meal.idMeal}')">View Recipe</button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}
// display ategories
function displayCategories(categories) {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  categories.forEach(cat => {
    const card = document.createElement("div");
    card.className = "col-md-3";

    card.innerHTML = `
      <div class="card h-100 text-center shadow-sm" style="cursor: pointer;" onclick="fetchMealsByCategory('${cat.strCategory}')">
        <img src="${cat.strCategoryThumb}" class="card-img-top" alt="${cat.strCategory}">
        <div class="card-body">
          <h5 class="card-title">${cat.strCategory}</h5>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}


// Global access for onclick
window.getMealDetails = function (mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      showMealInModal(meal);
    });
};

function showMealInModal(meal) {
  const modalBody = document.getElementById("mealModalBody");

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${ing} - ${measure}`);
  }

  modalBody.innerHTML = `
    <h4>${meal.strMeal}</h4>
    <img src="${meal.strMealThumb}" class="img-fluid mb-3 rounded">
    <h5>Ingredients</h5>
    <ul>${ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
    <h5>Instructions</h5>
    <p>${meal.strInstructions}</p>
  `;

  new bootstrap.Modal(document.getElementById("mealModal")).show();
}



 
