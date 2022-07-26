import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import formidable from 'formidable';
const stripe = require('stripe')(`${process.env.SECRET_KEY_STRIPE}`);

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (filename, filepath, publicFolder) => {
  const data = fs.readFileSync(filepath);
  fs.writeFileSync(`./public/${publicFolder}/${filename}`, data);
  await fs.unlinkSync(filepath);
  return;
};

const route = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async function (err, fields, files) {
      const meetingLocation = fields.meetingLocation.map((num) =>
        parseFloat(num),
      );
      const coverPhoto = files.coverPhoto
        ? `${files.coverPhoto.newFilename}${files.coverPhoto.originalFilename}`
        : undefined;
      const track = files.routeFile
        ? `${files.routeFile.newFilename}${files.routeFile.originalFilename}`
        : undefined;
      const {
        userId,
        name,
        description,
        difficulty,
        type,
        distance,
        length,
        groupTour,
        maxParticipants,
        price,
        meetingTime,
        startDate,
        endDate,
      } = fields;

      const product = await stripe.products.create({
        name: `${name} tour`,
        default_price_data: {
          currency: 'RON',
          unit_amount: parseInt(price) * 100,
        },
      });

      const route = await prisma.route.create({
        data: {
          name,
          description,
          difficulty,
          type,
          distance,
          length,
          track,
          coverPhoto,
          CreatorUser: { connect: { id: parseInt(userId) } },
          groupTour: groupTour === 'true',
          maxParticipants: parseInt(maxParticipants) || -1,
          price,
          meetingLocation,
          meetingTime,
          startDate,
          endDate,
          stripePrice: product.default_price,
        },
      });

      if (coverPhoto) {
        await saveFile(coverPhoto, files.coverPhoto.filepath, 'coverPhotos');
      }
      if (track) {
        await saveFile(track, files.routeFile.filepath, 'trackFiles');
      }
      return res.status(200).json(route);
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Internal error' });
  }
};

export default route;
