import { Body, Controller, Get, HttpException, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(){
    const msg =  this.postsService.getAllPosts();
    return {
      code : 102,
      data: `Working!!, ${msg}`
    }
  }
  
  @Post()
  async posts(@Body(new ValidationPipe()) CreatePostDto: CreatePostDto) {
    try {
      const data =  await this.postsService.createPost(CreatePostDto);
      return {
          code: 105,
          data: data
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
