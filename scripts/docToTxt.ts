import * as mammoth from 'mammoth';
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';


async function main() {
  const transcriptPath = join(__dirname, '../docs/transcript');
  const docx = await readdir(transcriptPath);
  for (let i = 0; i < docx.length; i++) {
    if (!docx[i].endsWith('.docx')) continue;
    const result = await mammoth.extractRawText({path: join(transcriptPath, `${docx[i]}`) });
    await writeFile(
      join(transcriptPath, docx[i].replace('.docx', '.txt')),
      result.value
    );
  }
}

main().then();
