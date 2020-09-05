import request from '@/utils/request'
export default {
    getTeacherPage(currentPage, pageSize) {
        return request({
            url: `/eduservice/teacherfront/getTeacherPage/${currentPage}/${pageSize}`,
            method: 'get'
        })
    },
    getTacherInfo(teacherId) {
        return request({
            url: `/eduservice/teacherfront/getTeacherInfo/${teacherId}`,
            method: 'get'
        })
    }
}