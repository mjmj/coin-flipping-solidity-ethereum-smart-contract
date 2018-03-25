contract Flipper {

  enum GameState {noWager, wagerMade, wagerAccepted}
  GameState public currentState;

  modifier onlyState(GameState expectedState) { if(expectedState == currentState) { _; } else { throw; } }

  function Flipper() {
    currentState = GameState.noWager;
  }

  function makeWager() onlyState(GameState.noWager) returns (bool) {
    // ...
    currentState = GameState.wagerMade;
    return true;
  }

  function acceptWager() onlyState(GameState.wagerMade) returns (bool) {
    // ...
    currentState = GameState.wagerAccepted;
    return true;
  }

  function resolveBet() onlyState(GameState.wagerAccepted) returns (bool) {
    // ...
    currentState = GameState.noWager;
    return true;
  }

}