<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import ItemWrap from "@/components/item-wrap";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 页面数据
const pageTitle = ref("采购订单");

// 搜索表单
const searchForm = reactive({
  dateRange: [],
  dateType: "week", // day, week, month
  status: "",
  sourceType: ""
});

// 日期快捷选项
const dateShortcuts = [
  {
    text: "当日",
    value: () => {
      const today = new Date();
      return [today, today];
    }
  },
  {
    text: "近七天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "近一月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  }
];

// 状态选项
const statusOptions = [
  { label: "全部", value: "" },
  { label: "新增", value: "new" },
  { label: "待审核", value: "pending_review" },
  { label: "已审核", value: "reviewed" },
  { label: "待确认", value: "pending_confirm" },
  { label: "待发货", value: "pending_delivery" },
  { label: "已发货", value: "delivered" },
  { label: "业务完成", value: "completed" }
];

// 来源类别选项
const sourceTypeOptions = [
  { label: "全部", value: "" },
  { label: "手工创建", value: "manual" },
  { label: "采购申请", value: "purchase_request" },
  { label: "销售订单", value: "sales_order" }
];

// 表格数据
const tableData = ref([
  {
    id: 1,
    orderNo: "PO202401001",
    sourceType: "manual",
    purchaseType: "原材料采购",
    supplier: "华东钢铁有限公司",
    organization: "采购部",
    prepayAmount: 50000,
    description: "钢材采购订单",
    createTime: "2024-01-15 10:30:00",
    status: "pending_review",
    operator: "张三",
    totalAmount: 150000
  },
  {
    id: 2,
    orderNo: "PO202401002",
    sourceType: "purchase_request",
    purchaseType: "设备采购",
    supplier: "绿色化工设备公司",
    organization: "技术部",
    prepayAmount: 80000,
    description: "化工设备采购",
    createTime: "2024-01-16 09:15:00",
    status: "reviewed",
    operator: "李四",
    totalAmount: 280000
  },
  {
    id: 3,
    orderNo: "PO202401003",
    sourceType: "sales_order",
    purchaseType: "原材料采购",
    supplier: "智能制造供应商",
    organization: "生产部",
    prepayAmount: 30000,
    description: "生产原料采购",
    createTime: "2024-01-17 14:20:00",
    status: "pending_delivery",
    operator: "王五",
    totalAmount: 120000
  },
  {
    id: 4,
    orderNo: "PO202401004",
    sourceType: "manual",
    purchaseType: "办公用品",
    supplier: "办公设备供应商",
    organization: "行政部",
    prepayAmount: 5000,
    description: "办公设备采购",
    createTime: "2024-01-18 16:45:00",
    status: "delivered",
    operator: "赵六",
    totalAmount: 25000
  },
  {
    id: 5,
    orderNo: "PO202401005",
    sourceType: "purchase_request",
    purchaseType: "原材料采购",
    supplier: "新能源材料公司",
    organization: "研发部",
    prepayAmount: 60000,
    description: "新能源材料采购",
    createTime: "2024-01-19 08:30:00",
    status: "completed",
    operator: "孙七",
    totalAmount: 200000
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
  
  // 状态筛选
  if (searchForm.status !== '') {
    result = result.filter(item => item.status === searchForm.status);
  }
  
  // 来源类别筛选
  if (searchForm.sourceType !== '') {
    result = result.filter(item => item.sourceType === searchForm.sourceType);
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
  sourceType: "",
  purchaseType: "",
  supplier: "",
  organization: "",
  prepayAmount: "",
  description: ""
});

// 表单验证规则
const rules: FormRules = {
  sourceType: [{ required: true, message: "请选择来源类别", trigger: "change" }],
  purchaseType: [{ required: true, message: "请输入采购类型", trigger: "blur" }],
  supplier: [{ required: true, message: "请输入供应商", trigger: "blur" }],
  organization: [{ required: true, message: "请输入采购组织", trigger: "blur" }]
};

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    new: "info",
    pending_review: "warning",
    reviewed: "success",
    pending_confirm: "warning",
    pending_delivery: "primary",
    delivered: "success",
    completed: "success"
  };
  return statusMap[status] || "info";
};

// 获取状态文本
const getStatusText = (status: string) => {
  const option = statusOptions.find(item => item.value === status);
  return option ? option.label : status;
};

