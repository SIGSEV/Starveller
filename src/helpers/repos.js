import _ from 'lodash'

export const getReposBoundaries = (repos) => {
  return {
    minStars: _.min(repos, repo => repo.summary.starsCount).summary.starsCount,
    maxStars: _.max(repos, repo => repo.summary.starsCount).summary.starsCount,
    minDate: new Date(_.min(repos, repo => new Date(repo.summary.createdAt).getTime()).summary.createdAt),
    maxDate: new Date()
  }
}
