/*
 * TextDrive - ASCII-Based Driving Game (C Terminal Version)
 *
 * Controls:
 *   Left/Right Arrow or A/D: Move car
 *   M: Toggle AI mode (requires qtable.bin)
 *   R: Restart
 *   Q: Quit
 *
 * Usage:
 *   ./textdrive       - Manual play
 *   ./textdrive ai    - AI auto-play mode
 */

#include <locale.h>
#include <ncurses.h>
#include <string.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

#include "game.h"
#include "qlearning.h"

static int ai_mode = 0;
static Agent agent;
static int agent_loaded = 0;

static long getTimeMs(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000L + tv.tv_usec / 1000L;
}

static void draw(Game *g) {
    clear();
    mvprintw(0, 0, "Distance: %d  %s", g->distance,
             ai_mode ? "[AI MODE]" : "[MANUAL]");

    for (int y = 0; y < ROWS_COUNT; y++) {
        for (int x = 0; x < COLS_COUNT; x++) {
            const char *ch = (y == PLAYER_ROW && x == g->playerX) ? "車" :
                             (g->rows[y][x] == '#') ? "■" : "  ";
            mvaddstr(y + 2, x * 2, ch);
        }
    }

    if (ai_mode) {
        mvprintw(ROWS_COUNT + 3, 0, "[M] Manual  [R] Restart  [Q] Quit");
    } else {
        mvprintw(ROWS_COUNT + 3, 0, "[<-][->] Move  [M] AI  [R] Restart  [Q] Quit");
    }
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

    if (ch == 'm' || ch == 'M') {
        if (!agent_loaded) {
            if (agent_load(&agent, "qtable.bin") == 0) {
                agent_loaded = 1;
            }
        }
        if (agent_loaded) {
            ai_mode = !ai_mode;
        }
        return 1;
    }

    if (g->gameOver)
        return 1;

    if (!ai_mode) {
        if (ch == KEY_LEFT || ch == 'a' || ch == 'A')
            movePlayer(g, -1);
        else if (ch == KEY_RIGHT || ch == 'd' || ch == 'D')
            movePlayer(g, 1);
    }

    return 1;
}

int main(int argc, char *argv[]) {
    setlocale(LC_ALL, "");
    srand((unsigned)time(NULL));

    /* Check for AI mode argument */
    if (argc > 1 && strcmp(argv[1], "ai") == 0) {
        if (agent_load(&agent, "qtable.bin") == 0) {
            agent_loaded = 1;
            ai_mode = 1;
        }
    }

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
                /* AI makes decision before scroll */
                if (ai_mode && agent_loaded) {
                    int state = get_state(&game);
                    int action = get_best_action(&agent, state);
                    do_action(&game, action);
                }
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
