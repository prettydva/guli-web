import request from "@/utils/request"
export default {
    //课程确认信息
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师
    getAllTeacher() {
        return request({
            url: `/eduservice/teacher/getAll`,
            method: 'get'
        })
    },
    //根据课程id查询课程信息
    getCourseInfoById(courseId) {
        return request({
            url: `/eduservice/course/${courseId}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseId, course) {
        return request({
            url: `/eduservice/course/${courseId}`,
            method: 'put',
            data: course
        })
    },
    //发布课程
    publish(courseId) {
        return request({
            url: `/eduservice/course/publish/${courseId}`,
            method: 'put'
        })
    },
    //分页模糊查询
    page(currentPage, pageSize, course) {
        return request({
            url: `/eduservice/course/page/${currentPage}/${pageSize}`,
            method: 'post',
            data: course
        })
    },
    deleteCourse(courseId) {
        return request({
            url: `/eduservice/course/${courseId}`,
            method: 'delete'
        })
    }

}