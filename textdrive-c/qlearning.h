/*
 * シンプルなQ学習
 *
 * Q学習とは：
 *   「この状態でこの行動をしたら、どれくらい良いか」を学習する
 *   Q[状態][行動] = 期待される報酬
 */

#ifndef QLEARNING_H
#define QLEARNING_H

#include "game.h"

/*========== 設定 ==========*/

#define NUM_ACTIONS  3      /* 行動の数: 左, 待機, 右 */
#define VIEW_AHEAD   3      /* 何行先まで見るか */
#define VIEW_WIDTH   5      /* 視野の幅（自分の左右2マスずつ） */
#define STATE_SIZE   32768  /* 状態の総数 = 2^(3*5) = 2^15 */

/* 学習パラメータ */
#define ALPHA   0.2   /* 学習率: 新しい経験をどれだけ重視するか */
#define GAMMA   0.95  /* 割引率: 将来の報酬をどれだけ重視するか */

/*========== Q学習エージェント ==========*/

typedef struct {
    double Q[STATE_SIZE][NUM_ACTIONS];  /* Qテーブル: Q[状態][行動] = 価値 */
    double epsilon;                      /* 探索率: ランダムに動く確率 */
    int best_score;                      /* 最高スコア */
    unsigned long episodes;              /* 学習したエピソード数 */
} Agent;

/*========== 関数宣言 ==========*/

/* 状態のエンコード */
int get_state(const Game *game);

/* 行動の選択 */
int get_best_action(Agent *agent, int state);
int choose_action(Agent *agent, int state);

/* 行動の実行 */
void do_action(Game *game, int action);

/* 報酬の計算 */
double get_reward(Game *game);

/* Q値の更新 */
void update_Q(Agent *agent, int state, int action, double reward, int next_state);

/* 初期化・保存・読込 */
void agent_init(Agent *agent);
void agent_decay_epsilon(Agent *agent);
int agent_save(Agent *agent, const char *filename);
int agent_load(Agent *agent, const char *filename);

#endif
