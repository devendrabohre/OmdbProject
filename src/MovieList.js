/**
 *
 * MovieList
 *
 */

import React from 'react';
/* eslint-disable react/prefer-stateless-function */
export default class MovieList extends React.PureComponent {

  getAddOrRemoveButton = (movie, favouriteMovies) => {
    let movieIsAddedInFavMovies = favouriteMovies.some(favMovie => favMovie.imdbID === movie.imdbID)
    if (movieIsAddedInFavMovies)
      return <button type="button" onClick={(event) => this.props.favClickHandler(event, movie, "remove")}> - Remove From Favourite  </button>
    else
      return <button type="button" onClick={(event) => this.props.favClickHandler(event, movie, "add")}> + Add To Favourite </button>
  }

  render() {
    let movies = [...this.props.movies];
    let favMovies = [...this.props.favMovies];
    return (
      <section id="card-view" >
        {movies.length > 0 ? movies.map(movie => <article key={movie.imdbID} onClick={() => this.props.history.push("/movieDetails/" + movie.imdbID)}>
          <div className="card-image"><img alt="poster" src={movie.Poster} /></div>
          <div className="card-text">
            <h5> {movie.Title} ( {movie.Year} )</h5>
          </div>
          {this.getAddOrRemoveButton(movie, favMovies)}
        </article>
        ) : <div className="noDataFound">
            <h5>{this.props.noDataText}</h5>
          </div>}
        {this.props.isFetching && <div className="loader">Loading...</div>}
      </section>
    );
  }
}