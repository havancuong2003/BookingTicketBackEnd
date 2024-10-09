import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.movie.findMany({
      include: {
        types: {
          select: {
            type: true, // Lấy thông tin thể loại của phim
          },
        },
      },
    });
  }

  async create(data: MovieDto) {
    const movieTypes = [];

    // Kiểm tra và xử lý các loại
    if (data.types && Array.isArray(data.types)) {
      for (const typeName of data.types) {
        // Tìm kiếm loại theo tên
        let type = await this.prisma.type.findUnique({
          where: { name: typeName },
        });

        // Nếu không tìm thấy loại, tạo loại mới
        if (!type) {
          type = await this.prisma.type.create({
            data: { name: typeName },
          });
        }

        // Thêm ID của loại vào danh sách movieTypes
        movieTypes.push(type.id); // Thay đổi từ { id: type.id } thành type.id
      }
    }

    // Tạo movie
    const movie = await this.prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        director: data.director,
        actors: data.actors,
        releaseDate: data.releaseDate,
        rating: data.rating,
        status: data.status,
        banner: data.banner,
        duration: data.duration,
        trailer: data.trailer,
      },
    });

    // Kết nối các loại phim với movie đã tạo
    await this.prisma.movieType.createMany({
      data: movieTypes.map((typeId) => ({
        movieId: movie.id,
        typeId: typeId,
      })),
    });

    return movie; // Trả về thông tin của movie đã được tạo
  }

  async update(id: number, data: MovieDto) {
    // Kiểm tra xem bộ phim có tồn tại không
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Xóa tất cả các loại phim cũ
    await this.prisma.movieType.deleteMany({
      where: { movieId: id },
    });

    const movieTypes = [];

    // Kiểm tra và xử lý các loại
    if (data.types && Array.isArray(data.types)) {
      for (const typeName of data.types) {
        // Tìm kiếm loại theo tên
        let type = await this.prisma.type.findUnique({
          where: { name: typeName },
        });

        // Nếu không tìm thấy loại, tạo loại mới
        if (!type) {
          type = await this.prisma.type.create({
            data: { name: typeName },
          });
        }

        // Thêm ID của loại vào danh sách movieTypes
        movieTypes.push(type.id); // Chỉ cần ID của loại
      }
    }

    // Cập nhật bộ phim
    const updatedMovie = await this.prisma.movie.update({
      where: { id },
      data: {
        title: data.title, // Cập nhật tiêu đề
        description: data.description, // Cập nhật mô tả
        director: data.director, // Cập nhật đạo diễn
        actors: data.actors, // Cập nhật diễn viên
        releaseDate: data.releaseDate, // Cập nhật ngày phát hành
        rating: data.rating, // Cập nhật đánh giá
        status: data.status, // Cập nhật trạng thái
        banner: data.banner, // Cập nhật banner
        duration: data.duration, // Cập nhật thời gian
        trailer: data.trailer, // Cập nhật trailer
        // Không cập nhật types ở đây
      },
    });

    // Kết nối với các loại phim đã xử lý
    await this.prisma.movieType.createMany({
      data: movieTypes.map((typeId) => ({
        movieId: updatedMovie.id,
        typeId: typeId,
      })),
    });

    return updatedMovie; // Trả về thông tin của bộ phim đã được cập nhật
  }

  async delete(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }

  async findById(id: number) {
    return this.prisma.movie.findUnique({
      where: {
        id: id, // Đảm bảo rằng id được truyền vào đây
      },
    });
  }

  async getAllStatus() {
    return this.prisma.movie.findMany({
      select: {
        status: true,
      },
    });
  }
}
