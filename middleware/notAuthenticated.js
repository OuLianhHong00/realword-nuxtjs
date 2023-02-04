/**
 * 已登录不可进入登录页 中间件
 */
export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (store.state.user) {
    return redirect('/')
  }
}
