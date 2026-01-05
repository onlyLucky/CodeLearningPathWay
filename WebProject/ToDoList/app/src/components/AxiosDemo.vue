<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi, todoApi } from '@/api'

const loading = ref(false)
const userInfo = ref<any>(null)
const todoList = ref<any[]>([])

const fetchUserInfo = async () => {
  try {
    loading.value = true
    const data = await userApi.getUserInfo()
    userInfo.value = data
    ElMessage.success('获取用户信息成功')
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const fetchTodoList = async () => {
  try {
    loading.value = true
    const data = await todoApi.getTodoList({ page: 1, pageSize: 10 })
    todoList.value = data.list
    ElMessage.success('获取待办列表成功')
  } catch (error: any) {
    ElMessage.error(error.message || '获取待办列表失败')
  } finally {
    loading.value = false
  }
}

const createTodo = async () => {
  try {
    loading.value = true
    const newTodo = await todoApi.createTodo({
      title: '新的待办事项',
      description: '这是一个测试待办',
      priority: 'medium',
    })
    todoList.value.unshift(newTodo)
    ElMessage.success('创建待办成功')
  } catch (error: any) {
    ElMessage.error(error.message || '创建待办失败')
  } finally {
    loading.value = false
  }
}

const updateTodo = async (id: number) => {
  try {
    loading.value = true
    const updated = await todoApi.updateTodo(id, {
      title: '更新后的待办事项',
    })
    const index = todoList.value.findIndex((t) => t.id === id)
    if (index > -1) {
      todoList.value[index] = updated
    }
    ElMessage.success('更新待办成功')
  } catch (error: any) {
    ElMessage.error(error.message || '更新待办失败')
  } finally {
    loading.value = false
  }
}

const deleteTodo = async (id: number) => {
  try {
    loading.value = true
    await todoApi.deleteTodo(id)
    todoList.value = todoList.value.filter((t) => t.id !== id)
    ElMessage.success('删除待办成功')
  } catch (error: any) {
    ElMessage.error(error.message || '删除待办失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="card">
      <h2 class="text-xl font-semibold mb-4 text-primary-600">Axios API 请求示例</h2>
      
      <div class="space-y-4">
        <div class="flex gap-2 flex-wrap">
          <el-button type="primary" :loading="loading" @click="fetchUserInfo">
            获取用户信息
          </el-button>
          <el-button type="success" :loading="loading" @click="fetchTodoList">
            获取待办列表
          </el-button>
          <el-button type="warning" :loading="loading" @click="createTodo">
            创建待办
          </el-button>
        </div>

        <div v-if="userInfo" class="p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">用户信息:</h3>
          <pre class="text-sm overflow-x-auto">{{ JSON.stringify(userInfo, null, 2) }}</pre>
        </div>

        <div v-if="todoList.length > 0">
          <h3 class="font-semibold mb-2">待办列表:</h3>
          <div class="space-y-2">
            <div
              v-for="todo in todoList"
              :key="todo.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="font-medium">{{ todo.title }}</div>
                <div class="text-sm text-gray-500">优先级: {{ todo.priority }}</div>
              </div>
              <div class="flex gap-2">
                <el-button size="small" @click="updateTodo(todo.id)">更新</el-button>
                <el-button size="small" type="danger" @click="deleteTodo(todo.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold mb-3 text-gray-900">API 说明</h3>
      <div class="space-y-2 text-sm text-gray-600">
        <p>• 使用 Axios 封装的 request 工具类进行 HTTP 请求</p>
        <p>• 自动添加 Authorization 请求头（从 localStorage 获取 token）</p>
        <p>• 统一的请求/响应拦截器处理错误</p>
        <p>• TypeScript 类型定义确保类型安全</p>
        <p>• 支持自定义 baseURL 和 timeout 配置</p>
      </div>
    </div>
  </div>
</template>
