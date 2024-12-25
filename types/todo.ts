export interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }
  
  export type TodoFilter = 'all' | 'active' | 'completed';
  
  export interface TodoContextType {
    todos: Todo[];
    dispatch: React.Dispatch<TodoAction>;
    filter: TodoFilter;
    setFilter: React.Dispatch<React.SetStateAction<TodoFilter>>;
  }
  
  export type TodoAction =
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'DELETE_TODO'; payload: number };