import { debounce, values } from 'lodash'
import r from 'superagent'
import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'

@connect(
  state => ({
    repos: values(state.repos.all)
  })
)
class RepoSearch extends Component {

  static propTypes = {
    onRepoSelect: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.debouncedLoadOptions = debounce(::this.getOptions, 500)
  }

  getOptions (input, done) {

    const fromCache = this.props.repos
      .map(r => ({ value: r, label: r.name }))

    if (input.length < 3) {
      return done(null, {
        options: fromCache
      })
    }

    r.get(`https://api.github.com/search/repositories?q=${input}&sort=stars`)
      .end((err, res) => {
        if (err) { return done(err) }
        const { items } = res.body

        const fromGithub = items
          .map(r => {
            const repo = {
              label: r.full_name,
              value: {
                name: r.full_name,
                summary: {
                  starsCount: r.stargazers_count
                }
              }
            }
            return repo
          })

        const options = [
          ...fromGithub,
          ...fromCache
        ]

        done(null, { options })
      })
  }

  handleChange ({ value: repo }) {
    this.props.onRepoSelect(repo)
  }

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
      <Select.Async
        autoload={false}
        loadOptions={this.debouncedLoadOptions}
        optionRenderer={::this.renderOption}
        placeholder='Search repo...'
        onChange={::this.handleChange} />
    )
  }

}

export default RepoSearch
