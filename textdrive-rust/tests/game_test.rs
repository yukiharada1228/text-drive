use textdrive::game::*;

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
