import { lazy, type Component } from 'solid-js';

import { Route, Router } from "@solidjs/router";

// import Home from './pages/Home';
// import Game from './pages/Game';

const HomePage = lazy(() => import("./pages/HomePage"))
const GamePage = lazy(() => import("./pages/GamePage"))

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={HomePage}/>
      <Route path="/game/:id" component={GamePage}/>
    </Router>
  );
};

export default App;
