import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(@Query('all') all: string) {
    return this.blogsService.findAllPosts(all === 'true');
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findPostBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any, @Req() req: any) {
    return this.blogsService.createPost(data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.blogsService.updatePost(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.deletePost(id);
  }

  @Get('categories/all')
  findAllCategories() {
    return this.blogsService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() data: any) {
    return this.blogsService.createCategory(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.blogsService.updateCategory(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.blogsService.deleteCategory(id);
  }
}
