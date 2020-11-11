import React, { Component } from 'react';
import { Button, Tab, Tabs, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import './App.css';


class App extends Component {
   constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.getSellerReview = this.getSellerReview.bind(this);
      this.state = {
         name: ""
      };
   }


   handleChange(event) {

      this.setState({ name: event.target.value });

   }

   getSellerReview() {

      (async () => {
         const rawResponse = await fetch('http://localhost:3001/getSellerReviews', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: this.state.name })
         });

         const status = await rawResponse.status;
         console.log(status);

      
      })();
   }

   render() {


      return (

         <div className="App">
            <header className="App-header">
               <p class="logo">My Mini Trader</p>
               <div>
                  <label style={{ color: "white" }}>Get the seller name</label>
                  <input id="sellerReview" onChange={this.handleChange}></input>
                  <button type="button" style={{ width: "40%" }, { position: "relative" }} onClick={this.getSellerReview()} class="btn btn-outline-secondary btn-block" >Get Review</button>
               </div>

               <div class="adjust">



                  <form class="mainForm">
                     <Tabs defaultActiveKey="profile" class="nav nav-fill bg-secondary" id="nav-tab" >
                        <Tab eventKey="home" title="Login" class="tab">

                           <div class="form-group">
                              <label class="text-email">Email</label>
                              <input type="text" id="emailBox" class="form-control" aria-describedby="walletIDHelp" placeholder="Enter your walletID here"
                              ></input>
                           </div>

                           <div class="form-group">
                              <label class="text-password">Password</label>
                              <input type="password" id="passwordBox" class="form-control" placeholder="Enter your password here"></input>
                           </div>

                           <div class="loginButton">
                              <button type="button" class="btn btn-outline-secondary btn-block" >Login</button>
                           </div>

                        </Tab>

                        <Tab eventKey="profile" title="Register" class="tab">

                           <div class="form-group">
                              <label class="text-email">Name </label>
                              <input type="text" id="emailBox" class="form-control" aria-describedby="walletIDHelp" placeholder="Enter your walletID here"
                              ></input>
                           </div>

                           <div class="form-group">
                              <label class="text-password" style={{ left: -95 }}>Email </label>
                              <input type="password" id="passwordBox" class="form-control" placeholder="Enter your password here"></input>
                           </div>

                           <div class="form-group">
                              <label class="text-password">Password</label>
                              <input type="password" id="passwordBox" class="form-control" placeholder="Enter your password here"></input>
                           </div>

                           <div class="loginButton">
                              <button type="button" class="btn btn-outline-secondary btn-block" >Register</button>
                           </div>
                        </Tab>


                     </Tabs>
                  </form>

               </div>

            </header>

         </div>


      );
   }
}

export default App;
