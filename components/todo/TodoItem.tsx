'use client';

import { useSetRecoilState } from 'recoil';
import { todosState } from '@/recoil/atoms';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const setTodos = useSetRecoilState(todosState);
  const queryClient = useQueryClient();

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update the todo
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map((t) => (t.id === id ? { ...t, completed } : t))
      );

      // Also update Recoil state for UI consistency
      setTodos((oldTodos) =>
        oldTodos.map((t) => (t.id === id ? { ...t, completed } : t))
      );

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, restore the previous value
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
        setTodos(context.previousTodos as Todo[]);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically remove the todo
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.filter((t) => t.id !== id)
      );

      // Update Recoil state
      setTodos((oldTodos) => oldTodos.filter((t) => t.id !== id));

      return { previousTodos };
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
        setTodos(context.previousTodos as Todo[]);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleTodo = async () => {
    await toggleTodoMutation.mutate({
      id: todo.id.toString(),
      completed: !todo.completed,
    });
  };

  const deleteTodo = async () => {
    deleteTodoMutation.mutate(todo.id.toString());
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={toggleTodo}
          disabled={toggleTodoMutation.isPending}
        >
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
        onClick={deleteTodo}
        disabled={deleteTodoMutation.isPending}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};