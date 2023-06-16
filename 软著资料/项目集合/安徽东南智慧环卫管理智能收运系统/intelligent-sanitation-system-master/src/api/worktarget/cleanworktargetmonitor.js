import http from '@/utils/request.js'
export const getWorktargetTree = (data) => {
  return http.get('/worktarget/cleanworktarget/getCleanWorktargetMonitorTree', { params: { ...data } })
}
