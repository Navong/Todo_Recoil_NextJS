// src/components/todo/TodoApp.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TodoProvider } from '@/context/todo/TodoProvider';
import { AddTodoForm } from './AddTodoForm';
import { FilterButtons } from './FilterButtons';
import { TodoList } from './TodoList';

export const TodoApp = () => {
  return (
    <TodoProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTodoForm />
          <FilterButtons />
          <TodoList />
        </CardContent>
      </Card>
    </TodoProvider>
  );
};