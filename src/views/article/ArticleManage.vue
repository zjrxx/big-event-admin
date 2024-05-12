<template>
  <el-card shadow="never">
    <template v-slot:header>
      <div>
        <span>文章管理</span>
        <el-button type="primary" @click="showAddDrawer" style="float: right"
          >发布文章</el-button
        >
      </div>
    </template>

    <!-- 抽屉表单 -->
    <el-drawer
      :title="addOrUpdateDrawerTitle"
      v-model="addOrUpdateDrawerVisible"
      width="50%"
    >
      <el-form
        ref="articleFormRef"
        :model="articleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="articleTitle" label="文章标题">
          <el-input
            v-model="articleForm.articleTitle"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item prop="categoryName" label="分类名称">
          <el-select
            v-model="articleForm.categoryId"
            @change="handleCategoryChange"
            placeholder="请选择文章分类"
          >
            <el-option
              v-for="category in categories"
              :key="category.categoryId"
              :label="category.categoryName"
              :value="category.categoryId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="coverImg" label="文章封面">
          <div class="avatar-upload-container">
            <div
              class="avatar-preview"
              :style="{
                backgroundImage: articleForm.coverImgBase64
                  ? `url(${articleForm.coverImgBase64})`
                  : ''
              }"
            >
              <div
                v-if="!articleForm.coverImgBase64"
                class="upload-overlay"
                @click="selectImage"
              >
                请选择封面图片
              </div>
            </div>
          </div>
          <input
            type="file"
            ref="coverImgInput"
            style="display: none"
            accept="image/*"
            @change="handleImageChange"
          />
        </el-form-item>
        <el-form-item prop="articleContent" label="文章内容">
          <div>
            <quill-editor
              content-Type="html"
              theme="snow"
              v-model:content="articleForm.articleContent"
            ></quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <!-- :disabled="articleFormRef.valid" -->
          <el-button type="primary" @click="submitForm">发布</el-button>
          <el-button @click="saveDraft">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 搜索表单  -->
    <el-row class="search-form">
      <el-col :span="24">
        <el-form
          :inline="true"
          class="search-form-inline"
          :model="searchFormData"
        >
          <el-form-item label="文章分类" style="margin-right: 10px">
            <el-select
              v-model="searchFormData.selectedCategoryId"
              placeholder="请选择"
            >
              <el-option
                v-for="category in categories"
                :key="category.categoryId"
                :label="category.categoryName"
                :value="category.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-right: 10px">
            <el-select
              v-model="searchFormData.articleStatus"
              placeholder="请选择"
            >
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" style="margin-right: 10px"
              >搜索</el-button
            >
            <el-button @click="resetSearchForm(searchFormData)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-show="true" :data="articles">
      <el-table-column prop="articleTitle" label="文章标题"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="createTime" label="发表时间">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="articleStatus" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="editArticle(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="deleteArticle(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { addArticleService, getArticleListService } from '@/api/article'
import { useCategoryStore } from '@/stores'
//展示抽屉框
function showAddDrawer() {
  addOrUpdateDrawerTitle.value = '发布文章'
  articleForm.articleTitle = ''
  articleForm.categoryId = ''
  articleForm.articleContent = ''
  addOrUpdateDrawerVisible.value = true
}

//修改时间展示
const formatDate = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
const searchFormData = reactive({ selectedCategoryId: '', articleStatus: '' })
// 分页相关变量
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页显示数量
const total = ref(0) // 总条数

// 文章状态筛选
// const articleStatus = ref('')

// // 分类ID筛选
// const selectedCategoryId = ref('')

// 文章列表数据
const articles = ref([])

// 获取文章列表
const fetchArticleList = async () => {
  try {
    const response = await getArticleListService(
      currentPage.value,
      pageSize.value,
      searchFormData.selectedCategoryId.value,
      searchFormData.articleStatus.value
    )
    articles.value = response.records
    total.value = response.total
  } catch (error) {
    console.error('获取文章列表失败', error)
    ElMessage.error('获取文章列表失败，请稍后重试')
  }
}

// 分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchArticleList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchArticleList()
}

