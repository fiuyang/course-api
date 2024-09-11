import { BadRequestException } from '@nestjs/common';

export const newFileEditor = (
  req: any,
  file: any,
  callback: (err: any, result: any) => void,
) => {
  const extname = file.originalname.split('.').pop();
  const destination = [Date.now()].join('-') + '.' + extname;
  callback(null, destination);
};
export const imageFilter = (
  req: Request,
  file: any,
  callback: (err: any, valid: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
    return callback(
      new BadRequestException('File must be of type jpg, jpeg, png, or svg'),
      false,
    );
  }
  callback(null, true);
};

export const videoFilter = (
  req: Request,
  file: any,
  callback: (err: any, valid: boolean) => void,
) => {
  if (!file.originalname.match(/\.mp4$/)) {
    return callback(new BadRequestException('File must be of type mp4'), false);
  }
  callback(null, true);
};
