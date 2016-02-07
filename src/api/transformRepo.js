import _ from 'lodash'

export const toObj = r => r.toObject()

export const lightRepo = r => _.omit(r, ['cache', 'stars'])

export const fullRepo = r => {
  const repoWithoutCache = _.omit(r, ['cache'])
  const stars = _.mapValues(
    repoWithoutCache.stars,
    stars => stars.map(star => _.omit(star, '_id'))
  )
  return {
    ...repoWithoutCache,
    stars
  }
}
