import request from "@/utils/request"
export default {
    //生成统计数据
    createStaData(date) {
        return request({
            url: `/edusta/sta/registerCount/`,
            method: 'post',
            data: date
        })
    },
    //图表显示
    showData(searchObj) {
        return request({
            url: `/edusta/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method: 'get'
        })
    },


}