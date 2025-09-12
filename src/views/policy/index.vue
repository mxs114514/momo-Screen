<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import ItemWrap from "@/components/item-wrap";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 页面数据
const pageTitle = ref("能源物资管理");

// 搜索表单
const searchForm = reactive({
  keyword: "",
  status: ""
});

// 状态选项
const statusOptions = [
  { label: "全部", value: "" },
  { label: "已生成", value: "1" },
  { label: "未生成", value: "0" }
];

// 表格数据
const tableData = ref([
  {
    id: 1,
    code: "WZ001",
    name: "煤炭物资",
    type: "能源原料",
    category: "重点物资",
    operator: "张三",
    generateTime: "2024-01-15 10:30:00",
    downloadTime: "2024-01-15 11:00:00",
    codeCount: 1500,
    status: "1",
    description: "优质煤炭，热值高"
  },
  {
    id: 2,
    code: "WZ002",
    name: "天然气物资",
    type: "清洁能源",
    category: "重点物资",
    operator: "李四",
    generateTime: "2024-01-16 09:15:00",
    downloadTime: "2024-01-16 09:45:00",
    codeCount: 2300,
    status: "1",
    description: "高纯度天然气"
  },
  {
    id: 3,
    code: "WZ003",
    name: "石油物资",
    type: "能源原料",
    category: "重点物资",
    operator: "王五",
    generateTime: "2024-01-17 14:20:00",
    downloadTime: "",
    codeCount: 1800,
    status: "0",
    description: "轻质原油"
  },
  {
    id: 4,
    code: "WZ004",
    name: "电力设备",
    type: "电力装备",
    category: "一般物资",
    operator: "赵六",
    generateTime: "2024-01-18 16:45:00",
    downloadTime: "2024-01-18 17:15:00",
    codeCount: 850,
    status: "1",
    description: "高压变压器"
  },
  {
    id: 5,
    code: "WZ005",
    name: "太阳能板",
    type: "新能源设备",
    category: "绿色物资",
    operator: "孙七",
    generateTime: "2024-01-19 08:30:00",
    downloadTime: "",
    codeCount: 1200,
    status: "0",
    description: "高效单晶硅太阳能板"
  },
  {
    id: 6,
    code: "WZ006",
    name: "风力发电机",
    type: "新能源设备",
    category: "绿色物资",
    operator: "周八",
    generateTime: "2024-01-20 13:10:00",
    downloadTime: "2024-01-20 13:40:00",
    codeCount: 650,
    status: "1",
    description: "大型风力发电机组"
  },
  {
    id: 7,
    code: "WZ007",
    name: "储能电池",
    type: "储能设备",
    category: "重点物资",
    operator: "吴九",
    generateTime: "2024-01-21 11:25:00",
    downloadTime: "2024-01-21 12:00:00",
    codeCount: 980,
    status: "1",
    description: "锂离子储能电池"
  },
  {
    id: 8,
    code: "WZ008",
    name: "核燃料",
    type: "核能原料",
    category: "特殊物资",
    operator: "郑十",
    generateTime: "2024-01-22 15:50:00",
    downloadTime: "",
    codeCount: 450,
    status: "0",
    description: "低浓缩铀燃料"
  }
]);

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 8
});

// 原始数据备份（用于搜索重置）
const originalTableData = ref([...tableData.value]);

// 过滤后的数据
const filteredData = computed(() => {
  let result = [...originalTableData.value];
  
  // 关键词搜索
  if (searchForm.keyword.trim()) {
    const keyword = searchForm.keyword.toLowerCase();
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.code.toLowerCase().includes(keyword) ||
      item.operator.toLowerCase().includes(keyword)
    );
  }
  
  // 状态筛选
  if (searchForm.status !== '') {
    result = result.filter(item => item.status === searchForm.status);
  }
  
  return result;
});

// 分页数据
const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return tableData.value.slice(start, end);
});

// 新增对话框
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

// 详情对话框
const detailDialogVisible = ref(false);
const currentDetail = ref<any>({});

// 编辑模式
const isEditMode = ref(false);
const currentEditItem = ref<any>({});

// 新增表单
const addForm = reactive({
  type: "",
  name: "",
  category: "",
  operator: "",
  codeCount: "",
  description: ""
});

// 表单验证规则
const rules: FormRules = {
  type: [{ required: true, message: "请选择物资类型", trigger: "change" }],
  name: [{ required: true, message: "请输入物资名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择物资分类", trigger: "change" }],
  operator: [{ required: true, message: "请输入操作人", trigger: "blur" }],
  codeCount: [{ required: true, message: "请输入码数量", trigger: "blur" }],
  description: [{ required: true, message: "请输入物资描述", trigger: "blur" }]
};

