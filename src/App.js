import React from 'react';
import axios from 'axios';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      cityData: [],
      error: false,
      errorMessage: ''
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
      let url = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&q=${this.state.city}&format=json`

      let cityData = await axios.get(url);

      this.setState({
        cityData: cityData.data[0],
        error: false
      });
    } catch (error) {
      console.log(error);
      this.setState({
        error: true,
        errorMessage: error.messsage
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
            <Card>
              <Card.Img src={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&center=${this.state.cityData.lat},${this.state.cityData.lon}&zoom=12`} />
              <Card.Title>{this.state.cityData.display_name}</Card.Title>
              <Card.Text>Latitude: {this.state.cityData.lat}</Card.Text>
              <Card.Text>Longitude: {this.state.cityData.lon}</Card.Text>
            </Card>
        }
      </>
    );
  }

}

export default App;
