<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import ItemWrap from "@/components/item-wrap";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 页面数据
const pageTitle = ref("发货单");

// 搜索表单
const searchForm = reactive({
  keyword: "",
  status: "",
  dateRange: [],
});

// 日期快捷选项
const dateShortcuts = [
  {
    text: "当日",
    value: () => {
      const today = new Date();
      return [today, today];
    },
  },
  {
    text: "近七天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "近一月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

// 状态选项
const statusOptions = [
  { label: "全部", value: "" },
  { label: "待发货", value: "pending" },
  { label: "已发货", value: "shipped" },
  { label: "运输中", value: "in_transit" },
  { label: "已送达", value: "delivered" },
  { label: "已签收", value: "received" },
  { label: "异常", value: "exception" },
];

// 表格数据
const tableData = ref([
  {
    id: 1,
    deliveryNo: "DN202401001",
    orderNo: "PO202401001",
    supplier: "华东钢铁有限公司",
    receiver: "新能源制造公司",
    receiverAddress: "上海市浦东新区科技园区123号",
    deliveryDate: "2024-01-20",
    expectedDate: "2024-01-22",
    status: "shipped",
    trackingNo: "SF1234567890",
    driver: "张师傅",
    driverPhone: "13800138001",
    totalAmount: 150000,
    createTime: "2024-01-20 09:30:00",
    operator: "李四",
  },
  {
    id: 2,
    deliveryNo: "DN202401002",
    orderNo: "PO202401002",
    supplier: "绿色化工设备公司",
    receiver: "智能制造有限公司",
    receiverAddress: "北京市海淀区中关村大街456号",
    deliveryDate: "2024-01-21",
    expectedDate: "2024-01-23",
    status: "in_transit",
    trackingNo: "YTO9876543210",
    driver: "王师傅",
    driverPhone: "13800138002",
    totalAmount: 280000,
    createTime: "2024-01-21 10:15:00",
    operator: "张三",
  },
  {
    id: 3,
    deliveryNo: "DN202401003",
    orderNo: "PO202401003",
    supplier: "智能制造供应商",
    receiver: "清洁能源公司",
    receiverAddress: "深圳市南山区科技园南区789号",
    deliveryDate: "2024-01-22",
    expectedDate: "2024-01-24",
    status: "delivered",
    trackingNo: "ZTO5555666677",
    driver: "刘师傅",
    driverPhone: "13800138003",
    totalAmount: 120000,
    createTime: "2024-01-22 08:45:00",
    operator: "王五",
  },
  {
    id: 4,
    deliveryNo: "DN202401004",
    orderNo: "PO202401004",
    supplier: "办公设备供应商",
    receiver: "环保科技公司",
    receiverAddress: "广州市天河区珠江新城101号",
    deliveryDate: "2024-01-23",
    expectedDate: "2024-01-25",
    status: "pending",
    trackingNo: "",
    driver: "",
    driverPhone: "",
    totalAmount: 45000,
    createTime: "2024-01-23 14:20:00",
    operator: "赵六",
  },
  {
    id: 5,
    deliveryNo: "DN202401005",
    orderNo: "PO202401005",
    supplier: "新材料科技公司",
    receiver: "绿色建筑公司",
    receiverAddress: "杭州市西湖区文三路202号",
    deliveryDate: "2024-01-24",
    expectedDate: "2024-01-26",
    status: "received",
    trackingNo: "EMS1111222233",
    driver: "陈师傅",
    driverPhone: "13800138004",
    totalAmount: 95000,
    createTime: "2024-01-24 11:30:00",
    operator: "孙七",
  },
]);

// 原始数据备份
const originalTableData = ref([...tableData.value]);

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: tableData.value.length,
});

// 计算分页数据
const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return tableData.value.slice(start, end);
});

// 过滤数据
const filteredData = computed(() => {
  return originalTableData.value.filter((item) => {
    const matchKeyword =
      !searchForm.keyword ||
      item.deliveryNo
        .toLowerCase()
        .includes(searchForm.keyword.toLowerCase()) ||
      item.orderNo.toLowerCase().includes(searchForm.keyword.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchForm.keyword.toLowerCase()) ||
      item.receiver.toLowerCase().includes(searchForm.keyword.toLowerCase());

    const matchStatus = !searchForm.status || item.status === searchForm.status;

    let matchDate = true;
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const itemDate = new Date(item.deliveryDate);
      const startDate = new Date(searchForm.dateRange[0]);
      const endDate = new Date(searchForm.dateRange[1]);
      matchDate = itemDate >= startDate && itemDate <= endDate;
    }

    return matchKeyword && matchStatus && matchDate;
  });
});

