import { PrismaService } from '../prisma/prisma.service';
export declare class BlogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllPosts(includeUnpublished?: boolean): Promise<({
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
    findPostBySlug(slug: string): Promise<{
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
    createPost(data: any, authorId: string): Promise<{
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
    updatePost(id: string, data: any): Promise<{
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
    deletePost(id: string): Promise<{
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
