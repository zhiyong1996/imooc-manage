import React from 'react'
import { Button, Input, Checkbox, Select, Form, DatePicker } from 'antd'
import Utils from './../../utils/utils'
const FormItem = Form.Item
class FilterForm extends React.Component {
  handleFilterSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue()
    this.props.filterSubmit(fieldsValue)
  }

  reset = () => {
    this.props.form.resetFields()
  }

  initFormList = () => {
    const { getFieldDecorator } = this.props.form
    const formList = this.props.formList
    const formItemList = []
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label
        let field = item.field
        let initialValue = item.initialValue || ''
        let placeholder = item.placeholder
        let width = item.width || 80
        if (item.type === '时间查询') {
          const begin_time = <FormItem label="订单时间" key="start_time">
            {
              getFieldDecorator('begin_time')(
                <DatePicker showTime={true} placeholder="开始时间" format="YYYY-MM-DD HH:mm:ss" />
              )
            }
          </FormItem>
          formItemList.push(begin_time)
          const end_time = <FormItem label="~" key="end_time" colon={false}>
            {
              getFieldDecorator('end_time')(
                <DatePicker showTime={true} placeholder="结束时间"format="YYYY-MM-DD HH:mm:ss" />
              )
            }
          </FormItem>
          formItemList.push(end_time)
        } else if (item.type === 'INPUT') {
          const INPUT = <FormItem label={label} key={field}>
            {
              getFieldDecorator(field)(
                < Input type="text" placeholder={placeholder} />
              )
            }
          </FormItem>
          formItemList.push(INPUT)
        } else if (item.type === 'SELECT') {
          const SELECT = <FormItem label={label} key={field}>
            {
              getFieldDecorator(field, {
                initialValue: initialValue
              })(
                <Select
                  style={{ width: width }}
                  placeholder={placeholder}
                >
                  {Utils.getOptionList(item.list)}
                </Select>
              )
            }
          </FormItem>
          formItemList.push(SELECT)
        } else if (item.iype === 'CHECKBOX') {
          const CHECKBOX = <FormItem label={label} key={field}>
            {
              getFieldDecorator(field, {
                valuePropName: 'checked',
                initialValue: initialValue
              })(
                <Checkbox>{label}</Checkbox>
              )
            }
          </FormItem>
          formItemList.push(CHECKBOX)
        }
      })
    }
    return formItemList
  }

  render() {
    return (<Form layout="inline">
      {this.initFormList()}
      <FormItem>
        <Button type="primary" onClick={this.handleFilterSubmit} style={{ margin: '0 20px' }}>
          查询
        </Button>
        <Button type="primary" onClick={this.reset}>重置</Button>
      </FormItem>
    </Form>)
  }
}

export default Form.create({})(FilterForm)