<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
const input = ref('')
const selectValue = ref('')
const radioValue = ref('1')
const checkboxValue = ref(false)
const checkboxGroup = ref([])
const switchValue = ref(false)
const dateValue = ref('')
const rateValue = ref(0)
const sliderValue = ref(50)

const options = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
]

const openDialog = () => {
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  ElMessage({
    message: '操作成功！',
    type: 'success'
  })
  dialogVisible.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="card">
      <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Element Plus UI 组件示例</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输入框</label>
          <el-input v-model="input" placeholder="请输入内容" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择器</label>
          <el-select v-model="selectValue" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">单选框</label>
          <el-radio-group v-model="radioValue">
            <el-radio value="1">选项一</el-radio>
            <el-radio value="2">选项二</el-radio>
            <el-radio value="3">选项三</el-radio>
          </el-radio-group>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">复选框</label>
          <el-checkbox v-model="checkboxValue">单个复选框</el-checkbox>
          <el-checkbox-group v-model="checkboxGroup" class="mt-2">
            <el-checkbox value="A">选项 A</el-checkbox>
            <el-checkbox value="B">选项 B</el-checkbox>
            <el-checkbox value="C">选项 C</el-checkbox>
          </el-checkbox-group>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">开关</label>
          <el-switch v-model="switchValue" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日期选择器</label>
          <el-date-picker
            v-model="dateValue"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">评分</label>
          <el-rate v-model="rateValue" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">滑块</label>
          <el-slider v-model="sliderValue" />
        </div>

        <div class="flex gap-2 flex-wrap">
          <el-button type="primary" @click="openDialog">打开对话框</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
          <el-button type="info">信息按钮</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="对话框示例"
      width="30%"
      @close="handleClose"
    >
      <p class="text-gray-700 dark:text-gray-300">这是一个 Element Plus 对话框示例</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
