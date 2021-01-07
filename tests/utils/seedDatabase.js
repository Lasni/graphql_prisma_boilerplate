import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
  input: {
    name: 'dummyUser1',
    email: 'dummy1@mail.com',
    password: bcrypt.hashSync('dummypass1'),
  },
  user: undefined,
  jwt: undefined,
}

const userTwo = {
  input: {
    name: 'dummyUser2',
    email: 'dummy2@mail.com',
    password: bcrypt.hashSync('dummypass2'),
  },
  user: undefined,
  jwt: undefined,
}

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyUsers()

  // dummy user 1 for further testing
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // dummy user 2 for further testing
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)
}

export { seedDatabase as default, userOne, userTwo }
