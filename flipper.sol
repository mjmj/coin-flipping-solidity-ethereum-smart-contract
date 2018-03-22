contract Flipper {

    enum GameState {noWager, wagerMade, wagerAccepted}
    // defined a datatype called gamestate that is an enumeration that
    // only accepts 3 value types. Great for state-machines

    GameState public currentState;

    function Flipper() {
        currentState = GameState.noWager;
    }

    function transitionGameState(bytes32 targetState) return (bool) {
        if (targetState == "noWager") {
            currentState = GameState.noWager;
            return true;
        }
        else if (targetState == 'wagerMade') {
            currentState = GameState.wagerMade;
            return true;
        }
        else if (targetState == 'wagerAccepted') {
            currentState == GameState.wagerAccepted;
            return true;
        }

        return false;
    }
}