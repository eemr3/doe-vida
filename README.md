# Doe Vida
Sistema para gestão e incentivo à doação de sangue, conectando doadores.

Este repositório foi estruturado como monorepo e possui duas implementações diferentes de backend com o mesmo frontend, permitindo comparação de arquitetura e stack.

- Backend versão .NET

- Backend versão NestJS

- Frontend único em React + Vite

## Branches do Projeto
O repositório abriga duas versões da API:

- **`dotnet` branch** – backend construído em ASP.NET Core (.NET 8+).
- **`nestjs` branch** – backend construído em NestJS (Node.js/TypeScript).

O frontend em ambas as branches é feito com **React + Vite**.

## Versão .NET
Backend desenvolvido com ASP.NET Core + Entity Framework.
- [dotnet](https://github.com/eemr3/doe-vida/tree/backend-dotnet) – versão .NET da API.

Objetivo desta versão:

- Arquitetura robusta corporativa

- Uso de Identity

- Estrutura baseada em camadas

- Integração com PostgreSQL

## Versão NestJS
Backend desenvolvido com NestJS (Node.js).

- [nestjs](https://github.com/eemr3/doe-vida/tree/backend-nestjs) – versão NestJS da API.

Objetivo desta versão:

- Arquitetura modular

- Alto desacoplamento

- Uso de padrões do ecossistema Node

- Melhor integração com aplicações modernas em TypeScript

---

## Como contribuir

1. Faça um fork ou clone do repositório.
2. Crie uma branch de recurso ou correção (`git checkout -b meu-recurso`).
3. Faça suas alterações, garantindo que o código compile e os testes passem.
4. Abra um pull request na branch apropriada (`dotnet` ou `nestjs`) com uma descrição clara das mudanças.
5. Aguarde revisão e aprovação antes de mesclar.

