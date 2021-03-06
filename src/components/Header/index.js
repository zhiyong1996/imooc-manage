import React from 'react'
import { Row, Col } from 'antd'
import Util from '../../utils/utils'
import axios from '../../axios'
import './index.less'

export default class Header extends React.Component {

  constructor() {
    super()
    this.state = {
      sysTime: '',
      dayPictureUrl: '',
      weather: ''
    }
  }
  componentWillMount() {
    this.setState({
      userName: 'gogo'
    })
    setInterval(() => {
      let sysTime = Util.formatDate(new Date().getTime())
      this.setState({
        sysTime
      })
    }, 1000)
    this.getWeatherAPIData()
  }

  // 百度天气API接口
  //http://api.map.baidu.com/telematics/v3/weather?location=beijing&output=json&ak=3p49MVra6urFRGOT9s8UBWr2
  getWeatherAPIData() {
    let city = '广州'
    axios.jsonp({
      url: 'http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURIComponent(city) + '&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',
    }).then((res) => {
      if (res.status === 'success') {
        let data = res.results[0].weather_data[0]
        this.setState({
          dayPictureUrl: data.dayPictureUrl,
          weather: data.weather
        })
      }
    })
  }

  render() {
    const { menuType, menuName } = this.props
    return (
      <div className="header">
        <Row className="header-top">
          {
            menuType ?
              <Col span="6" className="logo">
                <img src="./assets/logo-ant.svg" alt="" />
                <span>通用管理页面</span>
              </Col> : ''
          }
          <Col span={menuType ? 18 : 24}>
            <span>欢迎, {this.state.userName}</span>
            <a href="javascript:void(0)">退出</a>
          </Col>
        </Row>
        {
          menuType ? '' :
            <Row className="breadcrumb">
              <Col span="4" className="breadcrumb-title">{menuName || '首页'}</Col>
              <Col span="20" className="weather">
                <span className="date">{this.state.sysTime}</span>
                <span className="weather-img">
                  <img src={this.state.dayPictureUrl} alt="" />
                </span>
                <span className="weather-detail">
                  {this.state.weather}
                </span>
              </Col>
            </Row>
        }
      </div>
    )
  }
}