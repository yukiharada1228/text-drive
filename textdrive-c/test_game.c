/*
 * TextDrive - Unit Tests
 */

#include <stdio.h>
#include <assert.h>
#include "game.h"

static int tests_run = 0;
static int tests_passed = 0;

#define TEST(name) static void test_##name(void)
#define RUN_TEST(name) do { \
    printf("  Running %s... ", #name); \
    tests_run++; \
    test_##name(); \
    tests_passed++; \
    printf("PASSED\n"); \
} while(0)

#define ASSERT(cond) do { \
    if (!(cond)) { \
        printf("FAILED\n    Assertion failed: %s\n    at %s:%d\n", \
               #cond, __FILE__, __LINE__); \
        return; \
    } \
} while(0)

#define ASSERT_EQ(a, b) ASSERT((a) == (b))

/* Test: initGame initializes all fields correctly */
TEST(initGame_initializes_correctly) {
    Game g;
    initGame(&g);

    ASSERT_EQ(g.playerX, COLS_COUNT / 2);
    ASSERT_EQ(g.distance, 0);
    ASSERT_EQ(g.pattern, 0);
    ASSERT_EQ(g.rowCount, 0);
    ASSERT_EQ(g.gameOver, 0);

    for (int i = 0; i < ROWS_COUNT; i++) {
        for (int j = 0; j < COLS_COUNT; j++) {
            ASSERT_EQ(g.rows[i][j], ' ');
        }
    }
}

/* Test: scrollCourse increments distance */
TEST(scrollCourse_increments_distance) {
    Game g;
    initGame(&g);
    srand(42);

    scrollCourse(&g);
    ASSERT_EQ(g.distance, 1);

    scrollCourse(&g);
    ASSERT_EQ(g.distance, 2);
}

/* Test: scrollCourse increments rowCount up to ROWS_COUNT */
TEST(scrollCourse_increments_rowCount) {
    Game g;
    initGame(&g);
    srand(42);

    ASSERT_EQ(g.rowCount, 0);

    scrollCourse(&g);
    ASSERT_EQ(g.rowCount, 1);

    for (int i = 0; i < ROWS_COUNT; i++) {
        scrollCourse(&g);
    }
    ASSERT_EQ(g.rowCount, ROWS_COUNT);
}

/* Test: movePlayer moves within bounds */
TEST(movePlayer_within_bounds) {
    Game g;
    initGame(&g);
    int startX = g.playerX;

    ASSERT(movePlayer(&g, -1));
    ASSERT_EQ(g.playerX, startX - 1);

    ASSERT(movePlayer(&g, 1));
    ASSERT_EQ(g.playerX, startX);
}

/* Test: movePlayer rejects out of bounds */
TEST(movePlayer_out_of_bounds) {
    Game g;
    initGame(&g);

    g.playerX = 0;
    ASSERT(!movePlayer(&g, -1));
    ASSERT_EQ(g.playerX, 0);

    g.playerX = COLS_COUNT - 1;
    ASSERT(!movePlayer(&g, 1));
    ASSERT_EQ(g.playerX, COLS_COUNT - 1);
}

/* Test: hasCollision detects wall collision */
TEST(hasCollision_detects_wall) {
    Game g;
    initGame(&g);
    srand(42);

    for (int i = 0; i < ROWS_COUNT; i++) {
        scrollCourse(&g);
    }

    g.playerX = 0;
    ASSERT(hasCollision(&g));
}

/* Test: hasCollision returns false on road */
TEST(hasCollision_false_on_road) {
    Game g;
    initGame(&g);
    srand(42);

    for (int i = 0; i < ROWS_COUNT; i++) {
        scrollCourse(&g);
    }

    for (int x = 0; x < COLS_COUNT; x++) {
        if (g.rows[PLAYER_ROW][x] == ' ') {
            g.playerX = x;
            ASSERT(!hasCollision(&g));
            break;
        }
    }
}

/* Test: hasCollision false when rowCount < PLAYER_ROW */
TEST(hasCollision_false_before_filled) {
    Game g;
    initGame(&g);

    g.playerX = 0;
    ASSERT(!hasCollision(&g));
}

/* Test: PATTERN_COUNT is correct */
TEST(pattern_count_correct) {
    ASSERT_EQ(PATTERN_COUNT, 12);
}

/* Test: All patterns have correct length */
TEST(patterns_have_correct_length) {
    for (size_t i = 0; i < PATTERN_COUNT; i++) {
        ASSERT_EQ(strlen(COURSE_PATTERNS[i]), COLS_COUNT);
    }
}

int main(void) {
    printf("Running TextDrive unit tests...\n\n");

    RUN_TEST(initGame_initializes_correctly);
    RUN_TEST(scrollCourse_increments_distance);
    RUN_TEST(scrollCourse_increments_rowCount);
    RUN_TEST(movePlayer_within_bounds);
    RUN_TEST(movePlayer_out_of_bounds);
    RUN_TEST(hasCollision_detects_wall);
    RUN_TEST(hasCollision_false_on_road);
    RUN_TEST(hasCollision_false_before_filled);
    RUN_TEST(pattern_count_correct);
    RUN_TEST(patterns_have_correct_length);

    printf("\n%d/%d tests passed\n", tests_passed, tests_run);

    return tests_passed == tests_run ? 0 : 1;
}
