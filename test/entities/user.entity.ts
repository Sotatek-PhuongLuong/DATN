import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer';
import { Comment } from './comment.entity';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column({ default: '', length: 100 })
  @ApiProperty()
  userName: string

  @Column({ default: '', length: 100 })
  @ApiProperty()
  avatar: string

  @Column()
  @Exclude()
  password: string

  @Column()
  @ApiProperty()
  roles: string

  @Unique('email', ['email'])
  @Column({ length: 200 })
  @ApiProperty()
  email: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  @ApiProperty()
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @ApiProperty()
  updatedAt: Date

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];
}
