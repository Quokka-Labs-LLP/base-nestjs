import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/posts.dto';
import Posts from './posts.entity';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>
        ) {}


  getAllPosts(): string {
    return 'Hello Posts!';
  }

  async createPost(CreatePostDto: CreatePostDto) {
      console.log('create post', CreatePostDto)
    const newPost = await this.postsRepository.create({
        title: CreatePostDto.title,
        content: CreatePostDto.content
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }
}
