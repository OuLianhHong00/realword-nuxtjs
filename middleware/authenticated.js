/**
 * 验证是否登录的中间件
 */
export default function ({ store, redirect }) {
  console.log('store', store)
  if (!store.state.user) {
    return redirect('/login')
  }
}
