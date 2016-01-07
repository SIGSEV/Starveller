import React, { Component } from 'react'
import Select from 'react-select'

class SelectYolo extends Component {

  renderOption (option) {
    const repo = option.value
    const { name, summary } = repo
    const { starsCount } = summary

    return (
      <div className='repo-option'>
        <div className='name'>
          <i className='octicon octicon-repo' />
          <h4>{name}</h4>
        </div>
        <div className='infos'>
          <span>{starsCount}</span>
          <i className='octicon octicon-star' />
        </div>
      </div>
    )
  }

  render () {
    return (
      <Select optionRenderer={::this.renderOption} {...this.props} />
    )
  }

}

export default SelectYolo
