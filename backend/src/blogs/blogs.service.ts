import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findAllPosts(includeUnpublished = false) {
    return this.prisma.post.findMany({
      where: includeUnpublished ? {} : { published: true },
      include: {
        author: {
          select: { name: true, avatar: true }
        },
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findPostBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatar: true }
        },
        category: true
      }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createPost(data: any, authorId: string) {
    // Generate slug from title if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    return this.prisma.post.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        published: data.published || false,
        authorId,
        categoryId: data.categoryId,
        publishedAt: data.published ? new Date() : null,
      }
    });
  }

  async updatePost(id: string, data: any) {
    return this.prisma.post.update({
      where: { id },
      data
    });
  }

  async deletePost(id: string) {
    return this.prisma.post.delete({
      where: { id }
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany();
  }

  async createCategory(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug
      }
    });
  }
}
