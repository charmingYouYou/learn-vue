/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  // 返回config配置内容
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        // 不要替换Vue.config对象，而是设置单个字段。
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 公开的util方法。
  // 注意：这些不被视为公共API的一部分-避免依赖
  // 除非你意识到了风险，否则就不要这样做。
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  /**
   * 'component', // 组件
   * 'directive', // 指令
   * 'filter' // 过滤
   * 初始化三个options
   */
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  /*_base被用来标识基本构造函数（也就是Vue），以便在多场景下添加组件扩展*/
  Vue.options._base = Vue

  // 注册全局keep-alive组件
  extend(Vue.options.components, builtInComponents)

  // 初始化Vue.use()
  initUse(Vue)
  // 初始化Vue.mixin
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
