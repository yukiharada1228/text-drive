use std::error::Error;
use std::io;
use textdrive::error::GameError;

#[test]
fn test_game_error_from_io_error() {
    let io_err = io::Error::new(io::ErrorKind::NotFound, "file not found");
    let game_err: GameError = io_err.into();

    match game_err {
        GameError::Io(_) => {}
        _ => panic!("Expected GameError::Io"),
    }
}

#[test]
fn test_game_error_display() {
    let err = GameError::InvalidAgentData("test error".to_string());
    let display = format!("{}", err);

    assert!(display.contains("Invalid agent data"));
    assert!(display.contains("test error"));
}

#[test]
fn test_game_error_source() {
    let io_err = io::Error::new(io::ErrorKind::NotFound, "file not found");
    let game_err = GameError::Io(io_err);

    assert!(game_err.source().is_some());
}
