<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()
const { todos, completedCount, totalCount } = storeToRefs(todoStore)

const newTodoTitle = ref('')

onMounted(() => {
  todoStore.loadTodos()
})

function addTodo() {
  if (newTodoTitle.value.trim()) {
    todoStore.addTodo(newTodoTitle.value.trim())
    newTodoTitle.value = ''
    todoStore.saveTodos()
  }
}

function toggleTodo(id: number) {
  todoStore.toggleTodo(id)
  todoStore.saveTodos()
}

function deleteTodo(id: number) {
  todoStore.deleteTodo(id)
  todoStore.saveTodos()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="card mb-6">
        <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">待办事项</h1>
        
        <div class="flex gap-2 mb-6">
          <input
            v-model="newTodoTitle"
            type="text"
            placeholder="添加新的待办事项..."
            class="input-field"
            @keyup.enter="addTodo"
          />
          <button class="btn-primary" @click="addTodo">
            添加
          </button>
        </div>

        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          已完成: {{ completedCount }} / {{ totalCount }}
        </div>

        <div v-if="todos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          暂无待办事项
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              class="w-5 h-5 text-primary-600 rounded"
            />
            <span
              :class="[
                'flex-1',
                todo.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
              ]"
            >
              {{ todo.title }}
            </span>
            <button
              @click="deleteTodo(todo.id)"
              class="text-red-500 hover:text-red-700 transition-colors"
            >
              删除
            </button>
          </li>
        </ul>
      </div>

      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        使用 Pinia 进行状态管理，数据持久化到 localStorage
      </div>
    </div>
  </div>
</template>
