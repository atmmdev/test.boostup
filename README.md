<div align="center">
  <img src="./favicon.png" />
  <h1>Anderson Toledo Martins Moreira</h1>
</div>

<div align="center">

[![Download PDF](https://img.shields.io/badge/Curriculum-US-blue?logo=adobeacrobatreader&logoColor=white)](https://docs.google.com/document/d/1I8T4Mkb61NsTKN14ZbT1mnQKAc9LqiiPtgrYf9ayH1c/edit?usp=sharing)
[![Download PDF](https://img.shields.io/badge/Currículo-PT_br-darkgreen?logo=adobeacrobatreader&logoColor=white)](https://docs.google.com/document/d/1vnFlRP3myxexgHk5Y6XaCKQGETPQwCygPZqGSblwCXg/edit?usp=sharing)

</div>

<div align="center">

[![LinkedIn](https://img.shields.io/badge/%20-LinkedIn-blue?color=3498db&labelColor=2980b9&logo=linkedin&logoColor=ffcc80)](https://www.linkedin.com/in/atmmoreira)
[![Gmail](https://img.shields.io/badge/%20-atmmoreira.rj@gmail.com-black?color=c0392b&labelColor=ef5350&logo=gmail&logoColor=ffffff)](mailto:atmmoreira.rj@gmail.com?subject=From%20GitHub&cc=atmmoreira.rj@gmail&body=Hi,%20there.%20Found%20you%20from%20GitHub.)
[![Phone](<https://img.shields.io/badge/-+55_(21)_9.9289.0362-black?color=2ecc71&labelColor=27ae60&logo=whatsapp&logoColor=ffffff>)](https://api.whatsapp.com/send?phone=5521992890362)

</div>

## Objective

You're building a personal recipe management and meal planning application that helps home
cooks organize their favorite recipes, plan weekly meals, and generate smart shopping lists.

## Tecnologies

```bash
# Technical Requirements
- React with TypeScript.
- State management (Context API, Redux, or anything else that works for you).
- Responsive design that works on desktop, tablet, and mobile.
- CSS-in-JS or styled-components (or Tailwind CSS).
- Mock data - create realistic recipe data (at least 30+ recipes with various cuisines and dietary options).
- Local storage persistence for meal plans and shopping lists.

# Bonus Features (Nice to Have)
- Recipe import from URL functionality.
- Unit tests for key components.
- Deploy using Vercel (free tier).
```

## Architecture

```
└── 📁text.boostup
    └── 📁documentation
        ├── boost-up-fe-assignment.pdf
    └── 📁public
        ├── vite.svg
    └── 📁src
        └── 📁Application
            └── 📁UseCases
                ├── AddRecipe.ts
                ├── GenerateShoppingList.ts
                ├── PlanMeal.ts
        └── 📁Data
            ├── recipe.json
        └── 📁Domain
            └── 📁Entities
                ├── MealPlan.ts
                ├── Recipe.ts
                ├── ShoppingList.ts
            └── 📁Repositories
                ├── RecipeRepository.ts
            └── 📁Services
            └── 📁ValueObjects
        └── 📁Infrastructure
            └── 📁Api
                ├── RecipeParserAPI.ts
            └── 📁Repositories
                ├── LocalStorageMealRepository.ts
                ├── LocalStorageRecipeRepository.ts
        └── 📁Presentation
            └── 📁components
                ├── MealPlanner.tsx
                ├── RecipeCard.tsx
                ├── RecipeGallery.tsx
                ├── RecipeMeal.tsx
                ├── ShoppingList.tsx
            └── 📁hooks
            └── 📁pages
                ├── Dashboard.tsx
            └── 📁routes
        ├── App.tsx
        ├── main.css
        ├── main.tsx
        ├── vite-env.d.ts
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── favicon.png
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Como rodar

npm i
npm run dev

## Decisões

- JSON seed em vez de API (CORS/tempo)
- Persistência leve em localStorage

## I use AI to help me

- ChatGPT foi usado para estruturar a base de DDD e gerar exemplos iniciais.
- Código foi adaptado manualmente para:
  - Melhor tipagem TypeScript
  - Separação clara em camadas
  - Integração com LocalStorage
- Prompt engineering foi usado para acelerar a escrita de entidades e casos de uso.
