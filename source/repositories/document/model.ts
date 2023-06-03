import { type Collection, type Db, ObjectId } from "mongodb";
import { databaseConnection } from "repositories/connection.js";
import { type DocumentCreate, type DocumentListQuery, type DocumentQuery, type DocumentUpdate } from "./types.js";
import { Core } from "~core/namespace.js";
import { Repository } from "~repositories/base.js";
import { Decorators } from "~core/decorators.js";

export class Document extends Repository {
	static Readonly = 0x1;
	static StorageTelegram = 0x2;
	static StorageAzure = 0x4;

	constructor(readonly id: string, readonly name: string, readonly size: number, readonly mimeType: string, readonly location: string, readonly flags: number, readonly createdAt: Date, readonly updatedAt: Date) {
		super();
	}

	static async getCollection(connection: Db): Promise<Collection> {
		const collection = connection.collection("documents");
		await collection.createIndex({ _id: 1, size: 1, mimeType: 1, createdAt: 1, updatedAt: 1 });

		return collection;
	}

	@Decorators.Logger("Creating document")
	static async create(model: DocumentCreate): Promise<Document | never> {
		const connection = await databaseConnection();

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

		return new Document(result.insertedId.toHexString(), model.name, model.size, model.mimeType, model.location, model.flags, timestamp, timestamp);
	}

	@Decorators.Logger("Updating document")
	static async update(id: string, model: DocumentUpdate): Promise<Document | never> {
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
			throw new Error("File not found");
		}

		const file = await collection.findOne({
			_id: new ObjectId(id),
		});

		if (file == null) {
			throw new Error("File not found");
		}

		return new Document(id, file.name, file.size, file.mimeType, file.location, file.flags, file.createdAt, file.updatedAt);
	}

	@Decorators.Logger("Deleting document")
	static async delete(id: string): Promise<void | never> {
		const connection = await databaseConnection();

		const collection = await Document.getCollection(connection);

		const result = await collection.deleteOne({
			_id: new ObjectId(id),
		});

		if (result.deletedCount === 0) {
			throw new Error("File not found");
		}
	}

	@Decorators.Logger("Finding document")
	static async findOne(query: DocumentQuery): Promise<Document | never> {
		const connection = await databaseConnection();

		const collection = await Document.getCollection(connection);

		const file = await collection.findOne(
			Core.Utils.partial({
				_id: query.id && new ObjectId(query.id),
				name: query.name,
				mimeType: query.mimeType,
				location: query.location,
				flags: query.flags,
			})
		);

		if (file === null) {
			throw new Error("File not found");
		}

		return new Document(file._id.toHexString(), file.name, file.size, file.mimeType, file.location, file.flags, file.createdAt, file.updatedAt);
	}

	@Decorators.Logger("Finding documents")
	static async findMany(query: DocumentListQuery): Promise<[Document[], number]> {
		const connection = await databaseConnection();

		const collection = await Document.getCollection(connection);
		const aggregation = [];

		if (this.isString(query.orderBy)) {
			const [field, order] = query.orderBy.split("_");

			aggregation.push({
				$sort: {
					[field]: order === "desc" ? -1 : 1,
				},
			});
		}

		if (this.isArray(query.ids)) {
			aggregation.push({
				$match: {
					_id: {
						$in: query.ids.map((id) => new ObjectId(id)),
					},
				},
			});
		} else if (this.isString(query.id)) {
			aggregation.push({
				$match: {
					_id: new ObjectId(query.id),
				},
			});
		}

		if (this.isString(query.name)) {
			aggregation.push({
				$match: {
					name: query.name,
				},
			});
		}

		if (this.isString(query.mimeType)) {
			aggregation.push({
				$match: {
					mimeType: query.mimeType,
				},
			});
		}

		if (this.isString(query.location)) {
			aggregation.push({
				$match: {
					location: query.location,
				},
			});
		}

		if (this.isNumber(query.flags)) {
			aggregation.push({
				$match: {
					flags: query.flags,
				},
			});
		}

		aggregation.push({
			$group: {
				_id: null,
				count: { $sum: 1 },
				rows: { $push: "$$ROOT" },
			},
		});

		const [result] = await collection.aggregate(aggregation).skip(query.offset).limit(query.limit).toArray();

		return [result.rows.map((file: any) => new Document(file._id.toHexString(), file.name, file.size, file.mimeType, file.location, file.flags, file.createdAt, file.updatedAt)), result.count];
	}
}
