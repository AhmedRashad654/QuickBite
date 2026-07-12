import { Knex } from 'knex';
import { AgentBalance } from '../types.js';
import { db } from '../../../lib/knex/knex.js';

const COLUMNS = ['agent_id', 'currency', 'balance', 'updated_at'] as const;

export async function findByAgent(agentId: number, conn: Knex = db): Promise<AgentBalance[]> {
  const rows = await conn('agent_balances')
    .select(COLUMNS as unknown as string[])
    .where({ agent_id: agentId });
  return rows;
}

export async function getForUpdate(
  agentId: number,
  currency: string,
  conn: Knex = db,
): Promise<AgentBalance | null> {
  const row = await conn('agent_balances')
    .select(COLUMNS as unknown as string[])
    .where({ agent_id: agentId, currency })
    .forUpdate()
    .first();
  return row || null;
}

export async function upsertIncrement(
  input: { agent_id: number; currency: string; delta: number },
  conn: Knex = db,
): Promise<AgentBalance> {
  const [row] = await conn
    .raw(
      `INSERT INTO agent_balances (agent_id, currency, balance, updated_at)
         VALUES (?, ?, ?, NOW())
         ON CONFLICT (agent_id, currency)
         DO UPDATE SET balance = agent_balances.balance + EXCLUDED.balance,
                       updated_at = NOW()
         RETURNING ${COLUMNS.join(',')}`,
      [input.agent_id, input.currency, input.delta],
    )
    .then((res: any) => res.rows ?? res);
  return row;
}

export async function decrementIfSufficient(
  input: { agentId: number; currency: string; amount: number },
  conn: Knex = db,
): Promise<AgentBalance | null> {
  const [row] = await conn('agent_balances')
    .where({ agent_id: input.agentId, currency: input.currency })
    .where('balance', '>=', input.amount)
    .update({
      balance: conn.raw('balance - ?', [input.amount]),
      updated_at: conn.fn.now(),
    })
    .returning(COLUMNS as unknown as string[]);
  return row || null;
}