// 获取来源类别文本
const getSourceTypeText = (sourceType: string) => {
  const option = sourceTypeOptions.find(item => item.value === sourceType);
  return option ? option.label : sourceType;
};

// 搜索功能
const handleSearch = () => {
  console.log("搜索条件:", searchForm);
  
  tableData.value = [...filteredData.value];
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
  searchForm.dateRange = [];
  searchForm.dateType = "week";
  searchForm.status = "";
  searchForm.sourceType = "";
  
  tableData.value = [...originalTableData.value];
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

// 提交操作
const handleSubmit = (row: any) => {
  ElMessageBox.confirm('确定要提交该采购订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('提交成功');
  });
};

// 编辑操作
const handleEdit = (row: any) => {
  isEditMode.value = true;
  currentEditItem.value = { ...row };
  Object.assign(addForm, row);
  dialogVisible.value = true;
};

// 删除操作
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该采购订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index > -1) {
      tableData.value.splice(index, 1);
      pagination.total = tableData.value.length;
      ElMessage.success('删除成功');
    }
  });
};

// 查看详情
const handleDetail = (row: any) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

// 关闭操作
const handleClose = (row: any) => {
  ElMessageBox.confirm('确定要关闭该采购订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('关闭成功');
  });
};

// 提交表单
const handleFormSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        const index = tableData.value.findIndex(item => item.id === currentEditItem.value.id);
        if (index > -1) {
          Object.assign(tableData.value[index], addForm);
          ElMessage.success('修改成功');
        }
      } else {
        const newItem = {
          id: Date.now(),
          orderNo: `PO${Date.now()}`,
          ...addForm,
          createTime: new Date().toLocaleString(),
          status: 'new',
          operator: '当前用户',
          totalAmount: Number(addForm.prepayAmount) * 2
        };
        tableData.value.unshift(newItem);
        originalTableData.value.unshift(newItem);
        pagination.total = tableData.value.length;
        ElMessage.success('新增成功');
      }
      dialogVisible.value = false;
      formRef.value?.resetFields();
    }
  });
};

// 分页改变
const handlePageChange = (page: number) => {
  pagination.currentPage = page;
};

// 页面大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
};

onMounted(() => {
  console.log("采购订单页面已加载");
  // 默认设置近七天
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  searchForm.dateRange = [start, end];
});
</script>

