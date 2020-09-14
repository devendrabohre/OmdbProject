/**
 *
 * MovieDetails
 *
 */

import React from 'react';

/* eslint-disable react/prefer-stateless-function */
export default class MovieDetails extends React.Component {
  state = {
    data: {},
    favMovies: localStorage.movies ? JSON.parse(localStorage.movies) : [],
    isFetching: true
  }

  componentDidMount() {
    this.getMovieDetails(this.props.match.params.id);
  }

  getMovieDetails = (id) => {
    this.setState({
      isFetching: true
    })
    let url = "https://www.omdbapi.com/?apikey=3b63fa88&i="+id;
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result,
            isFetching: false
          })
        },
        (error) => {
          console.error("error", error);
        }
      )
  }

  render() {
    return (
      <div>
        <div className="wrapper">
          <div className="header headerMenu">
            <ul><div className="floatleft">
              <li className="special_text" onClick={() => this.props.history.push("/")}><a href ="#0"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Back</a></li>
            </div>
            </ul>
          </div>
        </div>
        <div className="content ">
          <div className="flex">
            <div className="fx-b75">
              {this.state.isFetching ?
                <div className="loader">Loading...</div>
                :
                <React.Fragment>
                  <div className="movie_card" >
                    <div className="info_section">
                      <div className="movie_header">
                        <img className="locandina" src={this.state.data.Poster} alt="poster"/>
                        <h1>{this.state.data.Title}</h1>
                        <h4>{this.state.data.Year},{this.state.data.Director}</h4>
                        <span className="minutes">{this.state.data.Runtime}</span>
                        <p className="type">{this.state.data.Genre}</p>
                      </div>
                      <div className="movie_desc">
                        <p className="text">
                          {this.state.data.Plot}
                        </p>
                      </div>
                      <div className="movie_social">
                        <ul>
                          {this.state.data.Actors.split(",").map((temp, index) => (
                            <li key={index}>{temp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="blur_back bright_back" style={{ background: `url(${this.state.data.Poster})` }}></div>
                  </div>

                  <div className="table-responsive mr-t-50">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th >Title</th>
                          <th >Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(this.state.data).filter(([temp, value]) => !["Poster", "imdbID", "Response", "Rated"].includes(temp)).map(([temp, value]) => <tr key={temp}>
                              <th scope="row">{temp.replace(/([a-z])([A-Z])/g, '$1 $2')}</th>
                              <td>{temp === "Ratings" ? value.map((temp, index) => <span key={index}>
                                {index > 0 && <br />}
                                {temp.Source + "  (" + temp.Value + ")"}</span>)
                                : value}</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </React.Fragment>
              }
            </div>
            <div className="fx-b25 ">
              {this.state.favMovies.length > 0 ? this.state.favMovies.map(movie => <div key={movie.imdbID} className="card max-width" onClick={() => this.getMovieDetails(movie.imdbID)}>
                <img className="card-img-top cardImgHeight" src={movie.Poster} alt="Card cap" />
                <div className="card-body">
                  <h5 className="card-title">{movie.Title} ( {movie.Year} )</h5>
                </div>
              </div>) :
                <div className="noDataFound">
                  <h5>No Movies Add To Favourite</h5>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}