use textdrive::game::Game;
use textdrive::qlearning::*;

#[test]
fn test_action_from_usize() {
    assert_eq!(Action::from_usize(0), Some(Action::Left));
    assert_eq!(Action::from_usize(1), Some(Action::Stay));
    assert_eq!(Action::from_usize(2), Some(Action::Right));
    assert_eq!(Action::from_usize(3), None);
}

#[test]
fn test_action_all() {
    let actions = Action::all();
    assert_eq!(actions.len(), NUM_ACTIONS);
    assert_eq!(actions[0], Action::Left);
    assert_eq!(actions[1], Action::Stay);
    assert_eq!(actions[2], Action::Right);
}

#[test]
fn test_agent_new() {
    let agent = Agent::new();
    assert_eq!(agent.epsilon, 1.0);
    assert_eq!(agent.best_score, 0);
    assert_eq!(agent.episodes, 0);
}

#[test]
fn test_agent_decay_epsilon() {
    let mut agent = Agent::new();
    let initial = agent.epsilon;

    agent.decay_epsilon();

    assert!(agent.epsilon < initial);
    assert!(agent.epsilon >= 0.0);
}

#[test]
fn test_get_reward() {
    let game = Game::new();

    // No collision - should return survival reward (1.0)
    assert_eq!(get_reward(&game), 1.0);
}

#[test]
fn test_get_state() {
    let game = Game::new();
    let state = get_state(&game);

    // State should be within valid range
    assert!(state < STATE_SIZE);
}

#[test]
fn test_do_action() {
    let mut game = Game::new();
    let initial_x = game.player_x;

    do_action(&mut game, Action::Left);
    assert_eq!(game.player_x, initial_x - 1);

    do_action(&mut game, Action::Right);
    assert_eq!(game.player_x, initial_x);

    do_action(&mut game, Action::Stay);
    assert_eq!(game.player_x, initial_x);
}

#[test]
fn test_update_q() {
    let mut agent = Agent::new();
    let state = 0;
    let action = Action::Left;
    let reward = 1.0;
    let next_state = 1;

    let initial_q = agent.q[state][action as usize];

    update_q(&mut agent, state, action, reward, next_state);

    // Q-value should have changed
    assert_ne!(agent.q[state][action as usize], initial_q);
}