// 监听筛选条件变化
watch(
  [searchFormData.selectedCategoryId, searchFormData.articleStatus],
  () => {
    fetchArticleList()
  },
  { immediate: true }
)

const handleCategoryChange = (categoryId) => {
  // 直接通过categoryId查找对应的分类
  const selectedCategory = categories.find(
    (category) => category.categoryId === categoryId
  )

  console.log(
    'Selected Category ID:',
    categoryId,
    'Available Categories:',
    categories.map((c) => ({ id: c.categoryId, name: c.categoryName }))
  )

  if (selectedCategory) {
    articleForm.categoryId = categoryId // 直接设置categoryId
    articleForm.categoryName = selectedCategory.categoryName // 同时更新categoryName以保持UI同步（如果需要的话）
  } else {
    ElMessage.warning('所选分类不存在，请重新选择！')
  }
}

// 假设categories从Pinia Store中获取
// 定义响应式数据
const categoryStore = useCategoryStore()

const categories = categoryStore.categories

onMounted(async () => {
  await categoryStore.fetchCategories()

  // 使用nextTick等待DOM更新
  await nextTick()

  console.log('categories after update and nextTick:', categoryStore.categories)

  //获取文章列表
  fetchArticleList()
})
const addOrUpdateDrawerTitle = ref('发布文章')
const addOrUpdateDrawerVisible = ref(false)
const articleFormRef = ref(null)
const articleForm = reactive({
  articleTitle: '',
  categoryName: '',
  categoryId: '',
  coverImg: null, // 存储文件对象
  coverImgBase64: '', // 存储图片的base64编码，用于预览
  articleContent: '',
  articleStatus: '草稿' // 默认为草稿
})
const rules = {
  articleTitle: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
  ],
  categoryName: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  coverImg: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
  articleContent: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

// const categories = categoryStore.categories

const submitForm = async () => {
  if (!articleFormRef.value) {
    console.error('Form reference is not properly initialized.')
    return
  }
  // 在submitForm方法内部，验证之前添加这段逻辑
  const selectedCategory = categories.find(
    (category) => category.categoryName === articleForm.categoryName
  )
  if (selectedCategory) {
    articleForm.categoryId = selectedCategory.categoryId
  } else {
    // 处理找不到对应分类的情况，比如提示用户或设置默认值
    console.warn('Selected category not found, please handle this case.')
    // 或者 articleForm.categoryId = ''; // 设置默认值或空字符串
  }
  try {
    await nextTick()
    articleFormRef.value.validate(async (valid) => {
      if (valid) {
        // 创建FormData实例
        const formData = new FormData()

        // 添加表单中的其他非文件字段
        formData.append('articleTitle', articleForm.articleTitle)
        formData.append('cateId', articleForm.categoryId)
        formData.append('articleContent', articleForm.articleContent)
        formData.append('articleStatus', '已发布')
        formData.append('biz', 'cover')
        // 添加文件到FormData（确保在选择文件之后执行此操作）
        if (articleForm.coverImg instanceof File) {
          formData.append('coverImg', articleForm.coverImg) // 注意这里的键名应与后端接收的RequestPart匹配
        } else {
          throw new Error('No file selected for upload')
        }

        try {
          // 调整为使用formData发送请求
          const response = await addArticleService(formData) // 确保此函数为异步处理并返回Promise
          console.log(response)
          addOrUpdateDrawerVisible.value = false
        } catch (error) {
          console.error('Upload error:', error)
        }
      }
    })
  } catch (error) {
    console.error('Error during form validation:', error)
  }
}
const saveDraft = async () => {
  if (!articleFormRef.value) {
    console.error('Form reference is not properly initialized.')
    return
  }
  // 在submitForm方法内部，验证之前添加这段逻辑
  const selectedCategory = categories.find(
    (category) => category.categoryName === articleForm.categoryName
  )
  if (selectedCategory) {
    articleForm.categoryId = selectedCategory.categoryId
  } else {
    // 处理找不到对应分类的情况，比如提示用户或设置默认值
    console.warn('Selected category not found, please handle this case.')
    // 或者 articleForm.categoryId = ''; // 设置默认值或空字符串
  }
  try {
    await nextTick()
    articleFormRef.value.validate(async (valid) => {
      if (valid) {
        // 创建FormData实例
        const formData = new FormData()

        // 添加表单中的其他非文件字段
        formData.append('articleTitle', articleForm.articleTitle)
        formData.append('cateId', articleForm.categoryId)
        formData.append('articleContent', articleForm.articleContent)
        formData.append('articleStatus', '草稿')
        formData.append('biz', 'cover')
        // 添加文件到FormData（确保在选择文件之后执行此操作）
        if (articleForm.coverImg instanceof File) {
          formData.append('coverImg', articleForm.coverImg) // 注意这里的键名应与后端接收的RequestPart匹配
        } else {
          throw new Error('No file selected for upload')
        }

        try {
          // 调整为使用formData发送请求
          const response = await addArticleService(formData) // 确保此函数为异步处理并返回Promise
          console.log(response)
          showAddDrawer.value = false
        } catch (error) {
          console.error('Upload error:', error)
        }
      }
    })
  } catch (error) {
    console.error('Error during form validation:', error)
  }
}

