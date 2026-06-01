import { Knex } from 'knex';
import { Restaurant } from '../type.js';
import { db } from '../../../lib/knex/knex.js';

const RESTAURANT_COLUMNS = [
  'id',
  'owner_id',
  'name',
  'logo_url',
  'status',
  'primary_country',
  'created_at',
  'updated_at',
  'status_updated_at',
];

export async function findAllRestaurants(): Promise<Restaurant[]> {
  const rows = await db('restaurants').select(RESTAURANT_COLUMNS);
  return rows;
}

export async function findRestaurantById(id: number): Promise<Restaurant | null> {
  const row = await db('restaurants').select(RESTAURANT_COLUMNS).where('id', id).first();
  return row || null;
}

// find restaurant by id

export async function createRestaurant(
  data: Partial<Restaurant>,
  conn: Knex = db,
): Promise<Restaurant> {
  const [row] = await conn('restaurants')
    .insert({
      owner_id: data.owner_id,
      name: data.name,
      logo_url: data.logo_url,
      status: data.status,
      primary_country: data.primary_country,
    })
    .returning(RESTAURANT_COLUMNS);
  return row;
}

export async function updateRestaurant(id: number, data: Partial<Restaurant>): Promise<Restaurant> {
  const [row] = await db('restaurants')
    .where({ id })
    .update({
      name: data.name,
      logo_url: data.logo_url,
      primary_country: data.primary_country,
      updated_at: new Date(),
    })
    .returning(RESTAURANT_COLUMNS);
  return row;
}

export async function updateRestaurantStatus(id: number, status: string): Promise<Restaurant> {
  const now = new Date();
  const [row] = await db('restaurants')
    .where({ id })
    .update({
      status,
      status_updated_at: now,
      updated_at: now,
    })
    .returning(RESTAURANT_COLUMNS);
  return row;
}
