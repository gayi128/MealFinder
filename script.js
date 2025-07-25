const searchInput = document.getElementById("search-input");
const mealsContainer = document.getElementById("meals");
const categoryList = document.getElementById("category-list");
const categoryDescription = document.getElementById("category-description");
const allCategoriesContainer = document.getElementById("all-categories");

async function fetchCategories() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await res.json();
  categoryList.innerHTML = "";
  data.categories.forEach(cat => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.textContent = cat.strCategory;
    li.style.cursor = "pointer";
    li.onclick = () => fetchByCategory(cat.strCategory);
    categoryList.appendChild(li);
  });
  displayAllCategoryCards(data.categories);
}

async function searchMeals(query) {
  categoryDescription.innerHTML = "";
  allCategoriesContainer.style.display = "none";
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  displayMeals(data.meals);
}

async function fetchByCategory(category) {
  allCategoriesContainer.style.display = "none";
  const allCategories = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const categoryData = await allCategories.json();
  const selectedCat = categoryData.categories.find(cat => cat.strCategory === category);
  if (selectedCat) {
    categoryDescription.innerHTML = `
      <img src="${selectedCat.strCategoryThumb}" class="img-fluid mb-3 rounded" style="max-height: 200px;" alt="${category}">
      <h3>${selectedCat.strCategory}</h3>
      <p class="px-3">${selectedCat.strCategoryDescription}</p>
    `;
  }

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();
  displayMeals(data.meals);
}

async function fetchMealDetails(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  showMealDetails(data.meals[0]);
}

function displayMeals(meals) {
  mealsContainer.innerHTML = "";
  if (!meals) {
    mealsContainer.innerHTML = '<p class="text-center">No meals found.</p>';
    return;
  }
  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card meal-card h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button class="btn btn-primary" onclick="fetchMealDetails(${meal.idMeal})">View Recipe</button>
        </div>
      </div>
    `;
    mealsContainer.appendChild(col);
  });
}

function showMealDetails(meal) {
  document.getElementById("mealModalLabel").textContent = meal.strMeal;
  document.getElementById("modalBody").innerHTML = `
    <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-2">Watch Video</a>
  `;
  const modal = new bootstrap.Modal(document.getElementById("mealModal"));
  modal.show();
}

function displayAllCategoryCards(categories) {
  allCategoriesContainer.innerHTML = "";
  categories.forEach(cat => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="fetchByCategory('${cat.strCategory}')">
        <img src="${cat.strCategoryThumb}" class="card-img-top" alt="${cat.strCategory}">
        <div class="card-body">
          <h5 class="card-title">${cat.strCategory}</h5>
          <p class="card-text">${cat.strCategoryDescription.substring(0, 100)}...</p>
        </div>
      </div>
    `;
    allCategoriesContainer.appendChild(col);
  });
}

// Event Listeners
searchInput.addEventListener("keyup", e => {
  const query = e.target.value.trim();
  if (query.length > 0) {
    searchMeals(query);
  } else {
    mealsContainer.innerHTML = "";
    categoryDescription.innerHTML = "";
    allCategoriesContainer.style.display = "flex";
  }
});

// Initial Load
fetchCategories();

// Allow global access for inline onclick
window.fetchMealDetails = fetchMealDetails;
window.fetchByCategory = fetchByCategory;
