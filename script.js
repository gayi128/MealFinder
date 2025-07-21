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

function displayMeals(meals) {
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
          <p class="card-text">${meal.strArea} - ${meal.strCategory}</p>
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


}
