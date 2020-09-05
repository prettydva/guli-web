import request from "@/utils/request"
export default {
//根据Id查询小节
getVideoById(videoId) {
    return request({
        url: `/eduservice/video/${videoId}`,
        method: 'get'
    })
},
//添加小节
addVideo(video) {
    return request({
        url: `/eduservice/video/addVideo`,
        method: 'post',
        data: video
    })
},
//修改小节
updateVideo(videoId, video) {
    return request({
        url: `/eduservice/video/${videoId}`,
        method: 'put',
        data: video
    })
},
//删除小节
deleteVideo(videoId) {
    return request({
        url: `/eduservice/video/${videoId}`,
        method: 'delete'
    })
},
//删除阿里云视频
deleteAliyunVideo(videoId){
    return request({
        url: `/eduvod/video/${videoId}`,
        method: 'delete'
    })   
},
}