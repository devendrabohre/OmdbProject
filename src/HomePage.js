/**
 *
 * HomePage
 *
 */

import React from 'react';
import MovieList from './MovieList.js';
let GENRE_TYPE = {
  All: "",
  Movies: "movie",
  Series: "series",
  Episode: "episode"
}
/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  state = {
    searchKey: "",
    page: 1,
    movies: [],
    currentPage: 1,
    genre: "",
    favMovies: localStorage.movies ? JSON.parse(localStorage.movies) : [],
    isHomeView: true,
    isSearched: false
  }

  inputChangeHandler = ({ currentTarget }) => {
    this.setState({
      [currentTarget.id]: currentTarget.value
    })
  }

  formSubmitHandler = (event) => {
    event.preventDefault();
    if (this.state.isHomeView) {
      this.setState({
        currentPage: 1,
        page: 1
      })
      this.searchMovie(this.state.searchKey, 1, this.state.genre);
    } else {
      let favMovies = localStorage.movies ? JSON.parse(localStorage.movies) : []
      favMovies = favMovies.filter(temp => temp.Title.toLowerCase().includes(this.state.searchKey.toLowerCase()) && (temp.Type.includes(this.state.genre)))
      this.setState({
        favMovies,
        isSearched: true
      })
    }
  }

  searchMovie = (searchKey, pageNumber, genre) => {
    this.setState({
      isFetching: true
    })
    let url = "https://www.omdbapi.com/?apikey=3b63fa88&s="+searchKey+"&page=" + pageNumber + "&type=" +genre;
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState((previousState) => ({
            movies: result.Response === "True" ? [...previousState.movies, ...result.Search]:[],
            totalPages: result.Response === "True" ? result.totalResults / 10 :1,
            isFetching: false,
            isSearched: true
          }))
        },
        (error) => {
          console.error("error", error);
        }
      )
  }

  nextPageRequestHandler = () => {
    this.setState((preState) => ({
      currentPage: preState.currentPage + 1,
      isFetching: true
    }), () => {
      this.searchMovie(this.state.searchKey, this.state.currentPage, this.state.genre)
    })
  }

  addOrRemoveFromFavourite = (event, movie, operation) => {
    event.stopPropagation();
    let favMovies = [...this.state.favMovies];
    if (operation === "add") {
      favMovies.push(movie);
    } else {
      favMovies = favMovies.filter(favMovie => favMovie.imdbID !== movie.imdbID)
    }
    localStorage.movies = JSON.stringify(favMovies)
    this.setState({
      favMovies
    })
  }

  isHomeView = (isHomeView) => {
    this.setState({
      isHomeView,
      searchKey: "",
      movies: [],
      isSearched: false
    })
  }

  setTypeGenre = (genre) => {
    this.setState({
        currentPage: 1,
        page: 1,
        movies: [],
        genre
      }, () => {
        this.searchMovie(this.state.searchKey, 1, this.state.genre);
      })
  }

  render() {
    let movies = this.state.isHomeView ? this.state.movies : this.state.favMovies;
    return (
      <div className="wrapper">
        <div className="headerMenu">
          <ul><div className="floatleft">
            <li className="special_text" onClick={() => this.isHomeView(true)}>
              <a className={this.state.isHomeView ? "active" : ""} href ="#0">
                <i className="fa fa-home" ></i> Home
              </a>
            </li>
          </div>
            <div className="floatright">
              <li onClick={() => this.isHomeView(false)}>
                <a className={!this.state.isHomeView ? "active" : ""}  href ="#0">
                  <i className="fa fa-star" aria-hidden="true"></i> Favourite
                </a>
              </li>
            </div>
          </ul>
        </div>
        <div className="content">
          <div className="searchContainer">
            <div className="searchBox">
              <form className="example fx-b70" onSubmit={this.formSubmitHandler}>
                <input type="text" id="searchKey" value={this.state.searchKey} disabled={!this.state.isHomeView && this.state.favMovies.length === 0} onChange={this.inputChangeHandler} placeholder="Search.." name="search" />
                <button type="submit" disabled={this.state.searchKey.length === 0} ><i className="fa fa-search"></i></button>
              </form>
            </div>
            <div className="genre">
              <ul>
                {Object.entries(GENRE_TYPE).map(([key, value]) => <li key={key} className={this.state.genre === value ? "active" : ""} onClick={() => this.setTypeGenre(value)}> {key}</li>)}
              </ul>
            </div>
          </div>
          {(this.state.isSearched || !this.state.isHomeView) &&
            <React.Fragment>
              {this.state.isSearched && <h4>Results for "{this.state.searchKey}"</h4>}
              <MovieList 
                {...this.props}
                movies={movies}  
                favMovies={this.state.favMovies}  
                favClickHandler = {this.addOrRemoveFromFavourite}
                isFetching={this.state.isFetching}
                noDataText = {this.state.isHomeView ? "No Match Found!" : "No Movies Add To Favourite"}
              />
            </React.Fragment>
          }
          {(this.state.isSearched && this.state.isHomeView) && <button type="button" disabled={this.state.pages === this.state.currentPage} onClick={this.nextPageRequestHandler} className="float">
            <i className="fa fa-arrow-right"></i>
          </button>}
        </div>
      </ div>
    );
  }
}