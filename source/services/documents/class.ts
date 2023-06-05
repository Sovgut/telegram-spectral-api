import { Decorators } from "~core/decorators.js";
import { NotFoundError } from "~core/errors/not-found.js";
import { Document, type IDocument } from "~database/models/document.js";
import { type IMongooseMeta } from "~types/entities.js";

export class DocumentService {
	private readonly model = Document;

	@Decorators.Logger("Creating document")
	public async create(data: IDocument): Promise<(IDocument & IMongooseMeta) | never> {
		const document = await this.model.create({
			channel: data.channel,
			groupId: data.groupId,
			name: data.name,
			size: data.size,
			mimeType: data.mimeType,
			location: data.location,
			flags: data.flags,
		});

		return document.toObject();
	}

	@Decorators.Logger("Getting document")
	public async read(id: string): Promise<(IDocument & IMongooseMeta) | never> {
		const document = await this.model.findById(id);

		if (document === null) {
			throw new NotFoundError(`Document with id ${id} not found`, "document_not_found");
		}

		return document.toObject();
	}

	@Decorators.Logger("Getting documents")
	public async list(): Promise<Array<IDocument & IMongooseMeta>> {
		const documents = await this.model.find();

		return documents.map((document) => document.toObject());
	}

	@Decorators.Logger("Updating document")
	public async update(id: string, data: IDocument): Promise<(IDocument & IMongooseMeta) | never> {
		const document = await this.model.findByIdAndUpdate(
			id,
			{
				channel: data.channel,
				groupId: data.groupId,
				name: data.name,
				size: data.size,
				mimeType: data.mimeType,
				location: data.location,
				flags: data.flags,
			},
			{
				new: true,
			}
		);

		if (document === null) {
			throw new NotFoundError(`Document with id ${id} not found`, "document_not_found");
		}

		return document.toObject();
	}

	@Decorators.Logger("Deleting document")
	public async delete(id: string): Promise<void | never> {
		const response = await this.model.deleteOne({ _id: id });

		if (response.deletedCount === 0) {
			throw new NotFoundError(`Document with id ${id} not found`, "document_not_found");
		}
	}
}
