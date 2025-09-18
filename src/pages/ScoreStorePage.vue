<template>
  <div class="container">
    <!-- 头部和积分信息 -->
    <div class="header">
      <div class="points-card">
        <h2>我的积分余额</h2>
        <div class="points">{{ userVo?.userScore }} 积分</div>
      </div>
    </div>

    <!-- 商品区域 -->
    <h2 class="section-title">精选商品</h2>
    <div class="products-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="showProductDetail(product)"
      >
        <img :src="product.image" :alt="product.name" class="product-image">
        <div class="product-info">
          <div class="product-title">{{ product.name }}</div>
          <div class="product-points">{{ product.points }} 积分</div>
          <a-button class="exchange-btn" @click.stop="handleExchange(product)">立即兑换</a-button>
        </div>
      </div>
    </div>

    <!-- 商品详情模态框 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="selectedProduct.name"
      width="600px"
      :footer="null"
    >
      <div class="modal-content">
        <img :src="selectedProduct.image" :alt="selectedProduct.name" class="modal-image">
        <div class="modal-title">{{ selectedProduct.name }}</div>
        <div class="modal-points">{{ selectedProduct.points }} 积分</div>

        <div class="rules-section">
          <div class="rules-title">兑换规则</div>
          <div class="rules-content">
            {{ selectedProduct.exchangeRules }}
          </div>
        </div>

        <div class="rules-section">
          <div class="rules-title">使用规则</div>
          <div class="rules-content">
            {{ selectedProduct.usageRules }}
          </div>
        </div>

        <a-button
          type="primary"
          size="large"
          class="exchange-btn"
          @click="handleExchange(selectedProduct)"
          :disabled="userPoints < selectedProduct.points"
        >
          {{ userPoints >= selectedProduct.points ? '立即兑换' : '积分不足' }}
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { getLoginUser, userSubscribesVip } from '@/api/userController.ts'

const userPoints = ref(150); // 模拟用户积分
const modalVisible = ref(false);
const selectedProduct = ref({});

const userVo = ref<API.UserVO>()
const getUserVo = async () => {
  const res = await getLoginUser()
  if (res.data.code === 0 && res.data.data) {
    userVo.value = res.data.data
    if(!userVo.value.userScore){
      userVo.value.userScore = 0
    }
  }
}

onMounted(() => {
  getUserVo()
})

// 商品数据
const products = ref([
  {
    id: 1,
    name: "云图智联会员（一个月）",
    points: 90,
    image: "https://picos.imagocore.top/public/1928052943001227266/2025-09-18_AOdmjrQeWl2gYK0g.webp",
    exchangeRules: "会员兑换后立即生效。",
    usageRules: "兑换成功后，您的账户将自动升级为会员，使用AI功能不消耗积分，有效期30天。"
  }
]);

// 显示商品详情
const showProductDetail = (product) => {
  selectedProduct.value = product;
  modalVisible.value = true;
};


const vipEnchange = async () => {
  const params = {
    id: userVo.value?.id,
    vipType: "Month",
  }

  try {
    const res = await userSubscribesVip(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('兑换成功！');
    } else {
      message.success('兑换失败，' + res.data.message);
    }
  } catch (e: any) {
    message.success('兑换失败！');
  }
}

// 处理兑换
const handleExchange = (product) => {
  if (userPoints.value < product.points) {
    message.error('积分不足，无法兑换');
    return;
  }

  // 模拟兑换操作
  Modal.confirm({
    title: '确认兑换',
    content: `确定要使用 ${product.points} 积分兑换【${product.name}】吗？`,
    onOk() {
      vipEnchange()
      modalVisible.value = false;
    }
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 30px;
}
.points-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
}
.points-card h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}
.points-card .points {
  font-size: 32px;
  font-weight: 700;
  margin: 10px 0;
}
.section-title {
  font-size: 22px;
  font-weight: 600;
  margin: 30px 0 20px;
  color: #333;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}
.product-info {
  padding: 16px;
}
.product-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}
.product-points {
  color: #ff6b35;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 12px;
}
.exchange-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  height: 40px;
}
.modal-content {
  padding: 20px;
}
.modal-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}
.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}
.modal-points {
  color: #ff6b35;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 20px;
}
.rules-section {
  margin-bottom: 20px;
}
.rules-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}
.rules-content {
  color: #666;
  line-height: 1.6;
}
.footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #888;
  border-top: 1px solid #e8e8e8;
}
</style>
