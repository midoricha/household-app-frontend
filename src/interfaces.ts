export interface ITask {
  notes: any;
  _id: string;
  title: string;
  completed: boolean;
  completedBy?: string;
  dueDate?: string;
  recurring?: 'daily' | 'weekly' | 'monthly';
}

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
