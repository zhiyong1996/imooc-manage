import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
export default class Axios {
  static jsonp(options) {
    return new Promise((resolve, reject) => {
      JsonP(options.url, {
        param: 'callback'
      }, function (err, res) {
        if (res.status === 'success') {
          resolve(res)
        } else {
          reject(res.message)
        }
      })
    })
  }

  static ajax(options) {
    let loading;
    if (options.params && options.isShowLoading !== false){
      loading = document.getElementById('ajaxLoading')
      loading.style.display  = 'block'
    }
    let baseApi = 'https://www.easy-mock.com/mock/5c149b721ee30f317685ba15/mockapi'
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: 'get',
        baseURL: baseApi,
        timeout: 5000,
        params: (options.data && options.data.params) || ''
      }).then((response) => {
        if (options.params && options.isShowLoading !== false) {
          loading = document.getElementById('ajaxLoading')
          loading.style.display = 'none'
        }
        if (response.status == '200') {
          let res = response.data
          if (res.code == '0') {
            resolve(res.data)
          } else {
            Modal.warning({
              title: '提示',
              content: res.msg
            })
          }
        } else {
          reject(response.code)
        }
      })
    })
  }
}