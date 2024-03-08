export interface BufferedFile {
  fieldName: string;
  originalname: string;
  encoding: string;
  mimetype: any;
  size: number;
  buffer: Buffer | string;
}
