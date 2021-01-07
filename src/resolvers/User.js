import getUserId from '../utils/getUserId'

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, ctx, info) {
      const { request } = ctx
      const userId = getUserId(request, false)
      if (userId && userId === parent.id) {
        return parent.email
      } else return null
    },
  },
}

export { User as default }
