import { lazy, type Component } from 'solid-js';

import { Route, Router } from "@solidjs/router";

// import Home from './pages/Home';
// import Game from './pages/Game';

const Home = lazy(() => import("./pages/Home"))
const Game = lazy(() => import("./pages/Game"))

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home}/>
      <Route path="/game/:id" component={Game}/>
    </Router>
  );
};

export default App;
