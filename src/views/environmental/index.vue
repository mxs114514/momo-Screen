<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import ItemWrap from "@/components/item-wrap";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 页面数据
const pageTitle = ref("供应链管理");

// 搜索表单
const searchForm = reactive({
  keyword: "",
  status: ""
});

// 状态选项
const statusOptions = [
  { label: "全部", value: "" },
  { label: "启用", value: "1" },
  { label: "禁用", value: "0" }
];

// 表格数据
const tableData = ref([
  {
    id: 1,
    code: "GYL001",
    name: "华东钢铁供应链",
    type: "钢铁冶炼",
    category: "重点监管",
    shortName: "华东钢铁",
    legalPerson: "张总",
    legalPhone: "021-88888888",
    address: "上海市浦东新区钢铁大道123号",
    socialCode: "91310000123456789X",
    contact: "张三",
    phone: "13800138001",
    email: "zhangsan@huadong.com",
    contract: "是",
    portal: "是",
    traceCode: "TR001",
    account: "已开通",
    status: "1"
  },
  {
    id: 2,
    code: "GYL002",
    name: "绿色化工供应链",
    type: "化工生产",
    category: "绿色认证",
    shortName: "绿色化工",
    legalPerson: "李总",
    legalPhone: "0571-66666666",
    address: "浙江省杭州市西湖区化工园区456号",
    socialCode: "91330000234567890Y",
    contact: "李四",
    phone: "13800138002",
    email: "lisi@lvse.com",
    contract: "否",
    portal: "否",
    traceCode: "TR002",
    account: "未开通",
    status: "0"
  },
  {
    id: 3,
    code: "GYL003",
    name: "清洁能源供应链",
    type: "电力生产",
    category: "绿色认证",
    shortName: "清洁能源",
    legalPerson: "王总",
    legalPhone: "010-77777777",
    address: "北京市朝阳区能源大街789号",
    socialCode: "91110000345678901Z",
    contact: "王五",
    phone: "13800138003",
    email: "wangwu@qingjie.com",
    contract: "是",
    portal: "是",
    traceCode: "TR003",
    account: "已开通",
    status: "1"
  },
  {
    id: 4,
    code: "GYL004",
    name: "建材供应链",
    type: "建材生产",
    category: "一般监管",
    shortName: "建材供应",
    legalPerson: "赵总",
    legalPhone: "020-55555555",
    address: "广东省广州市天河区建材路321号",
    socialCode: "91440000456789012A",
    contact: "赵六",
    phone: "13800138004",
    email: "zhaoliu@jiancai.com",
    contract: "是",
    portal: "否",
    traceCode: "TR004",
    account: "未开通",
    status: "1"
  },
  {
    id: 5,
    code: "GYL005",
    name: "有色金属供应链",
    type: "有色冶炼",
    category: "重点监管",
    shortName: "有色金属",
    legalPerson: "孙总",
    legalPhone: "0871-44444444",
    address: "云南省昆明市五华区金属工业园654号",
    socialCode: "91530000567890123B",
    contact: "孙七",
    phone: "13800138005",
    email: "sunqi@youse.com",
    contract: "否",
    portal: "是",
    traceCode: "TR005",
    account: "已开通",
    status: "0"
  },
  {
    id: 6,
    code: "GYL006",
    name: "纺织服装供应链",
    type: "纺织制造",
    category: "一般监管",
    shortName: "纺织服装",
    legalPerson: "周总",
    legalPhone: "0512-66666666",
    address: "江苏省苏州市工业园区纺织路789号",
    socialCode: "91320000678901234C",
    contact: "周八",
    phone: "13800138006",
    email: "zhouba@fangzhi.com",
    contract: "是",
    portal: "否",
    traceCode: "TR006",
    account: "未开通",
    status: "1"
  },
  {
    id: 7,
    code: "GYL007",
    name: "医药健康供应链",
    type: "医药制造",
    category: "重点监管",
    shortName: "医药健康",
    legalPerson: "吴总",
    legalPhone: "010-77777777",
    address: "北京市海淀区中关村医药园区101号",
    socialCode: "91110000789012345D",
    contact: "吴九",
    phone: "13800138007",
    email: "wujiu@yiyao.com",
    contract: "是",
    portal: "是",
    traceCode: "TR007",
    account: "已开通",
    status: "1"
  },
  {
    id: 8,
    code: "GYL008",
    name: "新能源供应链",
    type: "新能源制造",
    category: "重点监管",
    shortName: "新能源",
    legalPerson: "郑总",
    legalPhone: "0755-88888888",
    address: "广东省深圳市南山区科技园新能源大厦888号",
    socialCode: "91440000890123456E",
    contact: "郑十",
    phone: "13800138008",
    email: "zhengshi@xinnengyuan.com",
    contract: "否",
    portal: "是",
    traceCode: "TR008",
    account: "已开通",
    status: "0"
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
      item.code.toLowerCase().includes(keyword)
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
  shortName: "",
  legalPerson: "",
  legalPhone: "",
  address: "",
  socialCode: "",
  contact: "",
  phone: "",
  email: ""
});

// 表单验证规则
const rules: FormRules = {
  type: [{ required: true, message: "请选择供应链类型", trigger: "change" }],
  name: [{ required: true, message: "请输入供应链名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择供应链分类", trigger: "change" }],
  shortName: [{ required: true, message: "请输入供应链简称", trigger: "blur" }],
  legalPerson: [{ required: true, message: "请输入法人", trigger: "blur" }],
  legalPhone: [{ required: true, message: "请输入法人电话", trigger: "blur" }],
  address: [{ required: true, message: "请输入供应链地址", trigger: "blur" }],
  socialCode: [{ required: true, message: "请输入社会统一信任代码", trigger: "blur" }],
  contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  email: [{ required: true, message: "请输入联系人邮箱", trigger: "blur" }]
};

// 供应链类型选项
const typeOptions = [
  { label: "钢铁冶炼", value: "钢铁冶炼" },
  { label: "化工生产", value: "化工生产" },
  { label: "电力生产", value: "电力生产" },
  { label: "建材生产", value: "建材生产" },
  { label: "有色冶炼", value: "有色冶炼" }
];

// 供应链分类选项
const categoryOptions = [
  { label: "重点监管", value: "重点监管" },
  { label: "一般监管", value: "一般监管" },
  { label: "绿色认证", value: "绿色认证" }
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
         const tableIndex = tableData.value.findIndex(item => item.id === currentEditItem.value.id);
         const originalIndex = originalTableData.value.findIndex(item => item.id === currentEditItem.value.id);
         
         const updatedData = {
           ...currentEditItem.value,
           name: addForm.name,
           type: addForm.type,
           category: addForm.category,
           shortName: addForm.shortName,
           legalPerson: addForm.legalPerson,
           legalPhone: addForm.legalPhone,
           address: addForm.address,
           socialCode: addForm.socialCode,
           contact: addForm.contact,
           phone: addForm.phone,
           email: addForm.email
         };
         
         if (tableIndex > -1) {
           tableData.value[tableIndex] = updatedData;
         }
         if (originalIndex > -1) {
           originalTableData.value[originalIndex] = updatedData;
         }
         
         ElMessage.success("编辑成功");
      } else {
        // 新增模式
        // 生成新的ID
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1;
        
        // 生成新的编号
        const newCode = `GYL${String(newId).padStart(3, '0')}`;
        
        // 创建新的数据项
        const newItem = {
          id: newId,
          code: newCode,
          name: addForm.name,
          type: addForm.type,
          category: addForm.category,
          shortName: addForm.shortName,
          legalPerson: addForm.legalPerson,
          legalPhone: addForm.legalPhone,
          address: addForm.address,
          socialCode: addForm.socialCode,
          contact: addForm.contact,
          phone: addForm.phone,
          email: addForm.email,
          contract: "否",
          portal: "否",
          traceCode: `TR${String(newId).padStart(3, '0')}`,
          account: "未开通",
          status: "1"
        };
        
        // 添加到表格数据和原始数据
        tableData.value.push(newItem);
        originalTableData.value.push(newItem);
        
        // 更新分页总数
        pagination.total = tableData.value.length;
        
        console.log("新增数据:", newItem);
        ElMessage.success("新增成功");
      }
      
      dialogVisible.value = false;
      
      // 重置表单和编辑状态
      formRef.value?.resetFields();
      isEditMode.value = false;
      currentEditItem.value = {};
    }
  });
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
  isEditMode.value = false;
  currentEditItem.value = {};
};

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page;
  console.log("当前页:", page);
};

