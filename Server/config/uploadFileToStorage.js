import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
//not used till now

export const uploadFileToStorage = async (file) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, file.buffer); // save file locally

    // Return a URL (example: localhost URL)
    return `http://localhost:7000/uploads/${fileName}`;
};
