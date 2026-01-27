# TextDrive C Version - Makefile

CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -lncurses

TARGET = textdrive
SRC = main.c qlearning.c

TEST_TARGET = test_game
TEST_SRC = test_game.c

TRAIN_TARGET = train
TRAIN_SRC = train.c qlearning.c

.PHONY: all clean run test run-train

all: $(TARGET) $(TRAIN_TARGET)

$(TARGET): $(SRC) game.h qlearning.h
	$(CC) $(CFLAGS) -o $(TARGET) $(SRC) $(LDFLAGS)

$(TRAIN_TARGET): $(TRAIN_SRC) game.h qlearning.h
	$(CC) $(CFLAGS) -o $(TRAIN_TARGET) $(TRAIN_SRC) -lm

$(TEST_TARGET): $(TEST_SRC) game.h
	$(CC) $(CFLAGS) -o $(TEST_TARGET) $(TEST_SRC)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

run: $(TARGET)
	./$(TARGET)

run-train: $(TRAIN_TARGET)
	./$(TRAIN_TARGET)

clean:
	rm -f $(TARGET) $(TEST_TARGET) $(TRAIN_TARGET)
