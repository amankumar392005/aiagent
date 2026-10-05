import fs from "fs"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const extractText = async (filePath) => {
    const buffer = fs.readFileSync(filePath)

    const result = await pdfParse(buffer)

    return result.text
}

export default extractText