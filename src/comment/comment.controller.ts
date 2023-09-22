import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/user.entity';
import { UserScope } from 'src/user/decorators/user.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService, // private userTokenService: UserTokenService
  ) {
    // super();
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createComment(
    @UserScope() user: User,
    @Body() createCommentInput: CreateCommentInput,
  ) {
    await this.commentService.createComment(user, createCommentInput);
    return 'oke';
  }
}
