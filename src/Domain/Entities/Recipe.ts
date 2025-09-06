export interface Ingredient {
  name: string;
  quantity: string;
  category: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export class Recipe {
  constructor(
    public id: string,
    public title: string,
    public image: string,
    public cookingTime: number,
    public difficulty: "Easy" | "Medium" | "Hard",
    public dietaryTags: string[],
    public ingredients: Ingredient[],
    public instructions: string[],
    public nutrition: NutritionalInfo
  ) { }
}

