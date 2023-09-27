import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Comment } from 'entities/comment.entity';
import { UserModule } from 'src/user/user.module';
import { CommentController } from './comment.controller';
// import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
