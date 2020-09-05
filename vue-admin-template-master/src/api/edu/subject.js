import request from "@/utils/request"
export default {
    //1.所有课程树形列表
    getAllSubjects() {
        return request({
            url: `/eduservice/subject/getAllSubjects`,
            method: 'get',
        })
    }
}