import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  function addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    todos.value.push(newTodo)
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  function deleteTodo(id: number) {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  function updateTodo(id: number, updates: Partial<Todo>) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      Object.assign(todo, updates)
    }
  }

  const completedCount = ref(0)
  const totalCount = ref(0)

  function loadTodos() {
    const saved = localStorage.getItem('todos')
    if (saved) {
      todos.value = JSON.parse(saved)
    }
    totalCount.value = todos.value.length
    completedCount.value = todos.value.filter(t => t.completed).length
  }

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos.value))
    totalCount.value = todos.value.length
    completedCount.value = todos.value.filter(t => t.completed).length
  }

  return {
    todos,
    loading,
    completedCount,
    totalCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    loadTodos,
    saveTodos,
  }
})
