import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getServiceStatus(): string {
    const filePath = path.join(__dirname, 'assets', 'success.html');
    return fs.readFileSync(filePath, 'utf-8');
  }
}
