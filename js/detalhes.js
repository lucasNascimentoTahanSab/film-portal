const API_KEY = '18d5ef4d79038896e29b1ea9b2e8752c'

let movie = {}

window.addEventListener('load', () => {
  loadMovieDetails()
})

function loadMovieDetails() {
  const movieId = window.location.search.split('?')[1]

  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR&page=1`)
    .then(result => result.json())
    .then(result => {
      movie = result
      loadMovieVideos()
    })
    .catch(error => console.log(error))
}

function loadMovieVideos() {
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=pt-BR&page=1`)
    .then(result => result.json())
    .then(result => {
      movieVideos = result?.results
      showMovieDetails()
    })
    .catch(error => console.log(error))
}

function showMovieDetails() {
  const movieDetailsContainer = document.getElementById('fp-film-details')
  movieDetailsContainer.innerHTML += generateNowPlayingMovie()
}

function generateNowPlayingMovie() {
  return `
    <article class="fp-section__row--gap-50 fp-section__column-xs">
      ${movieVideos.length > 0 ? `<iframe class="fp--width-100 fp--height-400px fp--height-200px-xxxs"
        src="${`https://www.youtube.com/embed/${movieVideos.find(video => video.site === 'YouTube')?.key}`}" frameborder="0" allowfullscreen>
      </iframe>` : ''}
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