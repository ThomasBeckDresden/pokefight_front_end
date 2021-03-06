import React from "react";
import { Switch, Route } from "react-router-dom";
import ChooseFighter from "./components/ChooseFighter";
import FighterPreview from "./components/FighterPreview";

// import FighterDetailed from "./src/components/FighterDetailed";
import Fight from "./components/Fight";
export default function Main({
  pokemonList,
  backendEntryPoint,
  contenders,
  setContenders,
  fightResult,
  determineWinner,
}) {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <ChooseFighter pokemonList={pokemonList} />
        </Route>
        <Route path="/fight/">
          <Fight
            contenders={contenders}
            fightResult={fightResult}
            determineWinner={determineWinner}
          />
        </Route>
        <Route path="/:id">
          <FighterPreview
            backendEntryPoint={backendEntryPoint}
            setContenders={setContenders}
          />
        </Route>

        <Route path="/:id/:info">{/* <FighterDetailed /> */}</Route>
      </Switch>
    </>
  );
}
