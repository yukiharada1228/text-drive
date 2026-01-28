use crate::error::Result;
use crate::game::{Cell, Game, COLS_COUNT, PLAYER_ROW};
use rand::Rng;
use std::fs::File;
use std::io::{Read, Write};

pub const NUM_ACTIONS: usize = 3;
const VIEW_AHEAD: usize = 3;
const VIEW_RANGE: i32 = 2;
pub const STATE_SIZE: usize = 32768; // 2^15

const ALPHA: f64 = 0.2;
const GAMMA: f64 = 0.95;
const EPSILON_DECAY: f64 = 0.9995;

const COLLISION_REWARD: f64 = -100.0;
const SURVIVAL_REWARD: f64 = 1.0;

/// Represents an action the agent can take
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(usize)]
pub enum Action {
    Left = 0,
    Stay = 1,
    Right = 2,
}

impl Action {
    /// Converts a usize to an Action
    pub fn from_usize(value: usize) -> Option<Self> {
        match value {
            0 => Some(Action::Left),
            1 => Some(Action::Stay),
            2 => Some(Action::Right),
            _ => None,
        }
    }

    /// Returns all possible actions
    pub fn all() -> [Action; NUM_ACTIONS] {
        [Action::Left, Action::Stay, Action::Right]
    }
}

/// Q-learning agent that learns to play the game
#[repr(C)]
pub struct Agent {
    pub q: [[f64; NUM_ACTIONS]; STATE_SIZE],
    pub epsilon: f64,
    pub best_score: i32,
    pub episodes: u64,
}

impl Agent {
    /// Creates a new agent with default values
    pub fn new() -> Self {
        Agent {
            q: [[0.0; NUM_ACTIONS]; STATE_SIZE],
            epsilon: 1.0,
            best_score: 0,
            episodes: 0,
        }
    }

    /// Decays the epsilon value for exploration vs exploitation
    pub fn decay_epsilon(&mut self) {
        self.epsilon = (self.epsilon * EPSILON_DECAY).max(0.0);
    }

    /// Saves the agent's Q-table to a file
    pub fn save(&self, filename: &str) -> Result<()> {
        let mut file = File::create(filename)?;

        for state in 0..STATE_SIZE {
            for action in 0..NUM_ACTIONS {
                write_f64(&mut file, self.q[state][action])?;
            }
        }

        write_f64(&mut file, self.epsilon)?;
        write_i32(&mut file, self.best_score)?;
        write_u64(&mut file, self.episodes)?;

        Ok(())
    }

    /// Loads the agent's Q-table from a file
    pub fn load(filename: &str) -> Result<Self> {
        let mut file = File::open(filename)?;
        let mut agent = Agent::new();

        for state in 0..STATE_SIZE {
            for action in 0..NUM_ACTIONS {
                agent.q[state][action] = read_f64(&mut file)?;
            }
        }

        agent.epsilon = read_f64(&mut file)?;
        agent.best_score = read_i32(&mut file)?;
        agent.episodes = read_u64(&mut file)?;

        Ok(agent)
    }
}

impl Default for Agent {
    fn default() -> Self {
        Self::new()
    }
}

/// Encodes the current game state into a numeric representation
///
/// The state is encoded as a bit pattern representing walls in the player's view
pub fn get_state(game: &Game) -> usize {
    let mut state = 0;
    let mut bit = 0;

    for row in 0..VIEW_AHEAD {
        let y = PLAYER_ROW as i32 - 1 - row as i32;

        for dx in -VIEW_RANGE..=VIEW_RANGE {
            let x = game.player_x as i32 + dx;

            if is_wall_at(game, x, y) {
                state |= 1 << bit;
            }
            bit += 1;
        }
    }

    state
}

/// Checks if there's a wall at the given coordinates
fn is_wall_at(game: &Game, x: i32, y: i32) -> bool {
    if y < 0 || x < 0 || x >= COLS_COUNT as i32 {
        return false;
    }
    game.get_cell(x as usize, y as usize) == Cell::Wall
}

/// Returns the best action for the given state based on Q-values
pub fn get_best_action(agent: &Agent, state: usize) -> Action {
    Action::all()
        .iter()
        .max_by(|&&a, &&b| {
            agent.q[state][a as usize]
                .partial_cmp(&agent.q[state][b as usize])
                .unwrap_or(std::cmp::Ordering::Equal)
        })
        .copied()
        .unwrap_or(Action::Stay)
}

/// Chooses an action using epsilon-greedy strategy
pub fn choose_action(agent: &Agent, state: usize) -> Action {
    let mut rng = rand::thread_rng();
    if rng.gen::<f64>() < agent.epsilon {
        let action_idx = rng.gen_range(0..NUM_ACTIONS);
        Action::from_usize(action_idx).unwrap_or(Action::Stay)
    } else {
        get_best_action(agent, state)
    }
}

/// Executes the given action on the game
pub fn do_action(game: &mut Game, action: Action) {
    use crate::game::Direction;

    match action {
        Action::Left => {
            game.move_player(Direction::Left);
        }
        Action::Right => {
            game.move_player(Direction::Right);
        }
        Action::Stay => {}
    }
}

/// Calculates the reward for the current game state
pub fn get_reward(game: &Game) -> f64 {
    if game.has_collision() {
        COLLISION_REWARD
    } else {
        SURVIVAL_REWARD
    }
}

/// Updates the Q-value using the Q-learning algorithm
pub fn update_q(agent: &mut Agent, state: usize, action: Action, reward: f64, next_state: usize) {
    let max_next_q = agent.q[next_state]
        .iter()
        .copied()
        .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
        .unwrap_or(0.0);

    let action_idx = action as usize;
    let current_q = agent.q[state][action_idx];
    let target = reward + GAMMA * max_next_q;
    agent.q[state][action_idx] = current_q + ALPHA * (target - current_q);
}

fn read_f64(file: &mut File) -> Result<f64> {
    let mut buf = [0u8; 8];
    file.read_exact(&mut buf)?;
    Ok(f64::from_le_bytes(buf))
}

fn read_i32(file: &mut File) -> Result<i32> {
    let mut buf = [0u8; 4];
    file.read_exact(&mut buf)?;
    Ok(i32::from_le_bytes(buf))
}

fn read_u64(file: &mut File) -> Result<u64> {
    let mut buf = [0u8; 8];
    file.read_exact(&mut buf)?;
    Ok(u64::from_le_bytes(buf))
}

fn write_f64(file: &mut File, value: f64) -> Result<()> {
    file.write_all(&value.to_le_bytes())?;
    Ok(())
}

fn write_i32(file: &mut File, value: i32) -> Result<()> {
    file.write_all(&value.to_le_bytes())?;
    Ok(())
}

fn write_u64(file: &mut File, value: u64) -> Result<()> {
    file.write_all(&value.to_le_bytes())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

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

        // No collision - should return survival reward
        assert_eq!(get_reward(&game), SURVIVAL_REWARD);
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
}
