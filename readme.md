# Primeiros Passos

## Vídeo Tutorial

[![Assista ao Vídeo Tutorial](https://res.cloudinary.com/practicaldev/image/fetch/s--uBT6xRme--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/i/qibhtrfxpeoi9zqjltdq.png)](https://youtu.be/6NJnH05CYww)

Assista ao vídeo acima para um guia passo a passo sobre como começar com este repositório.

## Guia Rápido

## 1° Etapa (API)

### Passo 1: Baixe o Repositório

```bash
git clone https://github.com/Caique-Rawos/Projeto-VR.git

```

Abra a pasta Projeto-VR em seu visual studio
e nele abra um terminal

### Passo 2: Instale as Dependências

```bash
cd api
npm install
```

### Passo 3: Configure seu Banco de Dados

```bash
Siga para o arquivo:

  api
    > src
      > database
        > database.module.ts

e configure a conexão com seu banco de dados
```

### Passo 4: Configure seu Banco de Dados

```bash
Rode o script

  script_banco_de_dados.sql

Disponivel nesses repositorio para criar as tabelas no banco de dados
```

### Passo 5: Execute os Testes

```bash
npm run test
```

### Passo 6: Inicie o Servidor

```bash
npm run start
```

_Obs: a API precisa estar rodando na porta 3000_ <br><br>
agora a api do projeto ja esta funcionando!

## 2° Etapa (Pagina Web)

### Passo 1: Novo Terminal

```javascript
Abra um novo terminal no visual studio,
sem encerar o processo do terminal onde a api esta rodando
```

### Passo 2: Instale as Dependências

```bash
cd frontend
npm install
```

### Passo 3: Inicie o Servidor

```bash
npm run start
```

### Aproveite a Aplicação!

```bash
Prontinho, agora sua aplicação já esta rodando
para ter acesso a ela acesse o localhost:4200 pela seguinte url

http://localhost:4200/
```
