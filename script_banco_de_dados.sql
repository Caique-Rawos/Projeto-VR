CREATE TABLE public.loja (
	id serial4 NOT NULL,
	descricao varchar(60) NOT NULL,
	CONSTRAINT loja_pkey PRIMARY KEY (id)
);


CREATE TABLE public.produto (
	id serial4 NOT NULL,
	descricao varchar(60) NOT NULL,
	custo numeric(13, 3) NULL,
	imagem bytea NULL,
	CONSTRAINT produto_pkey PRIMARY KEY (id)
);

CREATE TABLE public.produtoloja (
	id serial4 NOT NULL,
	precovenda numeric(13, 3) NULL,
	idproduto int4 NOT NULL,
	idloja int4 NOT NULL,
	CONSTRAINT produtoloja_pkey PRIMARY KEY (id)
);


ALTER TABLE public.produtoloja ADD CONSTRAINT "FK_produtoloja_produto" FOREIGN KEY (idproduto) REFERENCES public.produto(id) ON DELETE CASCADE;
ALTER TABLE public.produtoloja ADD CONSTRAINT "FK_produtoloja_loja" FOREIGN KEY (idloja) REFERENCES public.loja(id) ON DELETE CASCADE;

insert into loja (descricao) values ('VR Software'), ('Fabrica de Inovacao');
