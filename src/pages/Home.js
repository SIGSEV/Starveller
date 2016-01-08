import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { shuffle } from 'lodash'

import { resetRepo, fetchAndGo, askRepo } from 'actions/repos'

import Select from 'components/SelectYolo'
import ReposCollection from 'components/ReposCollection'

@connect(
  state => ({
    reposList: state.repos.list,
    trendingRepos: state.repos.trending
  })
)
class Home extends Component {

  constructor (props) {
    super(props)

    this.state = {
      randomRepos: shuffle(props.reposList).slice(0, 4)
    }
  }

  handleSearch (search) {
    if (search && search.value) {
      const repo = search.value
      this.props.dispatch(fetchAndGo(repo))
    } else {
      this.props.dispatch(resetRepo())
    }
  }

  fetch () {
    const { value } = this.refs.createRepo

    this.props.dispatch(askRepo(value))
  }

  render () {
    const { reposList, trendingRepos } = this.props

    const options = reposList.map(r => ({ value: r, label: r.name }))

    return (
      <div>

        <div className='contained'>

          <h1>
            {'Add a new dimension to Github st'}
            <i className='mega-octicon octicon-star' />
            {'rs.'}
          </h1>

          <div className='search-container'>
            <Select
              options={options}
              placeholder='Find a repo'
              onChange={::this.handleSearch}
              className='repo-search'/>
          </div>

          <div>
            <input type='text' ref='createRepo'/>
            <button onClick={::this.fetch}>{'fetch'}</button>
          </div>

          <hr />

          <h2>
            {'No idea? You can '}
            <Link to='create'>
              <i className='octicon octicon-plus' />
              {' submit a repo'}
            </Link>
            {' or check this '}
            <strong>{'awesome'}</strong>
            {' selection:'}
          </h2>

          <ReposCollection repos={trendingRepos} />

          <div className='collection-actions'>
            <Link to='/browse'>
              {'Browse all repos '}
              <i className='octicon octicon-chevron-right' />
            </Link>
          </div>

          <hr />

          <div className='explain'>
            <h3>{'Analyse stars origin in time'}</h3>
            <p>
              {'Easily detect importants stars movement, and link them with events (social event, releases, etc.). Display all of that in a nice manner, and you make the world a better place. Here. Now.'}
            </p>
          </div>

          <div className='explain'>
            <h3>{'Visualize tech choices directions'}</h3>
            <p>
              {'Github stars are a '}
              <strong>{'very good'}</strong>
              {' indicator of the "health" of a project. But sometimes they can be "false positive". Observe star progression to see if the repo is still liked!'}
            </p>
          </div>

          <div className='z' style={{ margin: '4em 0' }}>
            <Link to='create' className='b'>
              <i className='octicon octicon-plus' />
              {'Submit your repo now!'}
            </Link>
          </div>

          <hr />

          <h2>{'"Why have I to submit my repo and don\'t see results instantly?"'}</h2>

          <p>
            <a href='https://github.com/SIGSEV/Starveller/pulls' target='_blank'>
              {'PR accepted'}
            </a>
            {'.'}
          </p>

        </div>

      </div>
    )
  }

}

export default Home
