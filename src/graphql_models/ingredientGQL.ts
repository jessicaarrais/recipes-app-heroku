import { IngredientModel } from '../store';

class IngredientGQL {
  id: string;
  instructionId: string;
  text: string;
  isChecked: boolean;

  constructor(ingredientModel: IngredientModel) {
    this.id = ingredientModel.id;
    this.text = ingredientModel.text;
    this.isChecked = ingredientModel.isChecked;
    this.instructionId = ingredientModel.instructionId;
  }
}

export default IngredientGQL;
