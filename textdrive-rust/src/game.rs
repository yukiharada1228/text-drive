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