// 物资类型选项
const typeOptions = [
  { label: "能源原料", value: "能源原料" },
  { label: "清洁能源", value: "清洁能源" },
  { label: "电力装备", value: "电力装备" },
  { label: "新能源设备", value: "新能源设备" },
  { label: "储能设备", value: "储能设备" },
  { label: "核能原料", value: "核能原料" }
];

// 物资分类选项
const categoryOptions = [
  { label: "重点物资", value: "重点物资" },
  { label: "一般物资", value: "一般物资" },
  { label: "绿色物资", value: "绿色物资" },
  { label: "特殊物资", value: "特殊物资" }
];

// 搜索功能
const handleSearch = () => {
  console.log("搜索条件:", searchForm);
  
  // 更新表格数据为过滤后的数据
  tableData.value = [...filteredData.value];
  
  // 更新分页信息
  pagination.total = filteredData.value.length;
  pagination.currentPage = 1;
  
  const resultCount = filteredData.value.length;
  if (resultCount === 0) {
    ElMessage.warning("未找到符合条件的数据");
  } else {
    ElMessage.success(`找到 ${resultCount} 条符合条件的数据`);
  }
};

// 重置搜索
const handleReset = () => {
  searchForm.keyword = "";
  searchForm.status = "";
  
  // 恢复原始数据
  tableData.value = [...originalTableData.value];
  
  // 重置分页信息
  pagination.total = originalTableData.value.length;
  pagination.currentPage = 1;
  
  ElMessage.info("搜索条件已重置，显示全部数据");
};

// 新增操作
const handleAdd = () => {
  isEditMode.value = false;
  currentEditItem.value = {};
  formRef.value?.resetFields();
  dialogVisible.value = true;
};

// 提交新增表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        // 编辑模式
        const index = tableData.value.findIndex(item => item.id === currentEditItem.value.id);
        const originalIndex = originalTableData.value.findIndex(item => item.id === currentEditItem.value.id);
        
        if (index > -1) {
          const updatedItem = {
            ...currentEditItem.value,
            ...addForm,
            generateTime: new Date().toLocaleString(),
            status: "1"
          };
          tableData.value[index] = updatedItem;
          originalTableData.value[originalIndex] = updatedItem;
        }
        
        ElMessage.success('编辑成功');
      } else {
        // 新增模式
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1;
        const newItem = {
          id: newId,
          code: `WZ${String(newId).padStart(3, '0')}`,
          ...addForm,
          generateTime: new Date().toLocaleString(),
          downloadTime: "",
          status: "1"
        };
        
        tableData.value.push(newItem);
        originalTableData.value.push(newItem);
        pagination.total = tableData.value.length;
        
        ElMessage.success('新增成功');
      }
      
      dialogVisible.value = false;
      formRef.value?.resetFields();
    }
  });
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

// 查看详情
const handleViewDetail = (row: any) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

// 编辑操作
const handleEdit = (row: any) => {
  isEditMode.value = true;
  currentEditItem.value = { ...row };
  
  // 填充表单数据
  Object.assign(addForm, {
    type: row.type,
    name: row.name,
    category: row.category,
    operator: row.operator,
    codeCount: row.codeCount,
    description: row.description
  });
  
  dialogVisible.value = true;
};

// 删除操作
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除物资 "${row.name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 从表格数据和原始数据中删除
    const tableIndex = tableData.value.findIndex(item => item.id === row.id);
    const originalIndex = originalTableData.value.findIndex(item => item.id === row.id);
    
    if (tableIndex > -1) {
      tableData.value.splice(tableIndex, 1);
    }
    if (originalIndex > -1) {
      originalTableData.value.splice(originalIndex, 1);
    }
    
    pagination.total = tableData.value.length;
    ElMessage.success('删除成功');
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 分页处理
const handlePageChange = (page: number) => {
  pagination.currentPage = page;
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
};

onMounted(() => {
  console.log("能源物资管理页面已加载");
  // 初始化原始数据备份
  originalTableData.value = [...tableData.value];
});
</script>

