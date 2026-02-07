# Arquitetura do Projeto Doe Vida

Refatoração do protótipo Figma para **Atomic Design** + **features**, com React, Vite, Tailwind e TypeScript.

## Estrutura de pastas

```
src/
├── app/
│   ├── layout/          # AppLayout (BrowserRouter + providers)
│   ├── providers/       # AuthProvider, ToastProvider
│   └── routes/          # AppRoutes (rotas e MainLayout)
├── shared/
│   └── ui/
│       ├── atoms/        # Button, Input, Label, Badge, Card, Table, ImageWithFallback
│       ├── molecules/   # FormField, SelectField, CardHeader, CardContent, Alert, Pagination, SearchInput
│       ├── organisms/   # Navbar
│       ├── templates/   # MainLayout, AuthLayout, PageLayout
│       └── utils/       # cn()
├── features/
│   ├── landing/         # pages/LandingPage
│   ├── auth/            # pages/LoginPage
│   └── donors/
│       ├── pages/       # RegisterDonorPage, DonorsListPage, DonorDetailsPage
│       ├── hooks/       # useDonors, useDonorById
│       ├── services/    # donors-service, mock-donors
│       └── types/       # Donor, DonorFormData, DonationRecord
├── styles/              # index.css, theme.css, tailwind.css
└── main.tsx
```

## Atomic Design aplicado

- **Atoms**: componentes básicos (Button, Input, Label, Badge, Card, Table, ImageWithFallback).
- **Molecules**: composição de atoms (FormField = Label + Input + erro; SelectField; Alert; Pagination; SearchInput; CardHeader; CardContent).
- **Organisms**: Navbar (logo + itens de navegação + menu mobile).
- **Templates**: MainLayout (navbar + main + toasts), AuthLayout (tela centralizada), PageLayout (container com max-width).
- **Pages**: dentro de cada feature; usam templates e organisms.

## Rotas

- `/` — Landing
- `/register` — Cadastro de doador
- `/login` — Login (admin: admin@doevida.com / admin123)
- `/donors` — Lista de doadores (requer auth)
- `/donors/:id` — Detalhe do doador (requer auth)

## Dependências

- React, Vite, TailwindCSS, TypeScript
- React Router DOM
- Axios, @tanstack/react-query, Zod (incluídos no package.json; integração com API pode ser feita em `features/donors/services`)

## Próximos passos sugeridos

1. Trocar mock por API real em `donors/services` (axios + React Query).
2. Validar formulários com Zod em `RegisterDonorPage` e `LoginPage`.
3. Remover a pasta `/prototype` após validar que a aplicação em `/src` atende ao fluxo e layout.
