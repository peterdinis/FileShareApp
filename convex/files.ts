import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error('Not authenticated');
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveFile = mutation({
    args: {
        storageId: v.id('_storage'),
        name: v.string(),
        size: v.number(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error('Not authenticated');

        return await ctx.db.insert('files', {
            storageId: args.storageId,
            name: args.name,
            size: args.size,
            type: args.type,
            ownerId: userId,
        });
    },
});

export const listFiles = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const files = await ctx.db
            .query('files')
            .withIndex('by_owner', (q) => q.eq('ownerId', userId))
            .collect();

        return Promise.all(
            files.map(async (file) => ({
                ...file,
                url: await ctx.storage.getUrl(file.storageId),
            }))
        );
    },
});

export const createShare = mutation({
    args: {
        fileId: v.id('files'),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error('Not authenticated');

        const file = await ctx.db.get(args.fileId);
        if (!file || file.ownerId !== userId) {
            throw new Error('File not found or access denied');
        }

        const accessCode = Math.random().toString(36).substring(2, 15);

        await ctx.db.insert('shares', {
            fileId: args.fileId,
            accessCode,
            createdBy: userId,
        });

        return { accessCode };
    },
});

export const getSharedFile = query({
    args: {
        accessCode: v.string(),
    },
    handler: async (ctx, args) => {
        const share = await ctx.db
            .query('shares')
            .withIndex('by_access_code', (q) =>
                q.eq('accessCode', args.accessCode)
            )
            .first();

        if (!share) return null;

        const file = await ctx.db.get(share.fileId);
        if (!file) return null;

        return {
            ...file,
            url: await ctx.storage.getUrl(file.storageId),
        };
    },
});
