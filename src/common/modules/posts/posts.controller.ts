import { Body, Controller, Get, HttpException, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @Post()
  async posts(@Body(new ValidationPipe()) CreatePostDto: CreatePostDto) {
    try {
      const data =  await this.postsService.createPost(CreatePostDto);
      return {
          code: 1004,
          data: data
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
