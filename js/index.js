const API_KEY = '18d5ef4d79038896e29b1ea9b2e8752c'

let configurations = []
let nowPlayingMovies = []
let topRatedMovies = []
let movieVideos = []

let nowPlayingVisible = 4
let topRatedVisibleMin = 0
let topRatedVisibleMax = 4
let reviewsVisible = 3

window.addEventListener('load', () => {
  loadConfigurations()
  loadNowPlayingMovies()
  loadTopRatedMovies()
  document.getElementById('load-more-top-rated').addEventListener('click', () => {
    topRatedVisibleMin = topRatedVisibleMax
    topRatedVisibleMax += 4
    loadTopRatedMovies()
  })
})

function loadConfigurations() {
  fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`)
    .then(result => result.json())
    .then(result => configurations = result?.images)
    .catch(error => console.log(error))
}

function loadNowPlayingMovies() {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`)
    .then(result => result.json())
    .then(result => {
      nowPlayingMovies = result?.results
      for (let i = 0; i < nowPlayingVisible; i++) {
        loadMovieVideos(nowPlayingMovies[i], i)
      }
    })
    .catch(error => console.log(error))
}

function loadTopRatedMovies() {
  fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`)
    .then(result => result.json())
    .then(result => {
      topRatedMovies = result?.results
      const topRatedMoviesContainer = document.getElementById('fp-top-rated-inner')
      topRatedMoviesContainer.innerHTML = ''

      if (topRatedVisibleMax >= result?.results.length) {
        topRatedVisibleMin = 0
        topRatedVisibleMax = 4
      }

      for (let i = topRatedVisibleMin; i < topRatedVisibleMax; i++) {
        showTopRatedMovie(topRatedMovies[i])
      }
    })
    .catch(error => console.log(error))
}

function loadMovieVideos(movie, index) {
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=pt-BR&page=1`)
    .then(result => result.json())
    .then(result => {
      movieVideos = result?.results
      showNowPlayingMovie(movie, index)
    })
    .catch(error => console.log(error))
}

function showNowPlayingMovie(movie, index) {
  const nowPlayingMoviesContainer = document.getElementById('fp-film-releases-inner')
  nowPlayingMoviesContainer.innerHTML += generateNowPlayingMovie(movie, index)
}

function showTopRatedMovie(movie) {
  const topRatedMoviesContainer = document.getElementById('fp-top-rated-inner')
  topRatedMoviesContainer.innerHTML += generateTopRatedMovie(movie)
}

function generateNowPlayingMovie(movie, index) {
  return `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <article class="fp-section__row--gap-50 fp-section__column-xs">
        <iframe class="fp--width-100 fp--height-400px fp--height-200px-xxxs"
          src="${`https://www.youtube.com/embed/${movieVideos.find(video => video.site === 'YouTube').key}`}" frameborder="0" allowfullscreen>
        </iframe>
        <section class="fp--width-100 fp-section__column--gap-25">
          <header>
            <h3>${movie.title}</h3>
          </header>
          <div class="fp-section__column--gap-16">
            <div class="fp--truncate-description">
              <span class="fp--font-weight-700">Sinopse: </span> ${movie.overview}
            </div>
            <div class="fp-section__row--gap-16 fp-section__column-xxs">
              <div class="fp--truncate-title">
                <span class="fp--font-weight-700">Estreia: </span>
                <span>${(new Date(movie.release_date)).getFullYear()}</span>
              </div>
            </div>
            <div class="fp-section__row--gap-8">
              <span class="fp--font-weight-700">Avaliação: </span>
              ${getMovieRating(movie.vote_average)}
            </div>
          </div>
        </section>
      </article>
    </div>
  `
}

function generateTopRatedMovie(movie) {
  return `
    <a class="fp--width-100" href="/detalhes.html?${movie.id}" title="${movie.title}">
      <img class="fp--image-cover" src="${getPosterImageURL(movie.poster_path)}">
    </a>
  `
}

function getMovieRating(voteAverage) {
  let movieRatingDOM = ''

  if (!voteAverage) {
    for (let i = 0; i < 5; i++) {
      movieRatingDOM += `<img src="./src/emptyStar.svg" alt="Estrela indicando avaliação do filme apresentado.">`
    }

    return movieRatingDOM;
  }

  const movieVoteAverage = voteAverage / 10
  const movieRating = Math.floor(movieVoteAverage * 5)

  for (let i = 0; i < movieRating; i++) {
    movieRatingDOM += `<img src="./src/filledStar.svg" alt="Estrela indicando avaliação do filme apresentado.">`
  }

  for (let i = 0; i < (5 - movieRating); i++) {
    movieRatingDOM += `<img src="./src/emptyStar.svg" alt="Estrela indicando avaliação do filme apresentado.">`
  }

  return movieRatingDOM;
}

function getPosterImageURL(imagePath) {
  return `${configurations.base_url}${configurations.poster_sizes[configurations.poster_sizes.length - 1]}/${imagePath}`
}

function getProfileImageURL(imagePath) {
  return `${configurations.base_url}${configurations.profile_sizes[configurations.profile_sizes.length - 1]}/${imagePath}`
}