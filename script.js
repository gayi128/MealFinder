document.addEventListener("DOMContentLoaded", () => {
      loadCategories();
    });

    document.getElementById("search-btn").addEventListener("click", () => {
      const query = document.getElementById("search-input").value.trim();
      if (!query) return alert("Please enter a meal name.");

      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals))
        .catch(err => console.error("Search Error:", err));
    });

    document.getElementById("category-select").addEventListener("change", function () {
      const category = this.value;
      if (!category) return;

      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals))
        .catch(err => console.error("Category Filter Error:", err));
    });

    function loadCategories() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("category-list");
      container.innerHTML = "";

      data.categories.forEach(category => {
        const button = document.createElement("button");
        button.className = "btn btn-outline-secondary w-100 text-start mb-2";
        button.textContent = category.strCategory;
        button.onclick = () => fetchCategoryMeals(category.strCategory);
        container.appendChild(button);
      });
    })
    .catch(err => {
      console.error("Error loading categories:", err);
    });
}


    function displayMeals(meals) {
      const container = document.getElementById("meals-container");
      container.innerHTML = "";
      if (!meals) {
        container.innerHTML = '<p class="text-danger">No meals found.</p>';
        return;
      }
      meals.forEach(meal => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
              <button class="btn btn-outline-info btn-sm" onclick="getMealDetails(${meal.idMeal})">View Recipe</button>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    }

    function getMealDetails(mealId) {
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => showMealPopup(data.meals[0]))
        .catch(err => console.error("Meal Detail Error:", err));
    }

    function showMealPopup(meal) {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredients.push(`${ing} - ${measure}`);
        }
      }

      const modalBody = document.getElementById("mealModalBody");
      modalBody.innerHTML = `
        <h4>${meal.strMeal}</h4>
        <img src="${meal.strMealThumb}" class="img-fluid mb-3 rounded">
        <h5>Ingredients</h5>
        <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <h5 class="mt-3">Instructions</h5>
        <p>${meal.strInstructions}</p>
      `;

      const modal = new bootstrap.Modal(document.getElementById("mealModal"));
      modal.show();
    }
  