// 对话框相关
const dialogVisible = ref(false);
const detailDialogVisible = ref(false);
const isEditMode = ref(false);
const currentEditItem = ref({});
const currentDetail = ref({});
const formRef = ref<FormInstance>();

// 新增/编辑表单
const addForm = reactive({
  orderNo: "",
  supplier: "",
  receiver: "",
  receiverAddress: "",
  deliveryDate: "",
  expectedDate: "",
  driver: "",
  driverPhone: "",
  totalAmount: "",
});

// 表单验证规则
const rules: FormRules = {
  orderNo: [{ required: true, message: "请输入订单编号", trigger: "blur" }],
  supplier: [{ required: true, message: "请输入供应商", trigger: "blur" }],
  receiver: [{ required: true, message: "请输入收货方", trigger: "blur" }],
  receiverAddress: [
    { required: true, message: "请输入收货地址", trigger: "blur" },
  ],
  deliveryDate: [
    { required: true, message: "请选择发货日期", trigger: "change" },
  ],
  expectedDate: [
    { required: true, message: "请选择预计到达日期", trigger: "change" },
  ],
  totalAmount: [{ required: true, message: "请输入总金额", trigger: "blur" }],
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "待发货",
    shipped: "已发货",
    in_transit: "运输中",
    delivered: "已送达",
    received: "已签收",
    exception: "异常",
  };
  return statusMap[status] || status;
};

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: "info",
    shipped: "warning",
    in_transit: "primary",
    delivered: "success",
    received: "success",
    exception: "danger",
  };
  return typeMap[status] || "info";
};

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
  searchForm.dateRange = [];

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
  Object.keys(addForm).forEach((key) => {
    (addForm as any)[key] = "";
  });
  formRef.value?.resetFields();
  dialogVisible.value = true;
};

// 编辑操作
const handleEdit = (row: any) => {
  isEditMode.value = true;
  currentEditItem.value = { ...row };
  Object.assign(addForm, {
    orderNo: row.orderNo,
    supplier: row.supplier,
    receiver: row.receiver,
    receiverAddress: row.receiverAddress,
    deliveryDate: row.deliveryDate,
    expectedDate: row.expectedDate,
    driver: row.driver,
    driverPhone: row.driverPhone,
    totalAmount: row.totalAmount,
  });
  dialogVisible.value = true;
};

// 查看详情
const handleView = (row: any) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除操作
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除发货单 ${row.deliveryNo} 吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const index = tableData.value.findIndex((item) => item.id === row.id);
    if (index > -1) {
      tableData.value.splice(index, 1);
      const originalIndex = originalTableData.value.findIndex(
        (item) => item.id === row.id
      );
      if (originalIndex > -1) {
        originalTableData.value.splice(originalIndex, 1);
      }
      pagination.total = tableData.value.length;
      ElMessage.success("删除成功");
    }
  } catch {
    // 用户取消删除
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        // 编辑模式
        const index = tableData.value.findIndex(
          (item) => item.id === currentEditItem.value.id
        );
        if (index > -1) {
          Object.assign(tableData.value[index], {
            ...addForm,
            totalAmount: Number(addForm.totalAmount),
          });
          const originalIndex = originalTableData.value.findIndex(
            (item) => item.id === currentEditItem.value.id
          );
          if (originalIndex > -1) {
            Object.assign(originalTableData.value[originalIndex], {
              ...addForm,
              totalAmount: Number(addForm.totalAmount),
            });
          }
          ElMessage.success("修改成功");
        }
      } else {
        // 新增模式
        const newId = Math.max(...tableData.value.map((item) => item.id)) + 1;
        const newDeliveryNo = `DN${new Date().getFullYear()}${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}${String(newId).padStart(3, "0")}`;
        const newItem = {
          id: newId,
          deliveryNo: newDeliveryNo,
          ...addForm,
          status: "pending",
          trackingNo: "",
          createTime: new Date().toLocaleString("zh-CN"),
          operator: "当前用户",
          totalAmount: Number(addForm.totalAmount),
        };
        tableData.value.unshift(newItem);
        originalTableData.value.unshift(newItem);
        pagination.total = tableData.value.length;
        ElMessage.success("新增成功");
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
  console.log("发货单页面已加载");
});
</script>

