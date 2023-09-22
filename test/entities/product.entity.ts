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
import { Image } from './image.entity';
@Entity('product')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column({ length: 100 })
    @ApiProperty()
    name: string

    @Column()
    @ApiProperty()
    price: number

    @Column({default: 1})
    @ApiProperty()
    type: number

    @Column({ nullable: true })
    @ApiProperty()
    discount: number

    @Column()
    @ApiProperty()
    description: string

    @Column('json')
    @ApiProperty()
    size: number[]

    @Column({ length: 200, nullable: true })
    @ApiProperty()
    material: string

    @Column({ nullable: true })
    @ApiProperty()
    guarantee: number

    @CreateDateColumn({ name: 'created_at', nullable: true })
    @ApiProperty()
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    @ApiProperty()
    updatedAt: Date

    @OneToMany(() => Comment, comment => comment.product)
    comments?: Comment[];

    @OneToMany(() => Image, image => image.product)
    listImage?: Image[];
}
