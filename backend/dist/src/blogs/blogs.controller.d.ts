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
        publishedAt: Date | null;
        categoryId: string;
        authorId: string;
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
        publishedAt: Date | null;
        categoryId: string;
        authorId: string;
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
        publishedAt: Date | null;
        categoryId: string;
        authorId: string;
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
        publishedAt: Date | null;
        categoryId: string;
        authorId: string;
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
        publishedAt: Date | null;
        categoryId: string;
        authorId: string;
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
}
