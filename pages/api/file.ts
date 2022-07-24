import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import formidable from 'formidable';
import { readXML } from 'read-xml';
import { xml2json } from 'xml-js';

const saveFile = async (filename, filepath, publicFolder) => {
  const data = fs.readFileSync(filepath);
  fs.writeFileSync(`./public/${publicFolder}/${filename}`, data);
  await fs.unlinkSync(filepath);
  return;
};

const getFile = async (req: NextApiRequest, res: NextApiResponse) => {
  readXML(
    fs.readFileSync(`./public/trackFiles/${req.query.filename}`),
    (err, data) => {
      const result = JSON.parse(
        xml2json(data.content, { compact: true, spaces: 4 }),
      );
      const response =
        result.kml.Document.Placemark.LineString.coordinates._text
          .split(' ')
          .map((data) => data.split(',').map((value) => parseFloat(value)))
          .map((data) => [data[1], data[0], data[2]]);

      res.status(200);
      res.json(response);
    },
  );
};

export default getFile;
