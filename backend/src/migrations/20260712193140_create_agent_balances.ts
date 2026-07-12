import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE agent_balances (
      agent_id  BIGINT NOT NULL,
      currency  TEXT NOT NULL,
      balance   INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (agent_id, currency),
      CONSTRAINT fk_agent_balances_agent_id FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS agent_balances`);
}
