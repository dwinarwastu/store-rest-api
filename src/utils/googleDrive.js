import { google } from "googleapis";
import path from "path";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadsFileToDrive = async (file) => {
  const fileMetaData = {
    name: file.originalname,
    parents: ["1edponVu4mqG-6lcHQuBa12qZh0lidGnE"],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: "id",
  });

  fs.unlinkSync(file.path);
  return response.data.id;
};

export const deleteFileFromDrive = async (fileId) => {
  await drive.files.delete({ fileId });
  console.log(`File ${fileId} deleted from Google Drive`);
};
