import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Context } from '..';
import { InstructionModel, dbInstruction } from '../store';

interface CreateInstructionParams {
  step: string;
  text: string;
  recipeId: string;
}

interface UpdateInstructionParams {
  step: string;
  text: string;
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
    text,
    recipeId,
  }: CreateInstructionParams): Promise<InstructionModel | null> {
    if (!this.context.user) return null;
    return await dbInstruction.create({ step, text, recipeId });
  }

  async updateInstruction(
    updatedInstruction: UpdateInstructionParams,
    instructionId: string,
    recipeId: string
  ): Promise<InstructionModel | null> {
    if (!this.context.user) return null;
    const instruction = await dbInstruction.findOne({
      where: { id: instructionId, recipeId },
    });
    if (!instruction) return null;
    return await instruction.update(updatedInstruction);
  }

  async deleteInstruction(instructionId: string, recipeId: string): Promise<boolean> {
    return (
      (await dbInstruction.destroy({ where: { id: instructionId, recipeId } })) === 1
    );
  }
}

export default Instruction;
