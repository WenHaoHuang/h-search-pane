<!--
 * @Author       : wenhao.huang
 * @Date         : 2020-06-16 11:43:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-06 13:30:14
-->
<template>
  <el-form-item
    v-if="isVisible"
    :label="options.label"
    :prop="prop"
    :rules="rules"
    :required="required"
    :label-width="labelWidth"
  >
    <template
      v-if="options.helpContent"
      slot="label"
    >
      {{ options.label }}
      <el-tooltip placement="top">
        <!-- eslint-disable -->
        <div
          slot="content"
          v-html="options.helpContent"
        />
        <!-- eslint-enable -->
        <i class="el-icon-warning-outline" />
      </el-tooltip>
      {{ labelSuffix }}
    </template>
    <template v-if="options.type === 'checkbox-group'">
      <el-checkbox-group
        v-model="HFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <el-checkbox
          v-for="(child, index) in options.children"
          :key="index"
          :label="(child.value === undefined || child.value === null) ? child.label : child.value"
          v-bind="child.props"
          v-on="child.on"
        >
          {{ child.label }}
        </el-checkbox>
      </el-checkbox-group>
    </template>
    <template v-else-if="options.type === 'radio-group'">
      <el-radio-group
        v-model="HFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <el-radio
          v-for="child in options.children"
          :key="`${child.label}_${child.value}`"
          :label="(child.value === undefined || child.value === null) ? child.label : child.value"
        >
          {{ child.label }}
        </el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="options.type === 'select'">
      <el-select
        v-model="HFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <el-option
          v-for="child in options.children"
          :key="`${child.label}_${child.value}`"
          :label="child.label"
          :value="(options.props && options.props.valueKey) ? child : ((child.value === undefined || child.value === null) ? child.label : child.value)"
        />
      </el-select>
    </template>
    <template v-else-if="options.type === 'groups'">
      <div class="h-form--item__group">
        <template v-for="(item, index) in options.children">
          <h-form-item
            :key="index"
            class="h-form--item__group--item"
            :prop="index"
            :options="item"
            :rules="item.rules || (HFormer.rules && HFormer.rules[index]) || undefined"
            :visible="item.visible"
            :disabled="item.disalbed"
            :class="[
              item.span ? `span__${item.span}` : 'span__8'
            ]"
          />
        </template>
      </div>
    </template>
    <h-form-render
      v-else-if="options.type === 'render'"
      :options="options"
    />
    <component
      :is="`el-${options.type}`"
      v-else
      v-model="HFormer.model[prop]"
      :disabled="isDisabled"
      v-bind="options.props"
      v-on="options.on"
    />
  </el-form-item>
</template>
<script>
import HFormRender from './form-render.js'

export default {
  name: 'HFormItem',
  components: {HFormRender},
  inject: ['HFormer'],
  props: {
    prop: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: undefined
    },
    labelWidth: {
      type: String,
      default: undefined
    },
    labelSuffix: {
      type: String,
      default: "："
    },
    visible: {
      type: [Boolean, Function],
      default: undefined
    },
    disabled: {
      type: [Boolean, Function],
      default: undefined
    },
  },
  computed: {
    isVisible() {
      if(this.visible === undefined) {
        return true;
      } else if(typeof this.visible === 'function') {
        return this.visible(this.HFormer.model)
      } else {
        return this.visible
      }
    },
    isDisabled() {
      if(this.disabled === undefined) {
        return this.options.props && this.options.props.disabled;
      } else if(typeof this.disabled === 'function') {
        return this.disabled(this.HFormer.model)
      } else {
        return this.disabled
      }
    }
  },
}
</script>
