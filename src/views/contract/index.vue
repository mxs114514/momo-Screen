<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import ItemWrap from "@/components/item-wrap";
import dayjs from "dayjs";

// 页面标题
const pageTitle = ref("合同管理");

// 搜索表单
const searchForm = reactive({
  contractDate: "",
  contractNo: "",
  status: "",
  expireDays: "",
  contractType: ""
});

// 状态选项
const statusOptions = [
  { label: "生效中", value: "active" },
  { label: "已到期", value: "expired" },
  { label: "即将到期", value: "expiring" },
  { label: "已终止", value: "terminated" }
];

// 合同到期天数选项
const expireDaysOptions = [
  { label: "30天内", value: "30" },
  { label: "60天内", value: "60" },
  { label: "90天内", value: "90" },
  { label: "已过期", value: "expired" }
];

// 合同类型选项
const contractTypeOptions = [
  { label: "采购合同", value: "purchase" },
  { label: "销售合同", value: "sales" },
  { label: "服务合同", value: "service" },
  { label: "租赁合同", value: "lease" },
  { label: "技术合同", value: "technical" }
];

// 表格数据
const tableData = ref([
  {
    id: 1,
    contractDate: "2024-01-15",
    contractNo: "CT202401001",
    contractType: "采购合同",
    supplier: "新能源设备有限公司",
    organization: "采购部",
    effectiveDate: "2024-01-15",
    expiryDate: "2024-12-15",
    expireDays: 45,
    totalAmount: 500000,
    prepayAmount: 150000,
    status: "active"
  },
  {
    id: 2,
    contractDate: "2024-02-10",
    contractNo: "CT202402001",
    contractType: "服务合同",
    supplier: "智能运维服务公司",
    organization: "技术部",
    effectiveDate: "2024-02-10",
    expiryDate: "2025-02-10",
    expireDays: 180,
    totalAmount: 300000,
    prepayAmount: 90000,
    status: "active"
  },
  {
    id: 3,
    contractDate: "2023-06-20",
    contractNo: "CT202306001",
    contractType: "销售合同",
    supplier: "绿色能源科技公司",
    organization: "销售部",
    effectiveDate: "2023-06-20",
    expiryDate: "2024-06-20",
    expireDays: -150,
    totalAmount: 800000,
    prepayAmount: 200000,
    status: "expired"
  },
  {
    id: 4,
    contractDate: "2024-03-05",
    contractNo: "CT202403001",
    contractType: "租赁合同",
    supplier: "设备租赁有限公司",
    organization: "生产部",
    effectiveDate: "2024-03-05",
    expiryDate: "2024-09-05",
    expireDays: 25,
    totalAmount: 120000,
    prepayAmount: 36000,
    status: "expiring"
  },
  {
    id: 5,
    contractDate: "2024-01-30",
    contractNo: "CT202401002",
    contractType: "技术合同",
    supplier: "能源技术研发中心",
    organization: "研发部",
    effectiveDate: "2024-01-30",
    expiryDate: "2025-01-30",
    expireDays: 200,
    totalAmount: 450000,
    prepayAmount: 135000,
    status: "active"
  }
]);

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 5
});

// 原始数据备份
const originalTableData = ref([...tableData.value]);

// 过滤后的数据
const filteredData = computed(() => {
  let result = [...originalTableData.value];
  
  // 合同日期筛选
  if (searchForm.contractDate) {
    result = result.filter(item => item.contractDate === searchForm.contractDate);
  }
  
  // 合同号筛选
  if (searchForm.contractNo.trim()) {
    const keyword = searchForm.contractNo.toLowerCase();
    result = result.filter(item => 
      item.contractNo.toLowerCase().includes(keyword)
    );
  }
  
  // 状态筛选
  if (searchForm.status !== '') {
    result = result.filter(item => item.status === searchForm.status);
  }
  
  // 合同到期天数筛选
  if (searchForm.expireDays !== '') {
    if (searchForm.expireDays === 'expired') {
      result = result.filter(item => item.expireDays < 0);
    } else {
      const days = parseInt(searchForm.expireDays);
      result = result.filter(item => item.expireDays > 0 && item.expireDays <= days);
    }
  }
  
  // 合同类型筛选
  if (searchForm.contractType !== '') {
    result = result.filter(item => item.contractType === searchForm.contractType);
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
  contractDate: "",
  contractNo: "",
  contractType: "",
  supplier: "",
  organization: "",
  effectiveDate: "",
  expiryDate: "",
  totalAmount: "",
  prepayAmount: "",
  status: "active"
});

// 表单验证规则
const rules: FormRules = {
  contractNo: [
    { required: true, message: '请输入合同号', trigger: 'blur' }
  ],
  contractType: [
    { required: true, message: '请选择合同类型', trigger: 'change' }
  ],
  supplier: [
    { required: true, message: '请输入供应商', trigger: 'blur' }
  ],
  organization: [
    { required: true, message: '请输入采购组织', trigger: 'blur' }
  ],
  effectiveDate: [
    { required: true, message: '请选择合同生效日期', trigger: 'change' }
  ],
  expiryDate: [
    { required: true, message: '请选择合同失效日期', trigger: 'change' }
  ],
  totalAmount: [
    { required: true, message: '请输入合同总额', trigger: 'blur' }
  ]
};

// 搜索处理
const handleSearch = () => {
  tableData.value = filteredData.value;
  pagination.total = filteredData.value.length;
  pagination.currentPage = 1;
  ElMessage.success('查询完成');
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    contractDate: "",
    contractNo: "",
    status: "",
    expireDays: "",
    contractType: ""
  });
  tableData.value = [...originalTableData.value];
  pagination.total = originalTableData.value.length;
  pagination.currentPage = 1;
  ElMessage.success('重置完成');
};

