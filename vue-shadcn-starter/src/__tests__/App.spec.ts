import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('订单列表')
  })
})
