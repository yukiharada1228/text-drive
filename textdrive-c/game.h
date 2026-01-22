/*
 * TextDrive - Game Logic Header
 * Separated for testability
 */

#ifndef GAME_H
#define GAME_H

#include <stdlib.h>
#include <string.h>

#define COLS_COUNT 9
#define ROWS_COUNT 15
#define PLAYER_ROW (ROWS_COUNT - 2)
#define SCROLL_DELAY_MS 150
#define FRAME_DELAY_US 16000

static const char *COURSE_PATTERNS[] = {
    "###   ###", "####   ##", "#####   #", "######   ",
    "#####   #", "####   ##", "###   ###", "##   ####",
    "#   #####", "   ######", "#   #####", "##   ####",
};
#define PATTERN_COUNT (sizeof(COURSE_PATTERNS) / sizeof(COURSE_PATTERNS[0]))

typedef struct {
    int playerX;
    int distance;
    int pattern;
    int rowCount;
    int gameOver;
    char rows[ROWS_COUNT][COLS_COUNT + 1];
} Game;

static inline void initGame(Game *g) {
    g->playerX = COLS_COUNT / 2;
    g->distance = 0;
    g->pattern = 0;
    g->rowCount = 0;
    g->gameOver = 0;
    for (int i = 0; i < ROWS_COUNT; i++) {
        memset(g->rows[i], ' ', COLS_COUNT);
        g->rows[i][COLS_COUNT] = '\0';
    }
}

static inline void scrollCourse(Game *g) {
    for (int i = ROWS_COUNT - 1; i > 0; i--)
        strcpy(g->rows[i], g->rows[i - 1]);

    int change = (rand() % 3) - 1;
    g->pattern = (g->pattern + change + PATTERN_COUNT) % PATTERN_COUNT;
    strcpy(g->rows[0], COURSE_PATTERNS[g->pattern]);

    if (g->rowCount < ROWS_COUNT)
        g->rowCount++;
    g->distance++;
}

static inline int hasCollision(Game *g) {
    return PLAYER_ROW < g->rowCount && g->rows[PLAYER_ROW][g->playerX] == '#';
}

static inline int movePlayer(Game *g, int direction) {
    int newX = g->playerX + direction;
    if (newX >= 0 && newX < COLS_COUNT) {
        g->playerX = newX;
        return 1;
    }
    return 0;
}

#endif /* GAME_H */
