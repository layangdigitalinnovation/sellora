import { BlogsService } from './blogs.service';
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    findAll(all: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        };
        author: {
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    })[]>;
    findOne(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        };
        author: {
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    }>;
    create(data: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    }>;
    findAllCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }[]>;
    createCategory(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    updateCategory(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
}
