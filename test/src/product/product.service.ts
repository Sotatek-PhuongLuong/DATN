import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'entities/user.entity';
import { OTP_TYPE } from 'src/user-otp/constants';
import { UserOtpService } from 'src/user-otp/user-otp.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Product } from 'entities/product.entity';
import { CreateProductInput, GetListProductInput } from './dto/product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'entities/image.entity';
import { OrderByProduct } from './product.constants';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  async getListProduct(getListProductInput: GetListProductInput) {
    const { page, limit, type, orderBy } = getListProductInput;
    let condition = {}
    if (type) {
      condition = {
        where: {
          type,
        }
      }
    }
    let conditionOrderBy = {}
    if (orderBy == OrderByProduct.OUTSTANDING) {
      conditionOrderBy = {
        order: {price: 'DESC'},
      }
    }
    const skip = (page - 1) * limit;
    const listProduct = await this.repository.find({
      ...condition,
      ...conditionOrderBy,
      take: limit,
      skip: skip,
      relations: ['listImage'],
    });
    return listProduct;
  }

  async createProduct(dto: CreateProductInput) {
    const { images, ...createProduct } = dto;
    const product = await this.repository.save(createProduct);
    await Promise.all(
      images.map((image) => {
        const _image = new Image();
        _image.image = image;
        _image.productId = product.id;
        return _image.save();
      }),
    );
    return this.repository.save(createProduct);
  }

  async updateProduct(dto: CreateProductInput, id: number) {
    return Product.update(
      {
        id,
      },
      {
        ...dto,
      },
    );
  }

  async deleteProduct(id: number) {
    return await Product.delete(id);
  }
}
