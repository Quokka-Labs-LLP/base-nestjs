import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { DynamiclinkService } from './dynamiclink.service';

jest.mock('axios');

describe('DynamiclinkService', () => {
  let dynamiclinkService: DynamiclinkService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamiclinkService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              // Mock the values returned by ConfigService
              switch (key) {
                case 'FIREBASE_DYNAMICLINK':
                  return 'yourFirebaseDynamicLink';
                case 'WEBAPIKEY':
                  return 'yourWebApiKey';
                case 'DOMAIN_URI_PREFIX':
                  return 'yourDomainUriPrefix';
                case 'ANDROID_BUNDLE':
                  return 'yourAndroidBundle';
                case 'IOS_BUNDLE':
                  return 'yourIOSBundle';
                // Add more cases for other keys used in the service
              }
            }),
          },
        },
      ],
    }).compile();

    dynamiclinkService = module.get<DynamiclinkService>(DynamiclinkService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('generateLink', () => {
    it('should generate a dynamic link', async () => {
      // Arrange
      const linkToEncode = 'https://quokkalabs.com/';
      const socialDesc = 'QL';
      const socialTitle = 'QL';
      const expectedResponse = {
        shortLink: 'https://commonnest.page.link/WaskuLDJYWpxi4gs6',
      };

      const mockedAxiosPost = axios.post as jest.Mock;
      mockedAxiosPost.mockResolvedValueOnce({
        status: 200,
        data: expectedResponse,
      });

      // Act
      const result = await dynamiclinkService.generateLink(
        linkToEncode,
        socialTitle,
        socialDesc,
      );

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        'yourFirebaseDynamicLinkyourWebApiKey',
        {
          dynamicLinkInfo: {
            domainUriPrefix: 'yourDomainUriPrefix',
            link: linkToEncode,
            socialMetaTagInfo: {
              socialTitle: socialTitle ?? '',
              socialDescription: socialDesc ?? '',
            },
            androidInfo: {
              androidPackageName: 'yourAndroidBundle',
            },
            iosInfo: {
              iosBundleId: 'yourIOSBundle',
            },
          },
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
    });

    it('should throw an HttpException on error', async () => {
      // Arrange
      const linkToEncode = 'https://quokkalabs.com/';
      const socialDesc = 'QL';
      const socialTitle = 'QL';
      const errorMessage = 'Something went wrong';

      const mockedAxiosPost = axios.post as jest.Mock;
      mockedAxiosPost.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(
        dynamiclinkService.generateLink(linkToEncode, socialTitle, socialDesc),
      ).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: errorMessage,
          },
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });
});
