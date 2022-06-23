import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (filename, filepath) => {
  const data = fs.readFileSync(filepath);
  fs.writeFileSync(`./public/uploads/${filename}`, data);
  await fs.unlinkSync(filepath);
  return;
};

const settings = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const salt = bcrypt.genSaltSync();
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const newFileName = files.file
        ? `${files.file.newFilename}${files.file.originalFilename}`
        : undefined;
      let user;
      const {
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        description,
        newPassword,
      } = fields;
      try {
        const oldData = await prisma.user.findUnique({
          where: {
            id: parseInt(id),
          },
          select: {
            profilePicture: true,
          },
        });

        user = await prisma.user.update({
          where: { id: parseInt(id) },
          data: {
            email,
            password: newPassword
              ? bcrypt.hashSync(newPassword, salt)
              : undefined,
            firstName: firstName || '',
            lastName: lastName || '',
            phoneNumber: phoneNumber || '',
            description: description || '',
            profilePicture: newFileName || oldData.profilePicture,
          },
        });

        if (newFileName) {
          await saveFile(newFileName, files.file.filepath);
        }
      } catch (e) {
        console.log(e);
        res.status(404);
        res.json({ error: 'User not existing' });
      }

      return res.status(200).json(user);
    });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
};

export default settings;
