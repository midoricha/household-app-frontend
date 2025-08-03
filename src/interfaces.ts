export interface IIngredient {
  name: string;
  quantity?: number;
  unit?: string;
}

export interface IRecipe {
  _id: string;
  title: string;
  ingredients: IIngredient[];
  instructions: string[];
  cuisine?: string;
}

export interface IPantryItem {
  _id: string;
  name: string;
  quantity?: number;
  unit?: string;
}

export interface ITask {
  _id?: string;
  title: string;
  completed: boolean;
  completedBy?: string;
  dueDate?: Date | null;
  recurring: "never"
  | "daily"
  | "weekly"
  | "monthly"
  | "weekdays"
  | "weekends"
  | "biweekly"
  | "yearly";
  notes?: string;
  priority: "none" | "low" | "medium" | "high";
  isArchived: boolean;
}