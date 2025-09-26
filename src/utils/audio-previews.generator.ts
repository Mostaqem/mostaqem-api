import { Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import https from 'https';
import path from 'path';
import { pipeline } from 'stream/promises';
import fs from 'node:fs';

export function generateAudioPreview(
  sourceLink: string,
  tilawaId: string,
  surahId: string,
): Promise<string | undefined> {
  const rangeHeader = 'bytes=200000-600000';
  // check if previews folder exist or not
  if (!fs.existsSync(path.resolve('uploads', 'previews'))) {
    fs.mkdirSync(path.resolve('uploads', 'previews'), { recursive: true });
  }

  //check if the file is exist or not
  if (
    fs.existsSync(
      path.resolve('uploads', 'previews', `${tilawaId}-${surahId}.mp3`),
    )
  ) {
    Logger.log(`Preview file already exists: ${tilawaId}-${surahId}.mp3`);
    return Promise.resolve(
      `${process.env.INTERNAL_URL}/uploads/previews/${tilawaId}-${surahId}.mp3`,
    );
  }

  return new Promise((resolve) => {
    const req = https.get(
      sourceLink,
      { headers: { Range: rangeHeader } },
      (res) => {
        if (res.statusCode !== 206 && res.statusCode !== 200) {
          Logger.warn(`Unexpected response: ${res.statusCode}`);
          resolve(undefined);
          res.resume();
          return;
        }

        // Spawn ffmpeg reading from stdin (pipe:0). Use -f mp3 if input might be a raw snippet.
        // -y to overwrite, -hide_banner for quieter output
        const previewDurationSec = 15;
        const ff = spawn(
          'ffmpeg',
          [
            '-hide_banner',
            '-loglevel',
            'error',
            '-y',
            '-f',
            'mp3',
            '-i',
            'pipe:0',
            '-t',
            String(previewDurationSec),
            '-c:a',
            'libmp3lame',
            '-b:a',
            '96k',
            path.resolve('uploads', 'previews', `${tilawaId}-${surahId}.mp3`),
          ],
          {
            stdio: ['pipe', 'inherit', 'inherit'],
          },
        );

        ff.on('close', (code) => {
          if (code === 0)
            resolve(
              `${process.env.INTERNAL_URL}/uploads/previews/${tilawaId}-${surahId}.mp3`,
            );
          else {
            Logger.warn(`ffmpeg exited with ${code}`);
            resolve(undefined);
          }
        });

        pipeline(res, ff.stdin).catch((err) => {
          if (err.code === 'EPIPE') {
            Logger.warn('FFmpeg process closed early, stopping data transfer');
          } else {
            Logger.warn(`Pipeline error: ${err.message}`);
          }
          try {
            ff.stdin.destroy();
          } catch {}
        });
      },
    );

    req.end();
  });
}
