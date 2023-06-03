import { ObjectId, type Collection, type Db } from "mongodb";
import { Decorators } from "~core/decorators.js";
import { Repository } from "~repositories/base.js";
import { databaseConnection } from "~repositories/connection.js";
import { ChannelListQuery, ChannelQuery } from "./types.js";
import { Core } from "~core/namespace.js";

export class Channel extends Repository {
	constructor(private readonly id: string, private readonly title: string, private readonly reference: string, private readonly createdAt: Date) {
		super();
	}

	static async getCollection(connection: Db): Promise<Collection> {
		const collection = connection.collection("channels");
		await collection.createIndex({ _id: 1, title: 1, createdAt: 1 });

		return collection;
	}

	@Decorators.Logger("Creating channel")
	static async create(title: string, reference: string): Promise<Channel> {
		const connection = await databaseConnection();
		const collection = await Channel.getCollection(connection);
		const createdAt = new Date();

		const { insertedId } = await collection.insertOne({
			title,
			reference,
			createdAt,
		});

		return new Channel(insertedId.toHexString(), title, reference, createdAt);
	}

	@Decorators.Logger("Deleting channel")
	static async delete(reference: string): Promise<void> {
		const connection = await databaseConnection();
		const collection = await Channel.getCollection(connection);

		await collection.deleteOne({ reference });
	}

	@Decorators.Logger("Finding channel")
	static async findOne(query: ChannelQuery): Promise<Channel | never> {
		const connection = await databaseConnection();

		const collection = await Channel.getCollection(connection);

		const channel = await collection.findOne(
			Core.Utils.partial({
				_id: query.id && new ObjectId(query.id),
				title: query.title,
				reference: query.reference,
			})
		);

		if (channel === null) {
			throw new Error("File not found");
		}

		return new Channel(channel._id.toHexString(), channel.title, channel.reference, channel.createdAt);
	}

	@Decorators.Logger("Finding channels")
	static async findMany(query: ChannelListQuery): Promise<[Channel[], number]> {
		const connection = await databaseConnection();

		const collection = await Channel.getCollection(connection);
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

		if (this.isString(query.title)) {
			aggregation.push({
				$match: {
					title: query.title,
				},
			});
		}

		if (this.isString(query.reference)) {
			aggregation.push({
				$match: {
					reference: query.reference,
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

		return [result.rows.map((channel: any) => new Channel(channel._id.toHexString(), channel.title, channel.reference, channel.createdAt)), result.count];
	}
}
