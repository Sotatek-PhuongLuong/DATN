import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'
import { Exclude } from 'class-transformer';
import { Product } from './product.entity';
import { User } from './user.entity';
// import { User } from './image.entity';
@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column({ name: 'user_id'})
  @ApiProperty()
  userId: number

  @Column({ name: 'product_id'})
  @ApiProperty()
  productId: number

  @Column()
  @ApiProperty()
  point: number

  @Column()
  @Exclude()
  description: string

  @Column()
  @ApiProperty()
  name: string

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

  @ManyToOne(() => Product, product => product.comments)
  @JoinColumn({ name: 'product_id' })
  product: Product;


  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