// 新增处理
const handleAdd = () => {
  isEditMode.value = false;
  Object.assign(addForm, {
    contractDate: "",
    contractNo: "",
    contractType: "",
    supplier: "",
    organization: "",
    effectiveDate: "",
    expiryDate: "",
    totalAmount: "",
    prepayAmount: "",
    status: "active"
  });
  dialogVisible.value = true;
};

// 编辑处理
const handleEdit = (row: any) => {
  isEditMode.value = true;
  currentEditItem.value = { ...row };
  Object.assign(addForm, row);
  dialogVisible.value = true;
};

// 查看详情
const handleViewDetail = (row: any) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除处理
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除合同号为 "${row.contractNo}" 的合同吗？`,
    '删除确认',
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

// 保存处理
const handleSave = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    // 计算到期天数
    const expireDays = dayjs(addForm.expiryDate).diff(dayjs(), 'day');
    
    if (isEditMode.value) {
      // 编辑模式
      const index = tableData.value.findIndex(item => item.id === currentEditItem.value.id);
      const originalIndex = originalTableData.value.findIndex(item => item.id === currentEditItem.value.id);
      
      const updatedItem = {
        ...currentEditItem.value,
        ...addForm,
        expireDays,
        totalAmount: Number(addForm.totalAmount),
        prepayAmount: Number(addForm.prepayAmount)
      };
      
      if (index > -1) {
        tableData.value[index] = updatedItem;
      }
      if (originalIndex > -1) {
        originalTableData.value[originalIndex] = updatedItem;
      }
      
      ElMessage.success('编辑成功');
    } else {
      // 新增模式
      const newItem = {
        id: Date.now(),
        ...addForm,
        expireDays,
        totalAmount: Number(addForm.totalAmount),
        prepayAmount: Number(addForm.prepayAmount)
      };
      
      tableData.value.push(newItem);
      originalTableData.value.push(newItem);
      pagination.total = tableData.value.length;
      
      ElMessage.success('新增成功');
    }
    
    dialogVisible.value = false;
  } catch (error) {
    console.log('表单验证失败:', error);
  }
};

// 取消处理
const handleCancel = () => {
  dialogVisible.value = false;
};

// 分页处理
const handlePageChange = (page: number) => {
  pagination.currentPage = page;
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
};

// 状态显示
const getStatusType = (status: string) => {
  const statusMap = {
    'active': 'success',
    'expired': 'danger',
    'expiring': 'warning',
    'terminated': 'info'
  };
  return statusMap[status] || 'info';
};

const getStatusText = (status: string) => {
  const statusMap = {
    'active': '生效中',
    'expired': '已到期',
    'expiring': '即将到期',
    'terminated': '已终止'
  };
  return statusMap[status] || status;
};

// 合同类型显示
const getContractTypeText = (type: string) => {
  const typeMap = {
    'purchase': '采购合同',
    'sales': '销售合同',
    'service': '服务合同',
    'lease': '租赁合同',
    'technical': '技术合同'
  };
  return typeMap[type] || type;
};

onMounted(() => {
  console.log("合同管理页面已加载");
  // 初始化原始数据备份
  originalTableData.value = [...tableData.value];
});
</script>

<template>
  <div class="contract-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="content-area">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-row">
          <div class="search-item">
            <el-date-picker
              v-model="searchForm.contractDate"
              type="date"
              placeholder="选择合同日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              clearable
              class="date-picker"
            />
          </div>
          <div class="search-item">
            <el-input
              v-model="searchForm.contractNo"
              placeholder="输入合同号"
              clearable
              class="search-input"
            />
          </div>
          <div class="search-item">
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
          <div class="search-item">
            <el-select
              v-model="searchForm.expireDays"
              placeholder="选择合同到期天数"
              clearable
              class="expire-select"
            >
              <el-option
                v-for="item in expireDaysOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="search-item">
            <el-select
              v-model="searchForm.contractType"
              placeholder="选择合同类型"
              clearable
              class="type-select"
            >
              <el-option
                v-for="item in contractTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <ItemWrap title="合同列表" class="table-wrapper">
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
          class="contract-table"
          header-cell-class-name="table-header"
        >
          <el-table-column prop="contractDate" label="合同日期" width="120" align="center" />
          <el-table-column prop="contractNo" label="合同号" width="140" align="center" />
          <el-table-column prop="contractType" label="合同类型" width="120" align="center">
            <template #default="{ row }">
              {{ getContractTypeText(row.contractType) }}
            </template>
          </el-table-column>
          <el-table-column prop="supplier" label="供应商" width="180" align="center" />
          <el-table-column prop="organization" label="采购组织" width="120" align="center" />
          <el-table-column prop="effectiveDate" label="合同生效日期" width="130" align="center" />
          <el-table-column prop="expiryDate" label="合同失效日期" width="130" align="center" />
          <el-table-column prop="expireDays" label="到期天数" width="100" align="center">
            <template #default="{ row }">
              <span :class="{
                'expire-warning': row.expireDays > 0 && row.expireDays <= 30,
                'expire-danger': row.expireDays < 0
              }">
                {{ row.expireDays }}天
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="合同总额" width="120" align="center">
            <template #default="{ row }">
              ¥{{ row.totalAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="prepayAmount" label="预付金额" width="120" align="center">
            <template #default="{ row }">
              ¥{{ row.prepayAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
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
            :page-sizes="[5, 10, 20, 50]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </ItemWrap>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="isEditMode ? '编辑合同' : '新增合同'"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
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
            <el-form-item label="合同日期" prop="contractDate">
              <el-date-picker
                v-model="addForm.contractDate"
                type="date"
                placeholder="选择合同日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号" prop="contractNo">
              <el-input v-model="addForm.contractNo" placeholder="请输入合同号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同类型" prop="contractType">
              <el-select v-model="addForm.contractType" placeholder="请选择合同类型" style="width: 100%">
                <el-option
                  v-for="item in contractTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="addForm.supplier" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购组织" prop="organization">
              <el-input v-model="addForm.organization" placeholder="请输入采购组织" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="addForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="addForm.effectiveDate"
                type="date"
                placeholder="选择生效日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同失效日期" prop="expiryDate">
              <el-date-picker
                v-model="addForm.expiryDate"
                type="date"
                placeholder="选择失效日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同总额" prop="totalAmount">
              <el-input v-model="addForm.totalAmount" placeholder="请输入合同总额" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付金额" prop="prepayAmount">
              <el-input v-model="addForm.prepayAmount" placeholder="请输入预付金额" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      title="合同详情"
      v-model="detailDialogVisible"
      width="600px"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同日期">{{ currentDetail.contractDate }}</el-descriptions-item>
          <el-descriptions-item label="合同号">{{ currentDetail.contractNo }}</el-descriptions-item>
          <el-descriptions-item label="合同类型">{{ getContractTypeText(currentDetail.contractType) }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ currentDetail.supplier }}</el-descriptions-item>
          <el-descriptions-item label="采购组织">{{ currentDetail.organization }}</el-descriptions-item>
          <el-descriptions-item label="合同生效日期">{{ currentDetail.effectiveDate }}</el-descriptions-item>
          <el-descriptions-item label="合同失效日期">{{ currentDetail.expiryDate }}</el-descriptions-item>
          <el-descriptions-item label="到期天数">{{ currentDetail.expireDays }}天</el-descriptions-item>
          <el-descriptions-item label="合同总额">¥{{ currentDetail.totalAmount?.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="预付金额">¥{{ currentDetail.prepayAmount?.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentDetail.status)">
              {{ getStatusText(currentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.contract-container {
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  gap: 24px;
  background-image: url("@/assets/img/pageBg.png");
  background-size: cover;
  background-position: center center;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.search-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .search-row {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;

    .search-item {
      flex: 1;
      min-width: 200px;

      .search-input {
        width: 100%;
      }

      .date-picker {
        width: 100%;
      }

      .status-select,
      .expire-select,
      .type-select {
        width: 100%;
      }
    }
  }
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0;

  .action-left {
    display: flex;
    gap: 12px;
  }

  .action-right {
    display: flex;
    gap: 12px;
  }
}

.contract-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

:deep(.table-header) {
  background: #f8f9fa !important;
  color: #495057 !important;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e9ecef;
}

:deep(.el-table th) {
  text-align: center;
}

:deep(.el-table td) {
  text-align: center;
}

.action-buttons {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.add-form {
  padding: 20px 0;
}

.detail-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.expire-warning {
  color: #e6a23c;
  font-weight: 600;
}

.expire-danger {
  color: #f56c6c;
  font-weight: 600;
}
</style>