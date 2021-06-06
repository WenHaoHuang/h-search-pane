<template>
  <el-form
    ref="form"
    :model="model"
    :label-width="labelWidthCalc"
    class="h-search-pane"
    :rules="rules"
    :label-position="labelPosition"
    :label-suffix="labelSuffix"
  >
    <h-form-item
      v-for="(item, index) in options"
      v-show="!collapsed || !item.collapse"
      :key="index"
      :prop="index"
      :options="item"
      :rules="item.rules || (rules && rules[index]) || undefined"
      :required="item.required"
      :label-width="item.labelWidth"
      :label-suffix="labelSuffix"
      :visible="item.visible"
      :disabled="item.disabled"
      :class="[
        item.span ? `span__${item.span}` : autoSpan ? `span__${autoSpan}` : ''
      ]"
    />
    <el-form-item
      v-if="!hideFooter"
      :class="[
        btnSpan ? `span__${btnSpan}` : autoSpan ? `span__${autoSpan}` : '',
        btnAlign === 'right' ? 'align-right' : ''
      ]"
    >
      <el-button
        v-if="hasCollapse"
        type="text"
        @click="onCollapse"
      >
        {{ collapsed ? '展开' : '折叠' }}
        <i
          class="el-icon__right"
          :class="`el-icon-arrow-${collapsed ? 'down' : 'up'}`"
          style="margin-left:0;"
        />
      </el-button>
      <el-button
        v-if="!hideSubmit"
        type="primary"
        @click="onSubmit"
      >
        {{ submitText }}
      </el-button>
      <el-button
        v-if="!hideCancel"
        @click="onCancel"
      >
        {{ cancelText }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import HFormItem from "./form-item.vue";
export default {
  name: "HSearchPane",
  components: { HFormItem },
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: ""
    },
    labelSuffix: {
      type: String,
      default: "："
    },
    labelPosition: {
      type: String,
      default: ""
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: "查询"
    },
    cancelText: {
      type: String,
      default: "重置"
    },
    hideSubmit: {
      type: Boolean,
      default: false
    },
    hideCancel: {
      type: Boolean,
      default: false
    },
    span: {
      type: Number,
      default: undefined
    },
    defaultCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapse: false,
      defaultSpan: 8
    }
  },
  computed: {
    hasCollapse() {
      const {options} = this
      const hasCollapse = Object.keys(options).some(v => options[v].collapse === true)
      return hasCollapse
    },
    collapsed() {
      const {collapse, hasCollapse} = this
      return hasCollapse && collapse
    },
    calcSpan() {
      // 计算兄弟节点的总栅格数
      let total = 0;
      const children = Object.values(this.options);
      children.forEach(({span, collapse}) => {
        if(!(collapse === true && this.collapse === true)) {
          total += span || this.autoSpan
        }
      })
      return total;
    },
    btnAlign() {
      // 按钮对齐方式
      return (this.calcSpan + this.autoSpan <= 24 && !this.hasCollapse) ? 'left' : 'right'
    },
    btnSpan() {
      const span = (24 - this.calcSpan % 24)
      return span < this.autoSpan ? this.autoSpan : span
    },
    labelWidthCalc() {
      if(this.labelWidth || this.btnAlign === 'left') {
        // 如果配置label宽度，采用配置值
        return this.labelWidth
      } else {
        // 不配置时，自动计算
        let labelWidth = 1; // 默认带上后面：的空间
        for(const item in this.options) {
          let _width = 1; // 默认带上后面：的空间
          const {label, rules=[], helpContent, required} = this.options[item]
          const _required = rules.find(v=>v.required === true)
          const __required = (this.rules ? (this.rules[item] || []) : []).find(v=>v.required === true)
          _width += required || _required || __required ? 1 : 0
          _width += helpContent ? 2 : 0
          _width += label.length
          labelWidth = _width > labelWidth ? _width : labelWidth;
        }
        return `${labelWidth}em`;
      }
    },
    autoSpan() {
      return this.span || this.defaultSpan || 8;
    }
  },
  watch: {
    defaultCollapse: {
      handler: function(val) {
        this.collapse = val
      },
      immediate: true
    }
  },
  provide() {
    return {
      HFormer: this
    };
  },
  mounted() {
    const clientWidth = window.innerWidth;
    this.defaultSpan = clientWidth >= 1600 ? 6 : 8
  },
  methods: {
    onSubmit() {
      this.$emit("handle-query", this.model);
    },
    onCancel() {
      this.$emit("handle-cancel");
      this.$refs.form.resetFields();
    },
    onCollapse() {
      this.collapse = !this.collapse
      this.$emit("handle-collapse", this.collapse);
    },
    validate(callback) {
      this.$refs['form'].validate(valid => {
        callback && callback(valid)
      })
    }
  }
};
</script>
