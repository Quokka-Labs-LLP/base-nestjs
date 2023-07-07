import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DynamiclinkService {
  constructor(private configService: ConfigService) {}
  async generateLink(
    linkToEncode: string,
    socialTitle: string,
    socialDesc: string,
  ): Promise<{ shortLink: string }> {
    const url = `${this.configService.get(
      'FIREBASE_DYNAMICLINK',
    )}${this.configService.get('WEBAPIKEY')}`;
    const headers = { 'Content-Type': 'application/json' };
    const request = {
      dynamicLinkInfo: {
        domainUriPrefix: `${this.configService.get('DOMAIN_URI_PREFIX')}`,
        link: linkToEncode,
        socialMetaTagInfo: {
          socialTitle: socialTitle ?? '',
          socialDescription: socialDesc ?? '',
        },
        androidInfo: {
          androidPackageName: `${this.configService.get('ANDROID_BUNDLE')}`,
        },
        iosInfo: {
          iosBundleId: `${this.configService.get('IOS_BUNDLE')}`,
          //   iosAppStoreId: `${this.configService.get('IOS_APPSTORE_ID')}`,
        },
      },
    };
    try {
      const response = await axios.post(url, request, { headers: headers });
      const result = response.status === 200 ? response.data : null;
      return {
        shortLink: result.shortLink,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: e.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
  }
}
