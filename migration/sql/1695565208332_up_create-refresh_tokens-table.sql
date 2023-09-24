CREATE TABLE public.refresh_tokens
(
    id bigserial,
    user_id int NOT NULL,
    token character varying(256) NOT NULL,
    expired_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE PROCEDURE ON_UPDATE_CURRENT_TIMESTAMP();

CREATE INDEX ON public.refresh_tokens (user_id);
CREATE INDEX ON public.refresh_tokens (token);
