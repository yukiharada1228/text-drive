# TextDrive C Version - Makefile

CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -lncurses

TARGET = textdrive
SRC = main.c

TEST_TARGET = test_game
TEST_SRC = test_game.c

.PHONY: all clean run test

all: $(TARGET)

$(TARGET): $(SRC) game.h
	$(CC) $(CFLAGS) -o $(TARGET) $(SRC) $(LDFLAGS)

$(TEST_TARGET): $(TEST_SRC) game.h
	$(CC) $(CFLAGS) -o $(TEST_TARGET) $(TEST_SRC)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET) $(TEST_TARGET)
