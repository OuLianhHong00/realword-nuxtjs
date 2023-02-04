import { request } from '@/plugins/request'


// 获取profile
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${encodeURI(username)}`,
  })
}

// 关注
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${encodeURI(username)}/follow`,
  })
}

// 取消关注
export const unFollowUser = username => {
    return request({
      method: 'DELETE',
      url: `/api/profiles/${encodeURI(username)}/follow`,
    })
  }
