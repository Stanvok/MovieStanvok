const filmsContainer = document.querySelector(".films_container");
const filmDetailsContainer = document.querySelector(".film_details");
const input = document.querySelector(".search-field");

const apiKey = "7fd9c1dac8c0a89e61e0c9ca44623900";

const filmCard = ({ name, poster_path, id }) => `
  <div class="film_card" data-id="${id}">
    <h2>${name}</h2>
    <img
      src="${
        poster_path
          ? `http://image.tmdb.org/t/p/w500${poster_path}`
          : "https://www.atehno.md/theme/images/no_image.png"
      }"
      class="film_card_img"
    />
  </div>
`;

const filmDetails = ({ name, poster_path, overview, genres, homepage }) => `
  <img
  src="http://image.tmdb.org/t/p/w500${poster_path}"
  />
  <div class="details">
    <h2>${name}</h2>
    <a href="${homepage}" target="_blank"> Official page</a>
    <p>${genres.map(({ name }) => ` <i>${name}</i>`)}</p>
    <p>${overview}</p>
  </div>
`;

const makeApiCall = async url => {
  const response = await fetch(url);

  return response.json();
};

const renderFilms = data => {
  filmsContainer.innerHTML = data.results.map(film => filmCard(film)).join("");
};

const renderFilmDetails = data => {
  filmDetailsContainer.innerHTML = filmDetails(data);
};

const api = {
  getTrendingFilms: () => {
    return makeApiCall(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
    );
  },
  getFilmsByTitle: title => {
    return makeApiCall(
      `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${title}`
    );
  },
  getFilmById: id => {
    return makeApiCall(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
    );
  }
};

const addOnClickEvent = () => {
  document
    .querySelectorAll(".film_card")
    .forEach(el => el.addEventListener("click", events.onClick));
};

const addOnChangeEvent = () => {
  input.addEventListener("input", events.onChange);
};

const showTrendingFilm = async () => {
  const results = await api.getTrendingFilms();
  renderFilms(results);
  addOnClickEvent();
}

const showFilmBySearch = async (key) => {
  const results = await api.getFilmsByTitle(key);
  renderFilms(results);
  addOnClickEvent();
}


const events = {
  onClick: async ({ currentTarget }) => {
    const result = await api.getFilmById(currentTarget.dataset.id);
    renderFilmDetails(result);
  },
  onChange: async e => {
    if (e.target.value === "") {
      showTrendingFilm();
    } else {
      showFilmBySearch(e.target.value.trim());
    }
  }
};

(main = async () => {
  showTrendingFilm();

  addOnChangeEvent();
})();
