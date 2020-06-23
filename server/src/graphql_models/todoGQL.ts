import { TodoModel } from '../store';

class TodoGQL {
  id: number;
  sheetId: number;
  text: string;
  isChecked: boolean;

  constructor(todoModel: TodoModel) {
    this.id = todoModel.id;
    this.sheetId = todoModel.sheetId;
    this.text = todoModel.text;
    this.isChecked = todoModel.isChecked;
  }
}

export default TodoGQL;
