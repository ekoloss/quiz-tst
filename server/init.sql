CREATE TABLE IF NOT EXISTS public.account
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    login character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role json NOT NULL,
    CONSTRAINT account_pkey PRIMARY KEY (id),
    CONSTRAINT account_login_unique UNIQUE (login)
)
