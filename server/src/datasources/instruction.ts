import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Context } from '..';
import { InstructionModel, dbInstruction } from '../store';

interface NewInstruction {
  step: number;
  text: string;
  recipeId: number;
}

interface UpdatedInstruction {
  step: number;
  text: string;
}

class Instruction extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getInstructions(recipeId: number): Promise<Array<InstructionModel>> {
    return await dbInstruction.findAll({ where: { recipeId } });
  }

  async createInstruction({
    step,
    text,
    recipeId,
  }: NewInstruction): Promise<InstructionModel> {
    return await dbInstruction.create({ step, text, recipeId });
  }

  async updateInstruction(
    updatedInstruction: UpdatedInstruction,
    instructionId: number,
    recipeId: number
  ): Promise<InstructionModel> {
    const instruction = await dbInstruction.findOne({
      where: { id: instructionId, recipeId },
    });
    if (!instruction) {
      return null;
    }
    return await instruction.update(updatedInstruction);
  }

  async deleteInstruction(instructionId: number, recipeId: number): Promise<boolean> {
    return (
      (await dbInstruction.destroy({ where: { id: instructionId, recipeId } })) === 1
    );
  }
}

export default Instruction;
