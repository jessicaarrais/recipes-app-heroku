import { IngredientModel } from '../store';

class IngredientGQL {
  id: string;
  recipeId: string;
  text: string;
  isChecked: boolean;

  constructor(ingredientModel: IngredientModel) {
    this.id = ingredientModel.id;
    this.recipeId = ingredientModel.recipeId;
    this.text = ingredientModel.text;
    this.isChecked = ingredientModel.isChecked;
  }
}

export default IngredientGQL;
