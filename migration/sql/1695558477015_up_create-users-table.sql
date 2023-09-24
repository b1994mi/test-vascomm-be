CREATE TABLE public.users
(
    id bigserial,
    email character varying(320) NOT NULL,
    password character varying(258) NOT NULL,
    phone_number character varying(14) NOT NULL,
    is_verified boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamptz,
    PRIMARY KEY (id)
);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE ON_UPDATE_CURRENT_TIMESTAMP();

CREATE INDEX ON public.users (email, deleted_at);
CREATE INDEX ON public.users (phone_number, deleted_at);
CREATE INDEX ON public.users (deleted_at, id);
