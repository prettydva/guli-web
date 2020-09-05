import request from "@/utils/request"
export default {
    //1.讲师列表（条件查询分页）
    //currentPage当前页，pageSize每页记录数，teacherQuery条件对象
    getTeacherList(currentPage, pageSize, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacher/${currentPage}/${pageSize}`,
            method: 'post',
            //data表示把对象转换成json进行传递到接口里面
            data: teacherQuery
        })
    },
    removeTeacher(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },
      //添加讲师
      addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/add`,
            method: 'post',
            data: teacher
          })
    },
    //根据id查询讲师
    getTeacherInfo(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'get'
          })
    },
    //修改讲师
    updateTeacher(id,teacher) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'put',
            data: teacher
          })
    }
}