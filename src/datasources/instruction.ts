import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Context } from '..';
import { InstructionModel, dbInstruction, dbRecipe, dbIngredient } from '../store';

interface CreateInstructionParams {
  step: string;
  description: string;
  tip: string;
  recipeId: string;
}

interface UpdateInstructionParams {
  step?: string;
  description?: string;
  tip?: string;
}

interface DeleteInstructionParams {
  instructionId: string;
  recipeId: string;
}

class Instruction extends DataSource {
  context!: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getInstructions(recipeId: string): Promise<Array<InstructionModel>> {
    return await dbInstruction.findAll({ where: { recipeId } });
  }

  async createInstruction({
    step,
    description,
    tip,
    recipeId,
  }: CreateInstructionParams): Promise<InstructionModel | null> {
    if (!(await this.isOwner(recipeId))) return null;
    return await dbInstruction.create({ step, description, tip, recipeId });
  }

  async updateInstruction(
    updatedInstruction: UpdateInstructionParams,
    instructionId: string,
    recipeId: string
  ): Promise<InstructionModel | null> {
    if (!(await this.isOwner(recipeId))) return null;
    const instruction = await dbInstruction.findOne({
      where: { id: instructionId, recipeId },
    });
    if (!instruction) return null;
    return await instruction.update(updatedInstruction);
  }

  async deleteInstruction({
    instructionId,
    recipeId,
  }: DeleteInstructionParams): Promise<boolean> {
    if (!(await this.isOwner(recipeId))) return false;
    const { count } = await dbIngredient.findAndCountAll({
      where: { instructionId },
    });
    const deletedIngredients = await dbIngredient.destroy({ where: { instructionId } });
    if (deletedIngredients !== count) return false;
    return (await dbInstruction.destroy({ where: { id: instructionId } })) === 1;
  }

  async isOwner(recipeId: string): Promise<boolean> {
    if (!this.context.user) return false;
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) return false;
    return recipe.ownerId === this.context.user.id;
  }
}

export default Instruction;
