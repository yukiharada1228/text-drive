use pancurses::{endwin, initscr, noecho, Input, Window};
use std::env;
use std::time::{Duration, Instant};
use textdrive::game::{
    Cell, Direction, Game, COLS_COUNT, FRAME_DELAY_US, PLAYER_ROW, ROWS_COUNT, SCROLL_DELAY_MS,
};
use textdrive::qlearning::{do_action, get_best_action, get_state, Agent};

const QTABLE_FILE: &str = "qtable.bin";

struct GameState {
    game: Game,
    ai_mode: bool,
    agent: Option<Agent>,
    last_scroll: Instant,
}

impl GameState {
    fn new() -> Self {
        Self {
            game: Game::new(),
            ai_mode: false,
            agent: None,
            last_scroll: Instant::now(),
        }
    }

    fn with_ai(agent: Agent) -> Self {
        Self {
            game: Game::new(),
            ai_mode: true,
            agent: Some(agent),
            last_scroll: Instant::now(),
        }
    }

    fn load_agent(&mut self) -> bool {
        if self.agent.is_none() {
            if let Ok(loaded_agent) = Agent::load(QTABLE_FILE) {
                self.agent = Some(loaded_agent);
                return true;
            }
        }
        false
    }

    fn toggle_ai_mode(&mut self) {
        if self.agent.is_some() {
            self.ai_mode = !self.ai_mode;
        }
    }

    fn update(&mut self) {
        if self.game.game_over {
            return;
        }

        let now = Instant::now();
        if now.duration_since(self.last_scroll) >= Duration::from_millis(SCROLL_DELAY_MS) {
            if self.ai_mode {
                if let Some(ref agent) = self.agent {
                    let state = get_state(&self.game);
                    let action = get_best_action(agent, state);
                    do_action(&mut self.game, action);
                }
            }

            self.game.scroll_course();
            self.last_scroll = now;

            if self.game.has_collision() {
                self.game.game_over = true;
            }
        }
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let mut state = if args.len() > 1 && args[1] == "ai" {
        Agent::load(QTABLE_FILE)
            .map(GameState::with_ai)
            .unwrap_or_else(|_| GameState::new())
    } else {
        GameState::new()
    };

    let window = init_terminal();

    game_loop(&window, &mut state);

    endwin();
}

fn init_terminal() -> Window {
    let window = initscr();
    pancurses::cbreak();
    noecho();
    window.keypad(true);
    window.nodelay(true);
    pancurses::curs_set(0);
    window
}

fn game_loop(window: &Window, state: &mut GameState) {
    loop {
        if let Some(input) = window.getch() {
            if !handle_input(state, input) {
                break;
            }
        }

        state.update();

        if state.game.game_over {
            draw_game_over(window, &state.game);
        } else {
            draw(window, &state.game, state.ai_mode);
        }

        std::thread::sleep(Duration::from_micros(FRAME_DELAY_US));
    }
}

fn handle_input(state: &mut GameState, input: Input) -> bool {
    match input {
        Input::Character('q') | Input::Character('Q') => return false,
        Input::Character('r') | Input::Character('R') => {
            state.game.init();
            return true;
        }
        Input::Character('m') | Input::Character('M') => {
            state.load_agent();
            state.toggle_ai_mode();
            return true;
        }
        _ => {}
    }

    if state.game.game_over || state.ai_mode {
        return true;
    }

    match input {
        Input::KeyLeft | Input::Character('a') | Input::Character('A') => {
            state.game.move_player(Direction::Left);
        }
        Input::KeyRight | Input::Character('d') | Input::Character('D') => {
            state.game.move_player(Direction::Right);
        }
        _ => {}
    }

    true
}

fn draw(window: &Window, game: &Game, ai_mode: bool) {
    window.clear();

    draw_header(window, game, ai_mode);
    draw_game_field(window, game);
    draw_controls(window, ai_mode);

    window.refresh();
}

fn draw_header(window: &Window, game: &Game, ai_mode: bool) {
    let mode_text = if ai_mode { "[AI MODE]" } else { "[MANUAL]" };
    window.mvprintw(0, 0, format!("Distance: {}  {}", game.distance, mode_text));
}

fn draw_game_field(window: &Window, game: &Game) {
    const DISPLAY_OFFSET: i32 = 2;
    const CELL_WIDTH: i32 = 2;

    for y in 0..ROWS_COUNT {
        for x in 0..COLS_COUNT {
            let ch = get_cell_char(game, x, y);
            let y_pos = y as i32 + DISPLAY_OFFSET;
            let x_pos = x as i32 * CELL_WIDTH;
            window.mvaddstr(y_pos, x_pos, ch);
        }
    }
}

fn get_cell_char(game: &Game, x: usize, y: usize) -> &'static str {
    if y == PLAYER_ROW && x == game.player_x {
        "車"
    } else if game.get_cell(x, y) == Cell::Wall {
        "■"
    } else {
        "  "
    }
}

fn draw_controls(window: &Window, ai_mode: bool) {
    let controls = if ai_mode {
        "[M] Manual  [R] Restart  [Q] Quit"
    } else {
        "[<-][->] Move  [M] AI  [R] Restart  [Q] Quit"
    };
    window.mvprintw((ROWS_COUNT + 3) as i32, 0, controls);
}

fn draw_game_over(window: &Window, game: &Game) {
    window.clear();

    let center_y = (ROWS_COUNT / 2) as i32;
    window.mvprintw(center_y, 2, "GAME OVER");
    window.mvprintw(center_y + 2, 0, format!("Distance: {}", game.distance));
    window.mvprintw(center_y + 4, 0, "[R] Restart  [Q] Quit");

    window.refresh();
}
