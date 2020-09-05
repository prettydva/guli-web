import request from '@/utils/request'
export default {
    //发验证码
    getCourseList(page, size,searchObj) {
        return request({
            url: `/eduservice/coursefront/getCoursePage/${page}/${size}`,
            method: 'post',
            data: searchObj
        })
    },
    getAllSubject() {
        return request({
            url: `/eduservice/subject/getAllSubjects`,
            method: 'get'
        })
    },
    getCourseInfo(id){
        return request({
            url: `/eduservice/coursefront/${id}`,
            method: 'get'
        })
    }
}