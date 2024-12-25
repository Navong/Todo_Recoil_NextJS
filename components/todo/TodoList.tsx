import { useTodo } from '@/hooks/useTodo';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const { todos, filter } = useTodo();

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="space-y-2">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {filteredTodos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all' ? (
            "No todos yet. Add one above!"
          ) : filter === 'active' ? (
            "No active todos!"
          ) : (
            "No completed todos!"
          )}
        </div>
      )}
    </div>
  );
};