<template>
  <div class="delivery-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="content-area">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-left">
          <div class="search-item">
            <label>关键词：</label>
            <el-input
              v-model="searchForm.keyword"
              placeholder="发货单号/订单号/供应商/收货方"
              clearable
              class="search-input"
            />
          </div>
          <div class="search-item">
            <label>发货日期：</label>
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
        </div>
      </div>

      <!-- 表格区域 -->
      <ItemWrap title="发货单数据" class="table-wrapper">
        <!-- 操作按钮区域 -->
        <div class="action-bar">
          <div class="action-left">
            <el-button type="primary" @click="handleSearch" icon="Search">
              查询
            </el-button>
            <el-button @click="handleReset" icon="Refresh"> 重置 </el-button>
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
          class="delivery-table"
          header-cell-class-name="table-header"
        >
          <el-table-column prop="deliveryNo" label="发货单号" min-width="140" />
          <el-table-column prop="orderNo" label="订单编号" min-width="140" />
          <el-table-column prop="supplier" label="供应商" min-width="180" />
          <el-table-column prop="receiver" label="收货方" min-width="150" />
          <el-table-column
            prop="deliveryDate"
            label="发货日期"
            min-width="120"
          />
          <el-table-column
            prop="expectedDate"
            label="预计到达"
            min-width="120"
          />
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="总金额" min-width="120">
            <template #default="{ row }">
              ¥{{ row.totalAmount?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" @click="handleView(row)">
                  查看
                </el-button>
                <el-button type="warning" size="small" @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(row)"
                >
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
            :page-sizes="[10, 20, 50, 100]"
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
      :title="isEditMode ? '编辑发货单' : '新增发货单'"
      width="800px"
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
            <el-form-item label="订单编号" prop="orderNo">
              <el-input
                v-model="addForm.orderNo"
                placeholder="请输入订单编号"
              />
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
            <el-form-item label="收货方" prop="receiver">
              <el-input v-model="addForm.receiver" placeholder="请输入收货方" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总金额" prop="totalAmount">
              <el-input
                v-model="addForm.totalAmount"
                placeholder="请输入总金额"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="收货地址" prop="receiverAddress">
          <el-input
            v-model="addForm.receiverAddress"
            placeholder="请输入收货地址"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发货日期" prop="deliveryDate">
              <el-date-picker
                v-model="addForm.deliveryDate"
                type="date"
                placeholder="请选择发货日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到达" prop="expectedDate">
              <el-date-picker
                v-model="addForm.expectedDate"
                type="date"
                placeholder="请选择预计到达日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="司机姓名">
              <el-input v-model="addForm.driver" placeholder="请输入司机姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机电话">
              <el-input
                v-model="addForm.driverPhone"
                placeholder="请输入司机电话"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="发货单详情" width="800px">
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="发货单号">{{
            currentDetail.deliveryNo
          }}</el-descriptions-item>
          <el-descriptions-item label="订单编号">{{
            currentDetail.orderNo
          }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{
            currentDetail.supplier
          }}</el-descriptions-item>
          <el-descriptions-item label="收货方">{{
            currentDetail.receiver
          }}</el-descriptions-item>
          <el-descriptions-item label="发货日期">{{
            currentDetail.deliveryDate
          }}</el-descriptions-item>
          <el-descriptions-item label="预计到达">{{
            currentDetail.expectedDate
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentDetail.status)">
              {{ getStatusText(currentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="总金额"
            >¥{{
              currentDetail.totalAmount?.toLocaleString()
            }}</el-descriptions-item
          >
          <el-descriptions-item label="物流单号">{{
            currentDetail.trackingNo || "暂无"
          }}</el-descriptions-item>
          <el-descriptions-item label="司机姓名">{{
            currentDetail.driver || "暂无"
          }}</el-descriptions-item>
          <el-descriptions-item label="司机电话">{{
            currentDetail.driverPhone || "暂无"
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            currentDetail.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{
            currentDetail.receiverAddress
          }}</el-descriptions-item>
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
.delivery-container {
  width: 100%;
  height: calc(100vh - 64px);
  padding: 32px;
  background: #fafbfc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", sans-serif;
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
    gap: 24px;

    .search-item {
      display: flex;
      align-items: center;

      label {
        margin-right: 12px;
        font-weight: 600;
        color: #34495e;
        white-space: nowrap;
        font-size: 14px;
      }

      .search-input {
        width: 280px;
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

    .status-select {
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

.delivery-table {
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
</style>