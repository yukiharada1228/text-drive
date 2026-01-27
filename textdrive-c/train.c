/*
 * Q学習でゲームを学習するプログラム
 *
 * 学習の流れ:
 *   1. 状態を見る
 *   2. 行動を選ぶ
 *   3. 行動する
 *   4. 報酬をもらう
 *   5. Q値を更新する
 *   6. 1に戻る
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "game.h"
#include "qlearning.h"

#define NUM_EPISODES 50000   /* 学習回数 */
#define MAX_STEPS    10000   /* 1ゲームの最大ステップ */

int main(void) {
    srand((unsigned)time(NULL));

    /* エージェントを初期化 */
    Agent agent;
    agent_init(&agent);

    printf("=== Q学習スタート ===\n\n");

    /* 直近500ゲームの平均を計算するための変数 */
    int recent_scores[500];
    int recent_idx = 0;
    long recent_sum = 0;
    int recent_count = 0;

    /* 学習ループ */
    for (int episode = 1; episode <= NUM_EPISODES; episode++) {

        /* ゲームを初期化 */
        Game game;
        initGame(&game);

        /* 1ゲームをプレイ */
        for (int step = 0; step < MAX_STEPS; step++) {

            /* 1. 状態を見る */
            int state = get_state(&game);

            /* 2. 行動を選ぶ */
            int action = choose_action(&agent, state);

            /* 3. 行動する */
            do_action(&game, action);
            scrollCourse(&game);

            /* 4. 報酬をもらう */
            double reward = get_reward(&game);

            /* 5. 次の状態を見る */
            int next_state = get_state(&game);

            /* 6. Q値を更新する */
            update_Q(&agent, state, action, reward, next_state);

            /* 衝突したら終了 */
            if (hasCollision(&game)) {
                break;
            }
        }

        /* スコアを記録 */
        if (game.distance > agent.best_score) {
            agent.best_score = game.distance;
        }
        agent.episodes++;

        /* 直近平均を更新 */
        if (recent_count == 500) {
            recent_sum -= recent_scores[recent_idx];
        } else {
            recent_count++;
        }
        recent_scores[recent_idx] = game.distance;
        recent_sum += game.distance;
        recent_idx = (recent_idx + 1) % 500;

        /* 探索率を減らす */
        agent_decay_epsilon(&agent);

        /* 進捗を表示 */
        if (episode % 500 == 0) {
            double avg = (double)recent_sum / recent_count;
            printf("Episode %5d | Best: %5d | Avg: %7.1f | ε: %.3f\n",
                   episode, agent.best_score, avg, agent.epsilon);
        }
    }

    printf("\n=== 学習完了 ===\n");
    printf("最高スコア: %d\n", agent.best_score);

    /* 保存 */
    agent_save(&agent, "qtable.bin");
    printf("データを保存しました\n");

    return 0;
}
