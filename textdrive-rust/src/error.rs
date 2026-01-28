use std::fmt;
use std::io;

/// Custom error type for the game
#[derive(Debug)]
pub enum GameError {
    /// I/O error occurred
    Io(io::Error),
    /// Failed to load agent data
    InvalidAgentData(String),
}

impl fmt::Display for GameError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            GameError::Io(err) => write!(f, "I/O error: {}", err),
            GameError::InvalidAgentData(msg) => write!(f, "Invalid agent data: {}", msg),
        }
    }
}

impl std::error::Error for GameError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            GameError::Io(err) => Some(err),
            GameError::InvalidAgentData(_) => None,
        }
    }
}

impl From<io::Error> for GameError {
    fn from(err: io::Error) -> Self {
        GameError::Io(err)
    }
}

pub type Result<T> = std::result::Result<T, GameError>;
