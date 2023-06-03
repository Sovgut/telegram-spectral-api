export interface ChannelEntity {
	id: bigInt.BigInteger;
	username: string | null;
	title: string;
}

export interface Peer {
	channelId: bigInt.BigInteger | undefined;
}
