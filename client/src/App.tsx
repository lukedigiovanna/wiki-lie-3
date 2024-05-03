import { lazy, type Component } from 'solid-js';

import { Route, Router, useNavigate } from "@solidjs/router";
import { Client } from './Client';
import Popover from './components/Popover';
import popovers from './popovers';
import { getWikipediaURL } from './wikipedia';

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
    <>
      <Popover visible={popovers.showRoundSummary()} close={() => { popovers.setShowRoundSummary(false) }}>
        <h1 class="text-gray-800 font-bold text-center text-[1.8rem]">
          Round Over!
        </h1>
        <hr class="mb-1" />
        <div class="flex flex-col items-center">
          <a class="font-bold text-blue-500 hover:text-purple-500 active:text-purple-800 transition text-[1.75rem] font-[Libertine]" href={getWikipediaURL(popovers.roundSummary().article)} title="open in wikipedia" target="_blank" >
            {popovers.roundSummary().article}
          </a>
          <p class="text-[0.95rem] italic">
            read by <span class="font-bold">{popovers.roundSummary().reader}</span>
          </p>
          <p class="mt-2 text-center">
            {
              popovers.roundSummary().hadError ?
              <>
                Somebody left the game, so this round was cut short
              </>
              :
              <>
                <span class="font-bold not-italic">
                  {popovers.roundSummary().guesser}
                </span>
                {" "}
                {popovers.roundSummary().guessed === popovers.roundSummary().reader ? "correctly" : "incorrectly"} guessed 
                {" "}
                <span class="font-bold not-italic">
                  {popovers.roundSummary().guessed}
                </span>
              </>
            }
          </p>
        </div>
      </Popover>
      <Popover visible={popovers.showError()} close={() => { popovers.setShowError(false) }}>
        <h1 class="text-red-500 font-bold text-center text-[2rem]">
          Error!
        </h1>
        <p class="text-center">
          {popovers.errorMessage()}
        </p>
      </Popover>
      <Router>
        <Route path="/" component={HomePage} load={() => {
          Client.disconnect(); // always disconnect when we load the home page
        }}/>
        <Route path="/game/:id" component={GamePage}/>
        <Route path="*" component={Redirect}/>
      </Router>
    </>
  );
};

export default App;
