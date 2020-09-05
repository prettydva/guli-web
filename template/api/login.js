import request from '@/utils/request'
export default{
    login(member){
        return request({
            url: `/ucenter/member/login`,
            method: 'post',
            data: member
        })
    },
    getMemberInfo(){
        return request({
            url: `/ucenter/member/getMemberInfo`,
            method: 'get'
        })
    },
    createWxCode(){
        return request({
            url: `/api/ucenter/wx/login`,
            method: 'get'
        })
        
    },
    callback(){
        return request({
            url: `/api/ucenter/wx/callback`,
            method: 'get'
        })
    }
}