use rand::Rng;

pub const COLS_COUNT: usize = 9;
pub const ROWS_COUNT: usize = 15;
pub const PLAYER_ROW: usize = ROWS_COUNT - 2;
pub const SCROLL_DELAY_MS: u64 = 150;
pub const FRAME_DELAY_US: u64 = 16000;

const PATTERN_CHANGE_MIN: i32 = -1;
const PATTERN_CHANGE_MAX: i32 = 1;

/// Represents a single cell in the game grid
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Cell {
    Empty,
    Wall,
}

impl Cell {
    pub fn as_char(self) -> char {
        match self {
            Cell::Empty => ' ',
            Cell::Wall => '#',
        }
    }

    pub fn from_char(c: char) -> Self {
        match c {
            '#' => Cell::Wall,
            _ => Cell::Empty,
        }
    }

    pub fn is_wall(self) -> bool {
        matches!(self, Cell::Wall)
    }
}

/// Represents a direction for player movement
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Left,
    Right,
}

impl Direction {
    pub fn to_offset(self) -> i32 {
        match self {
            Direction::Left => -1,
            Direction::Right => 1,
        }
    }
}

const COURSE_PATTERNS: [&str; 12] = [
    "###   ###",
    "####   ##",
    "#####   #",
    "######   ",
    "#####   #",
    "####   ##",
    "###   ###",
    "##   ####",
    "#   #####",
    "   ######",
    "#   #####",
    "##   ####",
];

/// Represents the game state
#[derive(Clone)]
pub struct Game {
    pub player_x: usize,
    pub distance: i32,
    pattern: usize,
    row_count: usize,
    pub game_over: bool,
    rows: [[Cell; COLS_COUNT]; ROWS_COUNT],
}

impl Game {
    /// Creates a new game instance
    pub fn new() -> Self {
        Self {
            player_x: COLS_COUNT / 2,
            distance: 0,
            pattern: 0,
            row_count: 0,
            game_over: false,
            rows: [[Cell::Empty; COLS_COUNT]; ROWS_COUNT],
        }
    }

    /// Resets the game to initial state
    pub fn init(&mut self) {
        *self = Self::new();
    }

    /// Gets the cell at the specified position
    pub fn get_cell(&self, x: usize, y: usize) -> Cell {
        self.rows[y][x]
    }

    /// Gets the row count (visible rows)
    pub fn row_count(&self) -> usize {
        self.row_count
    }

    pub fn scroll_course(&mut self) {
        self.shift_rows_down();
        self.update_pattern();
        self.apply_pattern();
        self.update_progress();
    }

    fn shift_rows_down(&mut self) {
        self.rows.copy_within(0..ROWS_COUNT - 1, 1);
    }

    fn update_pattern(&mut self) {
        let mut rng = rand::rng();
        let change = rng.random_range(PATTERN_CHANGE_MIN..=PATTERN_CHANGE_MAX);
        let pattern_count = COURSE_PATTERNS.len() as i32;
        self.pattern = ((self.pattern as i32 + change + pattern_count) % pattern_count) as usize;
    }

    fn apply_pattern(&mut self) {
        let pattern_str = COURSE_PATTERNS[self.pattern];
        for (i, c) in pattern_str.chars().enumerate() {
            self.rows[0][i] = Cell::from_char(c);
        }
    }

    fn update_progress(&mut self) {
        if self.row_count < ROWS_COUNT {
            self.row_count += 1;
        }
        self.distance += 1;
    }

    /// Checks if the player has collided with a wall
    pub fn has_collision(&self) -> bool {
        if PLAYER_ROW >= self.row_count {
            return false;
        }
        self.rows[PLAYER_ROW][self.player_x].is_wall()
    }

    /// Moves the player in the specified direction
    pub fn move_player(&mut self, direction: Direction) -> bool {
        self.try_move_player(direction.to_offset())
    }

    /// Attempts to move the player by an offset
    fn try_move_player(&mut self, offset: i32) -> bool {
        let new_x = self.player_x as i32 + offset;
        if self.is_valid_x(new_x) {
            self.player_x = new_x as usize;
            true
        } else {
            false
        }
    }

    /// Checks if an x-coordinate is within bounds
    fn is_valid_x(&self, x: i32) -> bool {
        x >= 0 && x < COLS_COUNT as i32
    }
}

impl Default for Game {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cell_from_char() {
        assert_eq!(Cell::from_char('#'), Cell::Wall);
        assert_eq!(Cell::from_char(' '), Cell::Empty);
        assert_eq!(Cell::from_char('x'), Cell::Empty);
    }

    #[test]
    fn test_cell_as_char() {
        assert_eq!(Cell::Wall.as_char(), '#');
        assert_eq!(Cell::Empty.as_char(), ' ');
    }

    #[test]
    fn test_cell_is_wall() {
        assert!(Cell::Wall.is_wall());
        assert!(!Cell::Empty.is_wall());
    }

    #[test]
    fn test_direction_to_offset() {
        assert_eq!(Direction::Left.to_offset(), -1);
        assert_eq!(Direction::Right.to_offset(), 1);
    }

    #[test]
    fn test_game_new() {
        let game = Game::new();
        assert_eq!(game.player_x, COLS_COUNT / 2);
        assert_eq!(game.distance, 0);
        assert!(!game.game_over);
        assert_eq!(game.row_count(), 0);
    }

    #[test]
    fn test_game_init() {
        let mut game = Game::new();
        game.distance = 100;
        game.player_x = 0;
        game.game_over = true;

        game.init();

        assert_eq!(game.distance, 0);
        assert_eq!(game.player_x, COLS_COUNT / 2);
        assert!(!game.game_over);
    }

    #[test]
    fn test_move_player() {
        let mut game = Game::new();
        let initial_x = game.player_x;

        assert!(game.move_player(Direction::Right));
        assert_eq!(game.player_x, initial_x + 1);

        assert!(game.move_player(Direction::Left));
        assert_eq!(game.player_x, initial_x);
    }

    #[test]
    fn test_move_player_bounds() {
        let mut game = Game::new();
        game.player_x = 0;

        assert!(!game.move_player(Direction::Left));
        assert_eq!(game.player_x, 0);

        game.player_x = COLS_COUNT - 1;
        assert!(!game.move_player(Direction::Right));
        assert_eq!(game.player_x, COLS_COUNT - 1);
    }

    #[test]
    fn test_scroll_course() {
        let mut game = Game::new();
        let initial_distance = game.distance;

        game.scroll_course();

        assert_eq!(game.distance, initial_distance + 1);
        assert_eq!(game.row_count(), 1);
    }

    #[test]
    fn test_has_collision_before_filled() {
        let game = Game::new();
        assert!(!game.has_collision());
    }
}
