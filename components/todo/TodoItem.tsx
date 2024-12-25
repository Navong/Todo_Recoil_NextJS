import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { useTodo } from '@/hooks/useTodo';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { dispatch } = useTodo();

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <button onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}>
          {todo.completed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
          {todo.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};