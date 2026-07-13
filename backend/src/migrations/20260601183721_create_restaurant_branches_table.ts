import type { Knex } from 'knex';

// using minor unit for delivery_fee, commission
// commission using BPS (e.g., 10% = 1000)

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS postgis;
        
        CREATE TABLE restaurant_branches (
            id SERIAL PRIMARY KEY,
            restaurant_id INT NOT NULL,
            country_code TEXT NOT NULL CHECK(country_code IN ('EG','SA')),
            address_text TEXT NOT NULL,
            label TEXT NOT NULL,
            lat DECIMAL(9, 6) NOT NULL,
            lng DECIMAL(9, 6) NOT NULL,
            is_active BOOLEAN NOT NULL,
            opens_at TIME NOT NULL,
            closes_at TIME NOT NULL,
            accept_orders BOOLEAN NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            delivery_fee INTEGER NOT NULL DEFAULT 0,
            currency TEXT NOT NULL CHECK(currency IN ('EGP','SAR')),
            commission INT NOT NULL,
            location geography(Point, 4326) GENERATED ALWAYS AS ( ST_MakePoint(lng::float, lat::float)::geography) STORED,
            
            CONSTRAINT fk_restaurant_branches_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
        );
        
        CREATE INDEX idx_restaurant_branches_restaurant_id ON restaurant_branches(restaurant_id);
        CREATE INDEX idx_restaurant_branches_is_active ON restaurant_branches(is_active);
        CREATE INDEX idx_restaurant_branches_location ON restaurant_branches USING GIST(location);

        CREATE OR REPLACE FUNCTION fn_insert_branch_product_details()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO product_branch_details (branch_id, product_id, price, stock, is_available)
            SELECT NEW.id, id, 0, 0, false
            FROM products
            WHERE restaurant_id = NEW.restaurant_id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_branch_after_insert
        AFTER INSERT ON restaurant_branches
        FOR EACH ROW
        EXECUTE FUNCTION fn_insert_branch_product_details();
        
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        DROP TABLE restaurant_branches;
        DROP TYPE IF EXISTS country_enum;
        DROP TYPE IF EXISTS currency_enum;
    `);
}
