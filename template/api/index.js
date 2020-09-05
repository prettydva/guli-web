import request from '@/utils/request'
export default{
    //查询前两条banner
    getHotInfo(){
        return request({
            url: '/eduservice/front/index',
            method: 'get'
        })
    }
}