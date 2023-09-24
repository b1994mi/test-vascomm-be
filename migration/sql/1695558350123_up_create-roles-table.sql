CREATE OR REPLACE FUNCTION ON_UPDATE_CURRENT_TIMESTAMP() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ language 'plpgsql';

CREATE TABLE public.roles
(
    id bigserial,
    name character varying(50) NOT NULL,
    description text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
