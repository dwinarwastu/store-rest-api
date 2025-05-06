import multer from "multer";
import { formateDate } from "../utils/formateDate.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, formateDate(Date.now()) + "_" + file.originalname);
  },
});

export const upload = multer({ storage });
