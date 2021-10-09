/* @flow */

import config from '../config'
import { ASSET_TYPES } from 'shared/constants'
import { warn, isPlainObject } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  /** 
   * 创建Vue全局的component, filter, directive方法
   * 已在initGlobalApi 初始化this.options和 
   * ASSET_TYPES.forEach(type => {
   *   Vue.options[type + 's'] = Object.create(null)
   * })
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // get 方法
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 本质调用Vue.extend this.options._base === Vue
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // filter, directive 挂载到this.options
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