<template>
  <div class="policy-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="content-area">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-left">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索物资名称、编码或操作人"
            prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
        <div class="search-right">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
            class="status-select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 表格区域 -->
      <ItemWrap title="能源物资列表" class="table-wrapper">
        <!-- 操作按钮区域 -->
        <div class="action-bar">
          <div class="action-left">
            <el-button type="primary" @click="handleSearch" icon="Search">
              查询
            </el-button>
            <el-button @click="handleReset" icon="Refresh">
              重置
            </el-button>
          </div>
          <div class="action-right">
            <el-button type="success" @click="handleAdd" icon="Plus">
              新增
            </el-button>
          </div>
        </div>

        <!-- 数据表格 -->
        <el-table
          :data="paginatedData"
          stripe
          class="material-table"
          header-cell-class-name="table-header"
        >
          <el-table-column prop="code" label="物资编码" width="120" align="center" />
          <el-table-column prop="name" label="物资名称" width="150" align="center" />
          <el-table-column prop="type" label="物资类型" width="120" align="center" />
          <el-table-column prop="operator" label="操作人" width="100" align="center" />
          <el-table-column prop="generateTime" label="生成时间" width="160" align="center" />
          <el-table-column prop="downloadTime" label="下载时间" width="160" align="center">
            <template #default="{ row }">
              <span v-if="row.downloadTime">{{ row.downloadTime }}</span>
              <el-tag v-else type="info" size="small">未下载</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="codeCount" label="码数量" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="primary" size="small">{{ row.codeCount }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '1' ? 'success' : 'warning'">
                {{ row.status === '1' ? '已生成' : '未生成' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="info" size="small" text @click="handleViewDetail(row)">
                  查看详情
                </el-button>
                <el-button type="primary" size="small" text @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" text @click="handleDelete(row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            class="custom-pagination"
          />
        </div>
      </ItemWrap>
    </div>

    <!-- 新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '编辑物资' : '新增物资'"
      width="600px"
      :before-close="handleCancel"
      class="add-dialog"
    >
      <el-form
        ref="formRef"
        :model="addForm"
        :rules="rules"
        label-width="120px"
        class="add-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物资类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入物资名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物资分类" prop="category">
              <el-select v-model="addForm.category" placeholder="请选择">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="addForm.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="码数量" prop="codeCount">
              <el-input-number v-model="addForm.codeCount" :min="1" placeholder="请输入码数量" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="物资描述" prop="description">
          <el-input
            v-model="addForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入物资描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEditMode ? '更新' : '确定' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="物资详情"
      width="500px"
      class="detail-dialog"
    >
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">物资编码：</span>
          <span class="value">{{ currentDetail.code }}</span>
        </div>
        <div class="detail-item">
          <span class="label">物资名称：</span>
          <span class="value">{{ currentDetail.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">物资类型：</span>
          <span class="value">{{ currentDetail.type }}</span>
        </div>
        <div class="detail-item">
          <span class="label">物资分类：</span>
          <span class="value">{{ currentDetail.category }}</span>
        </div>
        <div class="detail-item">
          <span class="label">操作人：</span>
          <span class="value">{{ currentDetail.operator }}</span>
        </div>
        <div class="detail-item">
          <span class="label">生成时间：</span>
          <span class="value">{{ currentDetail.generateTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">下载时间：</span>
          <span class="value">{{ currentDetail.downloadTime || '未下载' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">码数量：</span>
          <span class="value">{{ currentDetail.codeCount }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <span class="value">{{ currentDetail.status === '1' ? '已生成' : '未生成' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">物资描述：</span>
          <span class="value">{{ currentDetail.description }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.policy-container {
  width: 100%;
  height: calc(100vh - 64px);
  padding: 32px;
  box-sizing: border-box;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  margin-bottom: 40px;
  
  .page-title {
    color: #1a1a1a;
    font-size: 28px;
    font-weight: 300;
    text-align: center;
    margin: 0;
    letter-spacing: -0.5px;
  }
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 搜索区域样式 */
.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #e5e5e5;
}

.search-left {
  flex: 1;
  max-width: 450px;
}

.search-right {
  margin-left: 24px;
}

.search-input {
  width: 100%;
  height: 42px;
}

.status-select {
  width: 220px;
  height: 42px;
}

/* 表格包装器样式 */
.table-wrapper {
  flex: 1;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
}

/* 操作按钮区域样式 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
}

.action-left {
  display: flex;
  gap: 12px;
}

.action-right {
  display: flex;
  gap: 12px;
}

/* 表格样式 */
.material-table {
  margin: 0;
  background: #ffffff;
  min-height: 300px;
}

:deep(.table-header) {
  background: #f8f9fa !important;
  color: #495057 !important;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
}

:deep(.el-table__body tr) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #f8f9fa !important;
}

:deep(.el-table td) {
  padding: 16px 12px;
  font-size: 14px;
  color: #495057;
}

:deep(.el-table th) {
  padding: 16px 12px;
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px 32px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
}

.custom-pagination {
  background: transparent;
}

:deep(.el-pagination) {
  color: #495057;
}

:deep(.el-pagination .el-pager li) {
  background: #ffffff;
  color: #495057;
  border: 1px solid #e5e5e5;
  margin: 0 2px;
  border-radius: 4px;
  min-width: 32px;
  height: 32px;
  line-height: 30px;
}

:deep(.el-pagination .el-pager li:hover) {
  background: #f8f9fa;
  border-color: #d0d7de;
}

:deep(.el-pagination .el-pager li.is-active) {
  background: #1a1a1a;
  color: #ffffff;
  border-color: #1a1a1a;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background: #ffffff;
  color: #495057;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin: 0 2px;
  min-width: 32px;
  height: 32px;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  background: #f8f9fa;
  border-color: #d0d7de;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  margin: 0;
  min-width: 60px;
  font-size: 12px;
  padding: 4px 8px;
}

.action-buttons .el-button--text {
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.action-buttons .el-button--text:hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
}

.action-buttons .el-button--text.el-button--info:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
  border-color: rgba(64, 158, 255, 0.2);
}

.action-buttons .el-button--text.el-button--primary {
   background-color: #ffffff;
   border: 1px solid #d0d7de;
 }
 
 .action-buttons .el-button--text.el-button--primary:hover {
   color: #409eff;
   background-color: #ffffff;
   border-color: rgba(64, 158, 255, 0.2);
 }
 
 .action-buttons .el-button--text.el-button--danger {
   background-color: #ffffff;
   border: 1px solid #d0d7de;
 }
 
 .action-buttons .el-button--text.el-button--danger:hover {
   color: #f56c6c;
   background-color: #ffffff;
   border-color: rgba(245, 108, 108, 0.2);
 }

/* 对话框样式 */
.add-dialog {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: #ffffff;
  color: #1a1a1a;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e5e5;
}

:deep(.el-dialog__title) {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 18px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #6c757d;
  font-size: 18px;
}

:deep(.el-dialog__headerbtn .el-dialog__close:hover) {
  color: #1a1a1a;
}

.add-form {
  padding: 32px;
}

.dialog-footer {
  text-align: right;
  padding: 24px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e5e5e5;
}

/* 详情对话框样式 */
.detail-dialog {
  :deep(.el-dialog) {
    max-width: 90vw;
  }
  
  :deep(.el-dialog__body) {
    padding: 20px 24px;
  }
}

.detail-content {
  :deep(.el-descriptions) {
    border-radius: 8px;
    overflow: hidden;
  }
  
  :deep(.el-descriptions__header) {
    background: #fafafa;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  :deep(.el-descriptions__title) {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
  }
  
  :deep(.el-descriptions__body) {
    background: white;
  }
  
  :deep(.el-descriptions__table) {
    border-collapse: collapse;
    width: 100%;
  }
  
  :deep(.el-descriptions-item__cell) {
    border: 1px solid #f0f0f0;
    padding: 12px 16px;
    vertical-align: top;
  }
  
  :deep(.el-descriptions-item__label) {
    background: #fafafa;
    color: #595959;
    font-weight: 600;
    width: 140px;
    min-width: 140px;
  }
  
  :deep(.el-descriptions-item__content) {
     background: white;
     color: #262626;
     word-break: break-all;
    }
 }
 
 /* Element Plus 组件样式覆盖 */
 :deep(.el-input__wrapper) {
   background: #ffffff;
   border: 1px solid #d0d7de;
   border-radius: 6px;
   box-shadow: none;
   transition: all 0.2s ease;
 }
 
 :deep(.el-input__wrapper:hover) {
   border-color: #8c959f;
 }
 
 :deep(.el-input__wrapper.is-focus) {
   border-color: #1a1a1a;
   box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
 }
 
 :deep(.el-select__wrapper) {
   background: #ffffff;
   border: 1px solid #d0d7de;
   border-radius: 6px;
   box-shadow: none;
   transition: all 0.2s ease;
 }
 
 :deep(.el-select__wrapper:hover) {
   border-color: #8c959f;
 }
 
 :deep(.el-select__wrapper.is-focused) {
   border-color: #1a1a1a;
   box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
 }
 
 :deep(.el-button) {
   border-radius: 6px;
   font-weight: 500;
   transition: all 0.2s ease;
 }
 
 :deep(.el-button--primary) {
   background: #1a1a1a;
   border-color: #1a1a1a;
 }
 
 :deep(.el-button--primary:hover) {
   background: #333333;
   border-color: #333333;
 }
 
 :deep(.el-button--success) {
   background: #28a745;
   border-color: #28a745;
 }
 
 :deep(.el-button--success:hover) {
   background: #218838;
   border-color: #1e7e34;
 }
 
 :deep(.el-button--danger) {
   background: #dc3545;
   border-color: #dc3545;
 }
 
 :deep(.el-button--danger:hover) {
   background: #c82333;
   border-color: #bd2130;
 }
 
 :deep(.el-button--default) {
   background: #f8f9fa;
   border-color: #d0d7de;
   color: #495057;
 }
 
 :deep(.el-button--default:hover) {
   background: #e9ecef;
   border-color: #adb5bd;
   color: #495057;
 }
 </style>