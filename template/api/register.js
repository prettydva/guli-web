import request from '@/utils/request'
export default{
    //发验证码
    sendCode(phone){
        return request({
            url: `/edumsm/msm/send/${phone}`,
            method: 'get'
        })
    },
    register(member){
        return request({
            url: `/ucenter/member/register`,
            method: 'post',
            data: member
        })
    }
}