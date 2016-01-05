import { contains } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Select from 'components/SelectYolo'
import StarsEvolution from 'components/graphs/StarsEvolution'

import { chosenChoose } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Builder.scss')
}

@connect(
  state => ({
    repos: state.repos.list,
    chosen: state.repos.chosen
  })
)
class Builder extends Component {

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  handleAddRepo ({ value: repo }) {
    const { chosen } = this.props
    if (!contains(chosen, repo)) {
      this.props.dispatch(chosenChoose(repo))
    }
  }

  render () {
    const { repos, chosen } = this.props
    const options = repos
      .filter(repo => !contains(chosen, repo))
      .map(r => ({ value: r, label: r.name }))

    return (
      <div className='Builder'>
        <div className='repos-graphs'>
          <div className='repos-graphs--list'>
            <Select
              options={options}
              placeholder='Find a repo'
              onChange={::this.handleAddRepo}
              className='repo-search'/>
          </div>
          <div className='repos-graphs--view'>
            <StarsEvolution repos={chosen} />
          </div>
        </div>
      </div>
    )
  }

}

export default Builder
