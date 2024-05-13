<template>
  <el-card class="category-card">
    <template v-slot:header>
      <div>
        <span>文章分类</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddDialog"
          style="float: right"
          >添加分类</el-button
        >
      </div>
    </template>
    <el-table
      v-if="categories.length"
      :data="categories"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="100"> </el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="categoryAlias" label="分类别名"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editCategory(row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteCategory(row)"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="no-data">暂无数据</div>
  </el-card>

  <el-dialog
    v-model="addOrUpdateDialogVisible"
    :title="addOrUpdateDialogTitle"
    width="30%"
    @close="resetForm('categoryForm')"
  >
    <el-form
      ref="categoryFormRef"
      :model="categoryFormData"
      :rules="categoryFormRules"
      label-width="80px"
    >
      <el-form-item prop="categoryName" label="分类名称">
        <el-input
          v-model="categoryFormData.categoryName"
          placeholder="分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="categoryAlias" label="分类别名">
        <el-input
          v-model="categoryFormData.categoryAlias"
          placeholder="分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addOrUpdateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCategoryForm()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  addArticleCategoryService,
  deleteArticleCategoryService,
  updateArticleCategoryService,
  getArticleCategoryListService,
  getArticleCategoryService
} from '@/api/articleCategory'

const categories = ref([])
const addOrUpdateDialogVisible = ref(false)
const addOrUpdateDialogTitle = ref('添加分类')
const categoryFormData = reactive({ categoryName: '', categoryAlias: '' })
const categoryFormRef = ref(null)
const categoryFormRules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  categoryAlias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' }
  ]
}

async function fetchCategories() {
  try {
    const response = await getArticleCategoryListService()
    categories.value = response
  } catch (error) {
    console.error('获取分类列表失败', error)
  }
}

onMounted(() => {
  fetchCategories()
})

function showAddDialog() {
  addOrUpdateDialogTitle.value = '添加分类'
  categoryFormData.categoryName = ''
  categoryFormData.categoryAlias = ''
  addOrUpdateDialogVisible.value = true
}
//ss
// async function submitCategoryForm() {
//   await new Promise((resolve) => {
//     categoryFormRef.value.validate((valid) => {
//       resolve(valid)
//     })
//   }).then(async (valid) => {
//     if (valid) {
//       try {
//         if (addOrUpdateDialogTitle.value === '添加分类') {
//           await addArticleCategoryService(categoryFormData)
//         } else {
//           //先获取分类详情
//           alert(categoryFormData.categoryId)
//           getArticleCategoryService(categoryFormData.categoryId)
//           await updateArticleCategoryService(categoryFormData)
//         }
//         ElMessage.success('操作成功')
//         addOrUpdateDialogVisible.value = false
//         fetchCategories()
//       } catch (error) {
//         ElMessage.error('操作失败，请重试')
//       }
//     }
//   })
// }
function editCategory(row) {
  addOrUpdateDialogTitle.value = '修改分类'
  categoryFormData.categoryId = row.categoryId
  categoryFormData.categoryName = row.categoryName
  categoryFormData.categoryAlias = row.categoryAlias
  addOrUpdateDialogVisible.value = true
}

async function submitCategoryForm() {
  await new Promise((resolve) => {
    categoryFormRef.value.validate((valid) => {
      resolve(valid)
    })
  }).then(async (valid) => {
    if (valid) {
      try {
        if (addOrUpdateDialogTitle.value === '添加分类') {
          await addArticleCategoryService(categoryFormData)
          // 假设addArticleCategoryService返回的是包含新创建分类信息的对象，其中包含id
        } else {
          // 现在categoryFormData中已包含id，直接调用更新服务
          //getArticleCategoryService(categoryFormData.categoryId)
          await updateArticleCategoryService(categoryFormData)
          ElMessage.success('更新成功')
        }
        addOrUpdateDialogVisible.value = false
        fetchCategories()
      } catch (error) {
        ElMessage.error('操作失败，请重试')
      }
    }
  })
}

async function handleDeleteCategory(row) {
  try {
    console.log(row.id)
    await deleteArticleCategoryService(row.id)

    ElMessage.success('删除成功')
    fetchCategories()
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  }
}

function resetForm(formName) {
  if (formName === 'categoryForm') {
    categoryFormRef.value.resetFields()
  }
}
</script>

<style scoped>
.category-card {
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}
.no-data {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>
