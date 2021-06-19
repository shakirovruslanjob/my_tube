const $searchForm = document.getElementById('search-form');
const $searchInput = document.getElementById('search-input');

function handleSearch(e) {
  e.preventDefault();
  location.replace(`/videos/search/${$searchInput.value}`);
}

// $searchForm.addEventListener('submit', handleSearch);

alert('hello');