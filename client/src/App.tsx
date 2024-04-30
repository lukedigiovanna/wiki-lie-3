import { lazy, type Component } from 'solid-js';

import { Route, Router, useNavigate } from "@solidjs/router";
import { Client } from './Client';

// import Home from './pages/Home';
// import Game from './pages/Game';

const HomePage = lazy(() => import("./pages/HomePage"))
const GamePage = lazy(() => import("./pages/GamePage"))

const Redirect = () => {
  const navigate = useNavigate();
  navigate('/');
  return <>404 - redirecting</>;
};


const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={HomePage} load={() => {
        Client.disconnect(); // always disconnect when we load the home page
      }}/>
      <Route path="/game/:id" component={GamePage}/>
      <Route path="*" component={Redirect}/>
    </Router>
  );
};

export default App;