// 页面大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  console.log("每页条数:", size);
};

// 查看详情
const handleViewDetail = (row: any) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

// 关闭详情对话框
const handleCloseDetail = () => {
  detailDialogVisible.value = false;
  currentDetail.value = {};
};

// 编辑操作
const handleEdit = (row: any) => {
  isEditMode.value = true;
  currentEditItem.value = { ...row };
  
  // 将数据填充到表单中
  Object.assign(addForm, {
    type: row.type,
    name: row.name,
    category: row.category,
    shortName: row.shortName,
    legalPerson: row.legalPerson,
    legalPhone: row.legalPhone,
    address: row.address,
    socialCode: row.socialCode,
    contact: row.contact,
    phone: row.phone,
    email: row.email,
    contract: row.contract,
    portal: row.portal,
    traceCode: row.traceCode,
    account: row.account
  });
  
  dialogVisible.value = true;
};

// 删除操作
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除供应链"${row.name}"吗？`,
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

onMounted(() => {
  console.log("供应链管理页面已加载");
  // 初始化原始数据备份
  originalTableData.value = [...tableData.value];
});
</script>

<template>
  <div class="environmental-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="content-area">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-left">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索供应链名称或编码"
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
      <ItemWrap title="供应链列表" class="table-wrapper">
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
          class="supply-table"
          header-cell-class-name="table-header"
        >
          <el-table-column prop="code" label="供应链编码" width="120" />
          <el-table-column prop="name" label="供应链名称" width="180" />
          <el-table-column prop="type" label="供应链类型" width="120" />
          <el-table-column prop="contact" label="联系人" width="100" />
          <el-table-column prop="phone" label="联系电话" width="130" />
          <el-table-column prop="contract" label="必须合同" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.contract === '是' ? 'success' : 'danger'">
                {{ row.contract }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="portal" label="是否启用门户" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.portal === '是' ? 'success' : 'info'">
                {{ row.portal }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="traceCode" label="生成追溯码" width="120" />
          <el-table-column prop="account" label="账号管理" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.account === '已开通' ? 'success' : 'warning'">
                {{ row.account }}
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
      :title="isEditMode ? '编辑供应链' : '新增供应链'"
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
            <el-form-item label="供应链类型" prop="type">
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
            <el-form-item label="供应链名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入供应链名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应链分类" prop="category">
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
            <el-form-item label="供应链简称" prop="shortName">
              <el-input v-model="addForm.shortName" placeholder="请输入供应链简称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" placeholder="请输入法人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人电话" prop="legalPhone">
              <el-input v-model="addForm.legalPhone" placeholder="请输入法人电话" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="供应链地址" prop="address">
          <el-input v-model="addForm.address" placeholder="请输入供应链地址" />
        </el-form-item>
        
        <el-form-item label="社会统一信任代码" prop="socialCode">
          <el-input v-model="addForm.socialCode" placeholder="请输入社会统一信任代码" />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="addForm.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="联系人邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入联系人邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="供应链详情"
      width="800px"
      :before-close="handleCloseDetail"
      class="detail-dialog"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="供应链类型">
            {{ currentDetail.type }}
          </el-descriptions-item>
          <el-descriptions-item label="供应链编号">
            {{ currentDetail.code }}
          </el-descriptions-item>
          <el-descriptions-item label="供应链名称">
            {{ currentDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="供应链分类">
            {{ currentDetail.category }}
          </el-descriptions-item>
          <el-descriptions-item label="供应链简称">
            {{ currentDetail.shortName }}
          </el-descriptions-item>
          <el-descriptions-item label="法人">
            {{ currentDetail.legalPerson }}
          </el-descriptions-item>
          <el-descriptions-item label="法人电话">
            {{ currentDetail.legalPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ currentDetail.contact }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ currentDetail.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人邮箱">
            {{ currentDetail.email }}
          </el-descriptions-item>
          <el-descriptions-item label="供应链地址" :span="2">
            {{ currentDetail.address }}
          </el-descriptions-item>
          <el-descriptions-item label="社会统一信任代码" :span="2">
            {{ currentDetail.socialCode }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentDetail.status === '1' ? 'success' : 'danger'">
              {{ currentDetail.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用门户">
            <el-tag :type="currentDetail.portal === '是' ? 'success' : 'info'">
              {{ currentDetail.portal }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDetail">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.environmental-container {
  padding: 32px;
  min-height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  margin-bottom: 40px;
}

.page-title {
  color: #1a1a1a;
  font-size: 28px;
  font-weight: 300;
  margin: 0;
  letter-spacing: -0.5px;
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
.supply-table {
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

:deep(.el-select .el-input__wrapper) {
  background: #ffffff;
}

:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #d0d7de;
  transition: all 0.2s ease;
}

:deep(.el-button--primary) {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

:deep(.el-button--primary:hover) {
  background: #333333;
  border-color: #333333;
}

:deep(.el-button--success) {
  background: #28a745;
  border-color: #28a745;
  color: #ffffff;
}

:deep(.el-button--success:hover) {
  background: #218838;
  border-color: #218838;
}

:deep(.el-button:hover) {
  background: #f8f9fa;
  border-color: #8c959f;
}

:deep(.el-tag) {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border: none;
}

:deep(.el-tag--success) {
  background: #d4edda;
  color: #155724;
}

:deep(.el-tag--danger) {
  background: #f8d7da;
  color: #721c24;
}

:deep(.el-tag--warning) {
  background: #fff3cd;
  color: #856404;
}

:deep(.el-tag--info) {
  background: #d1ecf1;
  color: #0c5460;
}

/* 按钮文本样式 */
:deep(.el-button--primary.is-text) {
  background: transparent;
  color: #1a1a1a;
  border: none;
  padding: 4px 8px;
}

:deep(.el-button--primary.is-text:hover) {
  background: #f8f9fa;
  color: #1a1a1a;
}

:deep(.el-button--danger.is-text) {
  background: transparent;
  color: #dc3545;
  border: none;
  padding: 4px 8px;
}

:deep(.el-button--danger.is-text:hover) {
  background: #f8f9fa;
  color: #c82333;
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
 
 .action-buttons .el-button--text.el-button--primary:hover {
   color: #409eff;
   background-color: rgba(64, 158, 255, 0.1);
   border-color: rgba(64, 158, 255, 0.2);
 }
 
 .action-buttons .el-button--text.el-button--danger:hover {
   color: #f56c6c;
   background-color: rgba(245, 108, 108, 0.1);
   border-color: rgba(245, 108, 108, 0.2);
 }
 </style>