const search = async () => {
  try {
    // 搜索逻辑
    // 根据两个下拉框选项值，展示结果
    articles.value = [] // 初始化为空数组而非null，以避免可能的渲染问题
    total.value = 0
    const response = await getArticleListService(
      // 使用await等待异步调用完成
      currentPage.value,
      pageSize.value,
      searchFormData.selectedCategoryId,
      searchFormData.articleStatus
    )
    articles.value = response.records
    total.value = response.total
  } catch (error) {
    console.error('搜索文章列表失败', error)
    ElMessage.error('搜索文章列表失败，请稍后重试')
  }
}
const resetSearchForm = (searchFormData) => {
  searchFormData.selectedCategoryId = ''
  searchFormData.articleStatus = ''
}
const editArticle = (row) => {
  addOrUpdateDrawerTitle.value = '编辑文章'
  articleForm.articleTitle = row.articleTitle
  articleForm.categoryId = row.cateId
  articleForm.categoryName = row.categoryName
  articleForm.articleContent = row.articleContent
  articleForm.coverImg = row.coverImg
  addOrUpdateDrawerVisible.value = true
}

// const deleteArticle = (row) => {
//   // 删除文章逻辑
// }

// const handleRemoveCover = () => {
//   articleForm.coverImg = null
// }

const selectedFile = ref(null)

const selectImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      articleForm.coverImg = file // 直接赋值给articleForm.coverImg
      selectedFile.value = true // 添加这一行来更新selectedFile
      handleImageChange(e) // 调用处理函数以显示预览
    }
  }
  input.click()
}
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    articleForm.coverImg = file // 保存文件对象以备上传
    const reader = new FileReader()
    reader.onload = (e) => {
      articleForm.coverImgBase64 = e.target.result // 将图片转为base64预览
    }
    reader.readAsDataURL(file)
    selectedFile.value = true // 添加这一行来更新selectedFile
  }
}
</script>

<style scoped>
.block {
  float: right; /* 这会让div靠右浮动 */
}
.search-form {
  margin-bottom: 15px;
}
.search-form .el-select {
  width: 220px; /* 您可以根据需要调整这个值来改变下拉框的宽度 */
  size: large;
}
.avatar-upload-container {
  position: relative;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-overlay:hover {
  opacity: 1;
}
</style>
