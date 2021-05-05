import React, { Component } from "react";
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Clarifai from  'clarifai';
import Rank from './Components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
  apiKey: '1ee944cada284487b4bb826ff6bec6c0'
});

const particlesOptions= {
  particles: {
    number:{
      value:80,
      density: {
        enable:true,
        value_area: 800
      }
    }
  },
  interactivity:{
    detect_on:'canvas',
    events:{
        onhover:{
        enable:true,
        mode:'repulse'}
    }
  }
}

class App extends Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) =>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions.map( region => region.region_info.bounding_box)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFace.map((face) => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }      
    });
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })

        })
          .then(response => response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user, {entries: count}))
          })

      }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
      const {isSignedIn, imageUrl, route, box} = this.state;
      return (
    <div className="App">
     <Particles  className='particles'
        params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn}  onRouteChange={this.onRouteChange} />
      {route === 'home' 
       ? <div>
          <Logo />
          <Rank 
            name={this.state.user.name}
            entries={this.state.user.entries}
          />
          <ImageLinkForm 
            onInputChange={this.onInputChange}  
            onPictureSubmit={this.onPictureSubmit}
          /> 
          <FaceRecognition  box= {box} imageUrl={imageUrl}/>
         </div>
        : (
          route === 'signin'
          ?<Signin  
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange} 
           />
          :<Register 
          loadUser={this.loadUser}
          onRouteChange={this.onRouteChange} />
        )
       }
    </div>
  );
  }

}

export default App;
//'c0c0ac362b03416da06ab3fa36fb58e3'