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
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { Image } from 'entities/image.entity';
import { OrderByProduct } from './product.constants';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  async getListProduct(getListProductInput: GetListProductInput) {
    const { page, limit, type, orderBy, key } = getListProductInput;
    let condition = {}
    if (type) {
      condition = {
        category: type
      }
    }
    let conditionOrderBy = {}
    if (orderBy == OrderByProduct.OUTSTANDING) {
      conditionOrderBy = {
        order: { price: 'DESC' },
      }
    }
    let conditionPage = {}
    if (page && limit) {
      const skip = (page - 1) * limit;
      conditionPage = {
        take: limit,
        skip: skip,
      }
    }
    if (key) {
      condition = {
        ...condition,
        name: Like(`%key%`)
      }
    }
    const [ listProduct, total] = await this.repository.findAndCount({
      where: {
        ...condition,
      },

      ...conditionOrderBy,
      ...conditionPage
    });
    return { total, listProduct };
  }

  async createProduct(dto: CreateProductInput) {
    const { images, ...createProduct } = dto;
    const product = await this.repository.save({ ...createProduct, listImage: images });
    // await Promise.all(
    //   images.map((image) => {
    //     const _image = new Image();
    //     _image.image = image;
    //     _image.productId = product.id;
    //     return _image.save();
    //   }),
    // );
    return product;
  }

  async updateProduct(dto: CreateProductInput, id: number) {
    // delete(dto.type)
    const _image = dto.images;
    delete(dto.images)
    await Product.update(
      {
        id,
      },
      {
        ...dto,
        listImage: _image
      },
    );
    return 'success'
  }

  async deleteProduct(id: number) {
    return await Product.delete(id);
  }
}
