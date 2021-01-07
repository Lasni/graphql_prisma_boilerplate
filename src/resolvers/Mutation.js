import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async login(parent, args, ctx, info) {
    const { prisma } = ctx

    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    })
    if (!user) {
      throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if (!isMatch) {
      throw new Error('Unable to log in')
    }
    const token = generateToken(user.id)
    return {
      token,
      user,
    }
  },
  async createUser(parent, args, { prisma }, info) {
    const hashedPassword = await hashPassword(args.data.password)
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword,
      },
    })
    const token = generateToken(user.id)
    return {
      user,
      token,
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const user = await prisma.mutation.deleteUser(
      { where: { id: userId } },
      info,
    )
    return user
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }
    return prisma.mutation.updateUser(
      {
        data: args.data,
        where: {
          id: userId,
        },
      },
      info,
    )
  },
}

export { Mutation as default }
