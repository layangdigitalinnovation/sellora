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
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
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
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
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
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
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
        authorId: string;
        categoryId: string;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
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
