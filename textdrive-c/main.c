/*
 * TextDrive - ASCII-Based Driving Game (C Terminal Version)
 *
 * Controls:
 *   Left/Right Arrow or A/D: Move car
 *   R: Restart
 *   Q: Quit
 */

#include <locale.h>
#include <ncurses.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

#include "game.h"

static long getTimeMs(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000L + tv.tv_usec / 1000L;
}

static void draw(Game *g) {
    clear();
    mvprintw(0, 0, "Distance: %d", g->distance);

    for (int y = 0; y < ROWS_COUNT; y++) {
        for (int x = 0; x < COLS_COUNT; x++) {
            const char *ch = (y == PLAYER_ROW && x == g->playerX) ? "車" :
                             (g->rows[y][x] == '#') ? "■" : "  ";
            mvaddstr(y + 2, x * 2, ch);
        }
    }

    mvprintw(ROWS_COUNT + 3, 0, "[<-][->] Move  [R] Restart  [Q] Quit");
    refresh();
}

static void drawGameOver(Game *g) {
    clear();
    mvprintw(ROWS_COUNT / 2, 2, "GAME OVER");
    mvprintw(ROWS_COUNT / 2 + 2, 0, "Distance: %d", g->distance);
    mvprintw(ROWS_COUNT / 2 + 4, 0, "[R] Restart  [Q] Quit");
    refresh();
}

static int handleInput(Game *g, int ch) {
    if (ch == 'q' || ch == 'Q')
        return 0;

    if (ch == 'r' || ch == 'R') {
        initGame(g);
        return 1;
    }

    if (g->gameOver)
        return 1;

    if (ch == KEY_LEFT || ch == 'a' || ch == 'A')
        movePlayer(g, -1);
    else if (ch == KEY_RIGHT || ch == 'd' || ch == 'D')
        movePlayer(g, 1);

    return 1;
}

int main(void) {
    setlocale(LC_ALL, "");
    srand((unsigned)time(NULL));

    initscr();
    cbreak();
    noecho();
    keypad(stdscr, TRUE);
    nodelay(stdscr, TRUE);
    curs_set(0);

    Game game;
    initGame(&game);

    long lastScroll = getTimeMs();

    while (1) {
        int ch = getch();
        if (!handleInput(&game, ch))
            break;

        if (!game.gameOver) {
            long now = getTimeMs();
            if (now - lastScroll >= SCROLL_DELAY_MS) {
                scrollCourse(&game);
                lastScroll = now;
            }
            if (hasCollision(&game))
                game.gameOver = 1;
            draw(&game);
        } else {
            drawGameOver(&game);
        }

        usleep(FRAME_DELAY_US);
    }

    endwin();
    return 0;
}