<template>
  <div class="report-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="content-area">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-left">
          <div class="search-item">
            <label>采购日期：</label>
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
              class="date-picker"
            />
          </div>
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
          <el-select
            v-model="searchForm.sourceType"
            placeholder="选择来源类别"
            clearable
            class="source-select"
          >
            <el-option
              v-for="item in sourceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 表格区域 -->
      <ItemWrap title="采购订单列表" class="table-wrapper">
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
          class="purchase-table"
          header-cell-class-name="table-header"
        >
          <el-table-column prop="orderNo" label="订单编号" min-width="140" />
          <el-table-column prop="sourceType" label="来源类别" min-width="120">
            <template #default="{ row }">
              {{ getSourceTypeText(row.sourceType) }}
            </template>
          </el-table-column>
          <el-table-column prop="purchaseType" label="采购类型" min-width="120" />
          <el-table-column prop="supplier" label="供应商" min-width="180" />
          <el-table-column prop="organization" label="采购组织" min-width="100" />
          <el-table-column prop="prepayAmount" label="预付金额" min-width="120">
            <template #default="{ row }">
              ¥{{ row.prepayAmount?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160" />
          <el-table-column label="操作" width="350" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="text" @click="handleSubmit(row)" size="small">
                  提交
                </el-button>
                <el-button type="primary" @click="handleEdit(row)" size="small">
                  编辑
                </el-button>
                <el-button type="danger" @click="handleDelete(row)" size="small">
                  删除
                </el-button>
                <el-button type="text" @click="handleDetail(row)" size="small">
                  查询
                </el-button>
                <el-button type="text" @click="handleClose(row)" size="small">
                  关闭
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
      v-model="dialogVisible"
      :title="isEditMode ? '编辑采购订单' : '新增采购订单'"
      width="800px"
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
            <el-form-item label="来源类别" prop="sourceType">
              <el-select v-model="addForm.sourceType" placeholder="请选择来源类别">
                <el-option
                  v-for="item in sourceTypeOptions.filter(opt => opt.value)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购类型" prop="purchaseType">
              <el-input v-model="addForm.purchaseType" placeholder="请输入采购类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="addForm.supplier" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购组织" prop="organization">
              <el-input v-model="addForm.organization" placeholder="请输入采购组织" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预付金额" prop="prepayAmount">
              <el-input-number
                v-model="addForm.prepayAmount"
                :min="0"
                :precision="2"
                placeholder="请输入预付金额"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购说明">
              <el-input v-model="addForm.description" placeholder="请输入采购说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="采购订单详情"
      width="900px"
      class="detail-dialog"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单编号">{{ currentDetail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="来源类别">{{ getSourceTypeText(currentDetail.sourceType) }}</el-descriptions-item>
          <el-descriptions-item label="采购类型">{{ currentDetail.purchaseType }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ currentDetail.supplier }}</el-descriptions-item>
          <el-descriptions-item label="采购组织">{{ currentDetail.organization }}</el-descriptions-item>
          <el-descriptions-item label="预付金额">¥{{ currentDetail.prepayAmount?.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentDetail.status)">
              {{ getStatusText(currentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="操作员">{{ currentDetail.operator }}</el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ currentDetail.totalAmount?.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="采购说明" :span="2">{{ currentDetail.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.report-container {
  width: 100%;
  height: calc(100vh - 64px);
  padding: 32px;
  background: #fafbfc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 40px;
  text-align: left;

  .page-title {
    color: #1a1a1a;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
  }
}

.content-area {
  display: flex;
  flex-direction: column;
  height: calc(100% - 120px);
  gap: 24px;
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  transition: border-color 0.2s ease;

  .search-left {
    display: flex;
    align-items: center;
    flex: 1;

    .search-item {
      display: flex;
      align-items: center;
      margin-right: 24px;

      label {
        margin-right: 12px;
        font-weight: 600;
        color: #34495e;
        white-space: nowrap;
        font-size: 14px;
      }

      .date-picker {
        width: 320px;
      }
    }
  }

  .search-right {
    display: flex;
    gap: 16px;
    align-items: center;

    .status-select,
    .source-select {
      width: 160px;
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

.purchase-table {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table__header-wrapper) {
    background: #f9fafb;
  }

  :deep(.el-table th) {
    background: #f9fafb;
    color: #374151;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
    padding: 16px 12px;
    font-size: 14px;
    text-align: center;
  }

  :deep(.el-table__row) {
    transition: background-color 0.2s ease;

    &:hover {
      background: #f9fafb;
    }
  }

  :deep(.el-table td) {
    padding: 16px 12px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #374151;
    text-align: center;
  }

  :deep(.el-table__body tr:last-child td) {
    border-bottom: none;
  }

  .action-buttons {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px 0;

  :deep(.el-pagination) {
    .btn-prev,
    .btn-next {
      background: white;
      border: 1px solid #d1d5db;
      color: #6b7280;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        color: #374151;
        border-color: #9ca3af;
        background: #f9fafb;
      }
    }

    .el-pager li {
      background: white;
      border: 1px solid #d1d5db;
      margin: 0 2px;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s ease;

      &:hover {
        color: #374151;
        border-color: #9ca3af;
        background: #f9fafb;
      }

      &.is-active {
        background: #1f2937;
        border-color: #1f2937;
        color: white;
      }
    }

    .el-pagination__total,
    .el-pagination__jump {
      color: #6b7280;
      font-weight: 400;
    }
  }
}

.add-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 24px 32px;
    margin: 0;
    border-bottom: none;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.1"/></svg>');
      pointer-events: none;
    }

    .el-dialog__title {
      font-size: 20px;
      font-weight: 600;
      color: white;
      position: relative;
      z-index: 1;
    }

    .el-dialog__close {
      color: white;
      font-size: 18px;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;

      &:hover {
        color: rgba(255, 255, 255, 0.8);
        transform: rotate(90deg);
      }
    }
  }

  .add-form {
    padding: 32px;
    background: rgba(255, 255, 255, 0.95);

    :deep(.el-form-item) {
      margin-bottom: 24px;

      .el-form-item__label {
        font-weight: 600;
        color: #2c3e50;
        font-size: 14px;
        padding-bottom: 8px;
      }

      .el-form-item__content {
        .el-input,
        .el-select,
        .el-input-number {
          .el-input__wrapper,
          .el-select__wrapper {
            border-radius: 8px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);

            &:hover {
              border-color: rgba(102, 126, 234, 0.4);
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
            }

            &.is-focus {
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
          }
        }
      }
    }
  }

  .dialog-footer {
    padding: 20px 32px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    border-top: 1px solid rgba(102, 126, 234, 0.1);
    text-align: right;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .el-button {
      border-radius: 8px;
      padding: 10px 24px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:not(.el-button--primary) {
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid rgba(102, 126, 234, 0.2);
        color: #667eea;

        &:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
      }

      &.el-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;

        &:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }
}

.detail-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    max-width: 900px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 24px 32px;
    margin: 0;
    border-bottom: none;

    .el-dialog__title {
      font-size: 20px;
      font-weight: 600;
      color: white;
    }

    .el-dialog__close {
      color: white;
      font-size: 18px;
      transition: all 0.3s ease;

      &:hover {
        color: rgba(255, 255, 255, 0.8);
        transform: rotate(90deg);
      }
    }
  }

  .detail-content {
    padding: 32px;
    background: rgba(255, 255, 255, 0.95);

    :deep(.el-descriptions) {
      .el-descriptions__header {
        margin-bottom: 24px;

        .el-descriptions__title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      .el-descriptions__table {
        border: 1px solid rgba(102, 126, 234, 0.2);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

        .el-descriptions__cell {
          border: 1px solid rgba(102, 126, 234, 0.1);
          padding: 16px 20px;
          transition: all 0.3s ease;

          &.is-bordered-label {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            font-weight: 600;
            color: #667eea;
            font-size: 14px;
          }

          &:not(.is-bordered-label) {
            background: rgba(255, 255, 255, 0.9);
            color: #2c3e50;
            font-weight: 500;

            &:hover {
              background: rgba(102, 126, 234, 0.05);
            }
          }
        }
      }
    }
  }
}

// Element Plus 组件样式覆盖
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 6px;
    transition: all 0.2s ease;
    border: 1px solid #d1d5db;
    background: white;

    &:hover {
      border-color: #9ca3af;
    }

    &.is-focus {
      border-color: #1f2937;
      box-shadow: 0 0 0 1px #1f2937;
    }
  }
}

:deep(.el-select) {
  .el-select__wrapper {
    border-radius: 6px;
    transition: all 0.2s ease;
    border: 1px solid #d1d5db;
    background: white;

    &:hover {
      border-color: #9ca3af;
    }

    &.is-focus {
      border-color: #1f2937;
      box-shadow: 0 0 0 1px #1f2937;
    }
  }
}

:deep(.el-date-editor) {
  .el-input__wrapper {
    border-radius: 6px;
    transition: all 0.2s ease;
    border: 1px solid #d1d5db;
    background: white;

    &:hover {
      border-color: #9ca3af;
    }

    &.is-focus {
      border-color: #1f2937;
      box-shadow: 0 0 0 1px #1f2937;
    }
  }
}

:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 14px;
  padding: 8px 16px;

  &.el-button--primary {
    background: #1f2937;
    border-color: #1f2937;
    color: white;

    &:hover {
      background: #374151;
      border-color: #374151;
    }
  }

  &.el-button--success {
    background: #059669;
    border-color: #059669;
    color: white;

    &:hover {
      background: #047857;
      border-color: #047857;
    }
  }

  &.el-button--warning {
    background: #d97706;
    border-color: #d97706;
    color: white;

    &:hover {
      background: #b45309;
      border-color: #b45309;
    }
  }

  &.el-button--danger {
    background: #dc2626;
    border-color: #dc2626;
    color: white;

    &:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }
  }

  &:not(.el-button--primary):not(.el-button--success):not(.el-button--warning):not(.el-button--danger) {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
      color: #1f2937;
    }
  }
}

:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
  border: none;
  font-size: 12px;
  padding: 4px 8px;

  &.el-tag--info {
    background: #f3f4f6;
    color: #6b7280;
  }

  &.el-tag--success {
    background: #d1fae5;
    color: #059669;
  }

  &.el-tag--warning {
    background: #fef3c7;
    color: #d97706;
  }

  &.el-tag--primary {
    background: #e5e7eb;
    color: #1f2937;
  }
}
</style>