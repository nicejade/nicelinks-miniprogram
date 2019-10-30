import { $apis } from 'helper'

export default {
  async $getUserInfo({ commit, state }) {
    if (!userId) return

    let res = await $apis.getProfile({ _id: userId })
    commit('$vuexSetUserInfo', res)
  }
}
