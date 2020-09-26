const User = require('../src/models/user')

const verbosedCookiedUsers = [
  {
    _id: '5f6f6c2a15d57334649e2c69',
    loginIdentifier: 'vdhDWVJLr2MsagJ5tH5f63mcmLsmd',
    loginMethods: ['Google'],
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZmNmMyYTE1ZDU3MzM0NjQ5ZTJjNjkiLCJpYXQiOjE2MDExNDAxODl9.6rhJG3hDOy87ZN8NCqufRb2MVbNeg_xY3pr0ftEz2Tc',
    cookie: 's%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZmNmMyYTE1ZDU3MzM0NjQ5ZTJjNjkiLCJpYXQiOjE2MDExNDAxODl9.6rhJG3hDOy87ZN8NCqufRb2MVbNeg_xY3pr0ftEz2Tc.jVQ8EiBpS4GZWQgSYJoNU9%2BnEU5W9sLFODc3q5Wvunk'
  },
  {
    _id: '5f6f6fb53ca77a27fca0519a',
    loginIdentifier: 'Ulq1K2@qf.E9j7MBGz',
    loginMethods: ['Google'],
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZmNmZiNTNjYTc3YTI3ZmNhMDUxOWEiLCJpYXQiOjE2MDExNDAyNTF9.q2qyzuftJ3GGj3lv1s5eavbxZkoT5bC2PHNXLMe5E78',
    cookie: 's%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZmNmZiNTNjYTc3YTI3ZmNhMDUxOWEiLCJpYXQiOjE2MDExNDAyNTF9.q2qyzuftJ3GGj3lv1s5eavbxZkoT5bC2PHNXLMe5E78.%2Bf9t6K7a7IAKmS5wTGSqMy7gAo%2BakzRr7iYcg3Bx0Ag'
  }
]

const invalidUsers = {
  invalidSyntax: {
    _id: 'WUui93DXD1Vn0zxa',
    cookie: 's%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJXVXVpOTNEWEQxVm4wenhhIiwiaWF0IjoxNjAxMTQwNjc4fQ.IBtSeAm7LALGIldDvDoMRAX1fCvEhMIcY7xK3UmZNic.IFm8u7BiN4KNxVCip8va8SE8xoTUUv%2FvaJmOmSfdjpk',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJXVXVpOTNEWEQxVm4wenhhIiwiaWF0IjoxNjAxMTQwNjc4fQ.IBtSeAm7LALGIldDvDoMRAX1fCvEhMIcY7xK3UmZNic'
  },
  validSyntax: {
    _id: '3bf8zf1o6te9jia1fkdfp8rq',
    cookie: 's%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYmY4emYxbzZ0ZTlqaWExZmtkZnA4cnEiLCJpYXQiOjE2MDExNDA2MTl9.e6H5u7DF4G34a1h6QtZvt5Ql8kmrK2jBdUrLJK4YcMM.0O4quuTyqhLqPAuPDJzBzLnWhC2sRP1hlSgwWWNgFWg',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYmY4emYxbzZ0ZTlqaWExZmtkZnA4cnEiLCJpYXQiOjE2MDExNDA1MDF9.zM2GR0vLiC8zG8nobqQPQ5PT_f_jXxVnKsx5rXZbzeQ'
  }
}

async function generateVerboseRandomUser (authorized = true) {
  let verbosedCookiedUser

  if (Math.random() < 0.5) {
    verbosedCookiedUser = verbosedCookiedUsers[0]
  } else {
    verbosedCookiedUser = verbosedCookiedUsers[1]
  }

  const user = await (new User({
    _id: verbosedCookiedUser._id,
    loginIdentifier: verbosedCookiedUser.loginIdentifier,
    loginMethods: verbosedCookiedUser.loginMethods,
    authorized
  }).save())

  user.jwt = verbosedCookiedUser.jwt
  user.cookie = verbosedCookiedUser.cookie

  return user
}

module.exports = {
  generateVerboseRandomUser,
  invalidUsers
}
