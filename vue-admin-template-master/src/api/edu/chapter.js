import request from "@/utils/request"
export default {
    //1.根据课程id获取章节和小节列表
    getAllChapterVideo(courseId) {
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },
    //添加章节
    addChapter(chapter) {
        return request({
            url: `/eduservice/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },
    //根据id获取章节
    getChapterById(chapterId) {
        return request({
            url: `/eduservice/chapter/${chapterId}`,
            method: 'get'
        })
    },
    //修改章节
    updateChapter(chapterId, chapter) {
        return request({
            url: `/eduservice/chapter/${chapterId}`,
            method: 'put',
            data: chapter
        })
    },
    //删除章节
    deleteChapter(chapterId) {
        return request({
            url: `/eduservice/chapter/${chapterId}`,
            method: 'delete'
        })
    },
    

}