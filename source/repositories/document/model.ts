import {Db, ObjectId} from 'mongodb';
import {databaseConnection} from 'repositories/connection.js';
import {DocumentCreate, DocumentListQuery, DocumentQuery, DocumentUpdate} from './types.js';
import {Core} from "~core/namespace.js";

export class Document {
    static Readonly = 0x1;
    static StorageTelegram = 0x2;
    static StorageAzure = 0x4;

    constructor(
        readonly id: string,
        readonly name: string,
        readonly size: number,
        readonly mimeType: string,
        readonly location: string,
        readonly flags: number,
        readonly createdAt: Date,
        readonly updatedAt: Date
    ) {
    }

    static async getCollection(connection: Db) {
        const collection = connection.collection('documents');
        await collection.createIndex({_id: 1, size: 1, mimeType: 1, createdAt: 1, updatedAt: 1});

        return collection;
    }

    static async create(model: DocumentCreate) {
        Core.Logger.log('Document', `Creating document with payload ${JSON.stringify(model)}`);
        const connection = await databaseConnection();

        try {
            const collection = await Document.getCollection(connection);
            const timestamp = new Date();

            const result = await collection.insertOne({
                name: model.name,
                size: model.size,
                mimeType: model.mimeType,
                location: model.location,
                flags: model.flags,
                createdAt: timestamp,
                updatedAt: timestamp,
            });

            return new Document(
                result.insertedId.toHexString(),
                model.name,
                model.size,
                model.mimeType,
                model.location,
                model.flags,
                timestamp,
                timestamp
            );
        } catch (error) {
            if (error instanceof Error) {
                Core.Logger.error('Document', error.message);
            }


            throw error;
        }

    }

    static async update(id: string, model: DocumentUpdate) {
        Core.Logger.log('Document', `Updating document ${id}`);
        const connection = await databaseConnection();

        const collection = await Document.getCollection(connection);
        const timestamp = new Date();

        const result = await collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: model.name,
                    size: model.size,
                    mimeType: model.mimeType,
                    location: model.location,
                    flags: model.flags,
                    updatedAt: timestamp,
                },
            }
        );

        if (result.modifiedCount === 0) {
            throw new Error('File not found');
        }

        const file = await collection.findOne({
            _id: new ObjectId(id),
        });

        if (!file) {
            throw new Error('File not found');
        }

        return new Document(
            id,
            file.name,
            file.size,
            file.mimeType,
            file.location,
            file.flags,
            file.createdAt,
            file.updatedAt
        );
    }

    static async delete(id: string) {
        Core.Logger.log('Document', `Deleting document ${id}`);
        const connection = await databaseConnection();

        const collection = await Document.getCollection(connection);

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            throw new Error('File not found');
        }
    }

    static async findOne(query: DocumentQuery) {
        Core.Logger.log('Document', `Finding document with query ${JSON.stringify(query)}`);
        const connection = await databaseConnection();

        const collection = await Document.getCollection(connection);

        const file = await collection.findOne(Core.Utils.partial({
            _id: query.id && new ObjectId(query.id),
            name: query.name,
            mimeType: query.mimeType,
            location: query.location,
            flags: query.flags,
        }))

        if (!file) {
            throw new Error('File not found');
        }

        return new Document(
            file._id.toHexString(),
            file.name,
            file.size,
            file.mimeType,
            file.location,
            file.flags,
            file.createdAt,
            file.updatedAt
        );
    }

    static async findMany(query: DocumentListQuery): Promise<[Document[], number]> {
        Core.Logger.log('Document', `Finding documents with query ${JSON.stringify(query)}`);
        const connection = await databaseConnection();

        const collection = await Document.getCollection(connection);
        const aggregation = [];

        if (query.orderBy) {
            const [field, order] = query.orderBy.split('_');

            aggregation.push({
                $sort: {
                    [field]: order === 'desc' ? -1 : 1,
                },
            });
        }

        if (query.ids) {
            aggregation.push({
                $match: {
                    _id: {
                        $in: query.ids.map(id => new ObjectId(id)),
                    },
                },
            });
        } else if (query.id) {
            aggregation.push({
                $match: {
                    _id: new ObjectId(query.id),
                },
            });
        }

        if (query.name) {
            aggregation.push({
                $match: {
                    name: query.name,
                },
            });
        }

        if (query.mimeType) {
            aggregation.push({
                $match: {
                    mimeType: query.mimeType,
                },
            });
        }

        if (query.location) {
            aggregation.push({
                $match: {
                    location: query.location,
                },
            });
        }

        if (query.flags) {
            aggregation.push({
                $match: {
                    flags: query.flags,
                },
            });
        }

        aggregation.push({
            $group: {
                _id: null,
                count: {$sum: 1},
                rows: {$push: '$$ROOT'}
            }
        });

        const [result] = await collection.aggregate(aggregation).skip(query.offset).limit(query.limit).toArray();

        return [
            result.rows.map((file: any) => new Document(
                file._id.toHexString(),
                file.name,
                file.size,
                file.mimeType,
                file.location,
                file.flags,
                file.createdAt,
                file.updatedAt
            )),
            result.count,
        ];
    }
}
