export const contractProjection = {
    _id: 1,
    ownerId: 1,
    name: 1,
    description: 1,
    status: 1,
    deployed: 1,
    blockchain: 1,
    contractType: 1,
    contractAddress: 1,
    transactionHash: 1,
    abi: 1,
    version: 1,
    createdOn: 1,
    updatedOn: 1,
};

export const contractConnectorDetailsProjection = {
    _id: 1,
    blockchain: 1,
    contractAddress: 1,
    abi: 1,
    keys: 1,
};
