import React from 'react'
import { Card, Table, message, Modal, Button, Select, Form, DatePicker } from 'antd'
import axios from '../../axios/index'
import Utils from './../../utils/utils'
const FormItem = Form.Item
const Option = Select.Option

export default class order extends React.Component {
  state = {
    orderInfo: {},
    orderConfirmVisable: false
  }
  params = {
    page: 1
  }
  formList = [
    {
      type: 'SELECT',
      label: '城市',
      field: 'city',
      placeholder: '全部',
      initialValue: '1',
      width: 80,
      list: [{ id: '0', name: '全部' }, { id: '1', name: '北京' }, { id: '2', name: '天津' }, { id: '3', name: '上海' }]
    },
    {
      type: '时间查询'
    },
    {
      type: 'SELECT',
      label: '订单状态',
      field: 'order_status',
      placeholder: '全部',
      initialValue: '1',
      width: 80,
      list: [{ id: '0', name: '全部' }, { id: '1', name: '进行中' }, { id: '2', name: '结束行程' }]
    }
  ]
  componentDidMount() {
    this.requestList()
  }

  handleFilter = (params) => {
    this.params = params
    this.requestList()
  }

  requestList = () => {
    let _this = this
    axios.ajax({
      url: '/order/list',
      params: this.params,
      isShowLoading: true,
    }).then(res => {
      let list = res.data.list.map((item, index) => {
        item.key = index
        return item
      })
      this.setState({
        list,
        pagination: Utils.pagination(res.data, (current) => {
          _this.params.page = current
          _this.requestList()
        })
      })
    })
  }

  //订单结束确认
  handleConfirm = () => {
    let item = this.state.selectedItem
    if (!item) {
      Modal.info({
        title: '信息',
        content: '请选择一条订单结束'
      })
      return
    }
    axios.ajax({
      url: '/order/ebike_info',
      data: {
        params: {
          orderId: item.id
        }
      }
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          orderInfo: res.result,
          orderConfirmVisable: true
        })
      }
    })
  }
  //结束订单
  handleFinishOrder = () => {
    let item = this.state.selectedItem
    axios.ajax({
      url: '/order/finish_order',
      data: {
        params: {
          orderId: item.id
        }
      }
    }).then((res) => {
      if (res.code === 0) {
        message.success('订单结束成功')
        this.setState({
          orderConfirmVisble: false
        })
        this.requestList();
      }
    })
  }

  onRowClick = (record, index) => {
    let selectKey = [index]
    this.setState({
      selectedRowkeys: selectKey,
      selectedItem: record
    })
  }

  openOrderDetail = () => {
    let item = this.state.selectedItem
    if (!item) {
      Modal.info({
        title: '信息',
        content: '请先选择一条订单'
      })
      return
    }
    window.open(`/#/common/order/detail/${item.id}`, '_blank')
  }
  render() {
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'order_sn'
      },
      {
        title: '车辆编号',
        dataIndex: 'bike_sn'
      },
      {
        title: '手机号',
        dataIndex: 'mobile'
      },
      {
        title: '里程',
        dataIndex: 'distance',
        render(distance) {
          return distance / 1000 + 'Km'
        }
      },
      {
        title: '行驶时长',
        dataIndex: 'total_time'
      },
      {
        title: '状态',
        dataIndex: 'status'
      },
      {
        title: '开始时间',
        dataIndex: 'start_time'
      },
      {
        title: '结束时间',
        dataIndex: 'end_time'
      },
      {
        title: '订单金额',
        dataIndex: 'total_fee'
      },
      {
        title: '实付金额',
        dataIndex: 'user_pay'
      }
    ]
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    const selectedRowKeys = this.state.selectedRowKeys
    const rowSelection = {
      type: 'radio',
      selectedRowKeys
    }
    return (
      <div>
        <Card>
          <BaseForm formList={this.formList} filterSubmit={this.hanleFilter} />
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Button type="primary" onClick={this.openOrderDetail}>订单详情</Button>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={this.handleConfirm}>结束订单</Button>
        </Card>
        <div className="content-wrap">
          <Table
            bordered
            columns={columns}
            dataSource={this.state.list}
            pagination={this.state.pagination}
            rowSelection={rowSelection}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  this.onRow(record, index)
                }
              }
            }}
          />
        </div>
        <Modal
          title="结束订单"
          visible={this.state.orderConfirmVisble}
          onCancel={() => {
            this.setState({
              orderConfirmVisble: false
            })
          }}
          onOk={this.handleFinishOrder}
          width={600}
        >
          <Form layout="horizontal">
            <FormItem label="车辆编号" {...formItemLayout}>
              {this.state.orderInfo.bike_sn}
            </FormItem>
            <FormItem label="剩余电量" {...formItemLayout}>
              {this.state.orderInfo.battery + '%'}
            </FormItem>
            <FormItem label="行程开始时间" {...formItemLayout}>
              {this.state.orderInfo.start_time}
            </FormItem>
            <FormItem label="当前位置" {...formItemLayout}>
              {this.state.orderInfo.location}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

class BaseForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="inline">
        <FormItem label="城市">
          {
            getFieldDecorator('city_id')(
              <Select
                style={{ width: 100 }}
                placeholder="全部"
              >
                <Option value="">全部</Option>
                <Option value="1">北京</Option>
                <Option value="2">天津</Option>
                <Option value="3">深圳</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('start_time')(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )
          }

        </FormItem>
        <FormItem label="~" colon={false}>
          {
            getFieldDecorator('end_time')(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )
          }
        </FormItem>
        <FormItem label="订单状态">
          {
            getFieldDecorator('op_mode')(
              <Select
                style={{ width: 80 }}
                placeholder="全部"
              >
                <Option value="">全部</Option>
                <Option value="1">进行中</Option>
                <Option value="2">行程结束</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem>
          <Button type="primary" style={{ margin: '0 20px' }}>查询</Button>
          <Button>重置</Button>
        </FormItem>
      </Form>
    )
  }
}
BaseForm = Form.create({})(BaseForm)
