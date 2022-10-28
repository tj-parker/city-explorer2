import React from 'react';
import axios from 'axios';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Weather from './Weather';
import Movies from './Movies';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      cityData: [],
      error: false,
      errorMessage: '',
      weatherData: [],
      lat: '',
      lon: '',
      movieError: false,
      movieErrorMessage: '',
      movie: []
    }
  }

  handleInput = (e) => {
    e.preventDefault();
    this.setState({
      city: e.target.value
    })
  }

  getCityData = async (e) => {
    e.preventDefault();

    try {
      let url = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&q=${this.state.city}&format=json`;

      let cityData = await axios.get(url);
      console.log(cityData);

      this.setState({
        cityData: cityData.data[0],
        error: false,
        lat: cityData.data[0].lat,
        lon: cityData.data[0].lon
      }, this.getApiCalls);

    } catch (error) {
      console.log(error);
      this.setState({
        error: true,
        errorMessage: error.messsage
      })
    }
  }

  getApiCalls = async () => {
    await this.getWeatherData();
    await this.getMovieData();
  }

  getWeatherData = async () => {
    try {

      let url = `${process.env.REACT_APP_SERVER}/weather?lat=${this.state.lat}&lon=${this.state.lon}`;

      let weatherData = await axios.get(url);

      this.setState({
        error: false,
        errorMessage: '',
        weatherData: weatherData.data
      })

    } catch (error) {
      this.setState({
        error: true,
        errorMessage: error.messsage
      });
    }
  }

  getMovieData = async () => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/movies?city_name=${this.state.city}`;

      let movieData = await axios.get(url);

      this.setState({
        movieError: false,
        movieErrorMessage: '',
        movie: movieData.data
      })
    } catch (error) {
      this.setState({
        movieError: true,
        movieErrorMessage: error.message
      })
    }
  }

  render() {
    return (
      <>
        <h1>City Explorer</h1>

        <Form onSubmit={this.getCityData}>
          <Form.Label> Pick a City</Form.Label>
          <Form.Control type="text" onInput={this.handleInput} />
          <Button type='submit'>Explore!</Button>
        </Form>

        {
          this.state.error
            ?
            <p>{this.state.errorMessage}</p>
            :
            <>
            <Card>
              <Card.Img src={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&center=${this.state.lat},${this.state.lon}&zoom=12`} />
              <Card.Title>{this.state.cityData.display_name}</Card.Title>
              <Card.Text>Latitude: {this.state.lat}</Card.Text>
              <Card.Text>Longitude: {this.state.lon}</Card.Text>
            </Card>
            <Weather 
              weatherData={this.state.weatherData}
            />
            </>
        }
      </>
    );
  }

}

export default App;
