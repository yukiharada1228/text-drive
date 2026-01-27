/*
 * Q学習の実装
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "qlearning.h"

/*========== 状態のエンコード ==========*/

/*
 * ゲーム画面を「状態」に変換する
 *
 * 人間と同じように、自分の周りの壁を見る：
 *
 *     [-2][-1][自][+1][+2]
 *      ■   □   □   □   ■  ← 1行先
 *      ■   ■   □   □   □  ← 2行先
 *      ■   ■   □   □   □  ← 3行先
 *
 * 各マスが壁(1)か通路(0)かを2進数で表す
 */
int get_state(const Game *game) {
    int state = 0;
    int bit = 0;

    /* 各行を見る */
    for (int row = 0; row < VIEW_AHEAD; row++) {
        int y = PLAYER_ROW - 1 - row;  /* 見る行 */

        /* 自分の周り5マスを見る */
        for (int dx = -2; dx <= 2; dx++) {
            int x = game->playerX + dx;

            /* 壁があるかチェック */
            int is_wall = 0;
            if (y >= 0 && x >= 0 && x < COLS_COUNT) {
                is_wall = (game->rows[y][x] == '#') ? 1 : 0;
            }

            /* ビットに変換 */
            state |= (is_wall << bit);
            bit++;
        }
    }

    return state;
}

/*========== 行動の選択 ==========*/

/*
 * 最も良い行動を選ぶ
 */
int get_best_action(Agent *agent, int state) {
    int best = 0;
    if (agent->Q[state][1] > agent->Q[state][best]) best = 1;
    if (agent->Q[state][2] > agent->Q[state][best]) best = 2;
    return best;
}

/*
 * 行動を選ぶ（探索 or 活用）
 *
 * epsilon の確率でランダムに動く（探索）
 * それ以外は最も良い行動を選ぶ（活用）
 */
int choose_action(Agent *agent, int state) {
    /* ランダムな値が epsilon より小さければ探索 */
    if ((rand() / (double)RAND_MAX) < agent->epsilon) {
        return rand() % NUM_ACTIONS;  /* ランダムに選ぶ */
    }
    return get_best_action(agent, state);  /* 最良を選ぶ */
}

/*========== 行動の実行 ==========*/

/*
 * 行動を実行する
 *   0 = 左に移動
 *   1 = 待機
 *   2 = 右に移動
 */
void do_action(Game *game, int action) {
    if (action == 0) movePlayer(game, -1);
    if (action == 2) movePlayer(game, +1);
}

/*========== 報酬の計算 ==========*/

/*
 * 報酬を得る
 *   生存 → +1
 *   衝突 → -100
 */
double get_reward(Game *game) {
    if (hasCollision(game)) {
        return -100.0;
    }
    return 1.0;
}

/*========== Q値の更新 ==========*/

/*
 * Q学習の更新式：
 *   Q(s,a) ← Q(s,a) + α * (報酬 + γ * max Q(s') - Q(s,a))
 *
 *   s  = 現在の状態
 *   a  = 取った行動
 *   s' = 次の状態
 *   α  = 学習率
 *   γ  = 割引率
 */
void update_Q(Agent *agent, int state, int action, double reward, int next_state) {
    /* 次の状態での最大Q値を求める */
    double max_next_Q = agent->Q[next_state][0];
    if (agent->Q[next_state][1] > max_next_Q) max_next_Q = agent->Q[next_state][1];
    if (agent->Q[next_state][2] > max_next_Q) max_next_Q = agent->Q[next_state][2];

    /* Q値を更新 */
    double current_Q = agent->Q[state][action];
    double target = reward + GAMMA * max_next_Q;
    agent->Q[state][action] = current_Q + ALPHA * (target - current_Q);
}

/*========== 初期化・保存・読込 ==========*/

void agent_init(Agent *agent) {
    memset(agent->Q, 0, sizeof(agent->Q));
    agent->epsilon = 1.0;  /* 最初は100%探索 */
    agent->best_score = 0;
    agent->episodes = 0;
}

void agent_decay_epsilon(Agent *agent) {
    agent->epsilon *= 0.9995;  /* 徐々に探索を減らす */
    if (agent->epsilon < 0.0) agent->epsilon = 0.0;
}

int agent_save(Agent *agent, const char *filename) {
    FILE *f = fopen(filename, "wb");
    if (!f) return -1;
    fwrite(agent, sizeof(Agent), 1, f);
    fclose(f);
    return 0;
}

int agent_load(Agent *agent, const char *filename) {
    FILE *f = fopen(filename, "rb");
    if (!f) return -1;
    fread(agent, sizeof(Agent), 1, f);
    fclose(f);
    return 0;
}
