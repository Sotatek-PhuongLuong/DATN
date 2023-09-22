import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config'
import { Queue } from 'bull';
import * as ejs from 'ejs';
import { Comment } from 'entities/comment.entity';
import { User } from 'entities/user.entity';
import { join } from 'path';
import { CommentRepository } from './comment.repository';
import { CreateCommentInput } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(user: User, createCommentInput: CreateCommentInput) {
    // const comment = new Comment();
    const { name, point, description, email, productId } = createCommentInput;
    await this.commentRepository.save({
      name,
      point,
      description,
      email,
      productId,
      userId: user.id,
    });
  }
}
