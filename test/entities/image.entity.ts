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
import { Exclude, Expose } from 'class-transformer';
import { Product } from './product.entity';
@Entity('image')
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column({ default: '', length: 100 })
  @ApiProperty()
  image: string

  @Column({name: 'product_id' })
  @ApiProperty()
  productId: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  @ApiProperty()
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @ApiProperty()
  updatedAt: Date

  @ManyToOne(() => Product, product => product.comments)
  @JoinColumn({ name: 'product_id' })
  product?: Product;
}
