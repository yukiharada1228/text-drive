use textdrive::game::Game;
use textdrive::qlearning::{choose_action, do_action, get_reward, get_state, update_q, Agent};

const NUM_EPISODES: usize = 50000;
const MAX_STEPS: usize = 10000;
const REPORT_INTERVAL: usize = 500;
const RECENT_WINDOW_SIZE: usize = 500;

fn main() {
    let mut agent = Agent::new();
    let mut stats = TrainingStats::new(RECENT_WINDOW_SIZE);

    println!("=== Q学習スタート ===\n");

    for episode in 1..=NUM_EPISODES {
        let final_distance = run_episode(&mut agent);

        stats.update(final_distance, &agent);
        agent.decay_epsilon();

        if episode % REPORT_INTERVAL == 0 {
            stats.print_progress_with_agent(episode, &agent);
        }
    }

    println!("\n=== 学習完了 ===");
    println!("最高スコア: {}", agent.best_score);

    agent
        .save("qtable.bin")
        .expect("データの保存に失敗しました");
    println!("データを保存しました");
}

fn run_episode(agent: &mut Agent) -> i32 {
    let mut game = Game::new();

    for _step in 0..MAX_STEPS {
        let state = get_state(&game);
        let action = choose_action(agent, state);

        do_action(&mut game, action);
        game.scroll_course();

        let reward = get_reward(&game);
        let next_state = get_state(&game);

        update_q(agent, state, action, reward, next_state);

        if game.has_collision() {
            break;
        }
    }

    if game.distance > agent.best_score {
        agent.best_score = game.distance;
    }
    agent.episodes += 1;

    game.distance
}

struct TrainingStats {
    recent_scores: Vec<i32>,
    recent_idx: usize,
    recent_sum: i64,
    recent_count: usize,
    window_size: usize,
}

impl TrainingStats {
    fn new(window_size: usize) -> Self {
        Self {
            recent_scores: vec![0; window_size],
            recent_idx: 0,
            recent_sum: 0,
            recent_count: 0,
            window_size,
        }
    }

    fn update(&mut self, score: i32, _agent: &Agent) {
        if self.recent_count == self.window_size {
            self.recent_sum -= self.recent_scores[self.recent_idx] as i64;
        } else {
            self.recent_count += 1;
        }

        self.recent_scores[self.recent_idx] = score;
        self.recent_sum += score as i64;
        self.recent_idx = (self.recent_idx + 1) % self.window_size;
    }

    fn average(&self) -> f64 {
        if self.recent_count == 0 {
            0.0
        } else {
            self.recent_sum as f64 / self.recent_count as f64
        }
    }

    fn print_progress_with_agent(&self, episode: usize, agent: &Agent) {
        println!(
            "Episode {:5} | Best: {:5} | Avg: {:7.1} | ε: {:.3}",
            episode,
            agent.best_score,
            self.average(),
            agent.epsilon
        );
    }
}
