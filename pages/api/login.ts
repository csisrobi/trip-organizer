import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && bcrypt.compareSync(password, user.password)) {
    res.json(user);
  } else {
    res.status(401);
    res.json({ error: 'Email or Password is wrong' });
  }
};

export default login;
