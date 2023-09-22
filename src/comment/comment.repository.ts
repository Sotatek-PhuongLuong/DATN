import { NotFoundException } from '@nestjs/common';
import { Comment } from 'entities/comment.entity';
import { User } from 'entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {}
