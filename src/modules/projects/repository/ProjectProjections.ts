import { userProjection } from '@/modules/users/repository/UserProjections';
import { contractProjection } from '@/modules/contracts/repository/ContractProjections';
import { MongoDict } from '@/config/databases/types';

export const projectProjection = {
    _id: 1,
    image: 1,
    title: 1,
    description: 1,
    fundGoal: 1,
    startDate: 1,
    endDate: 1,
    categoryIds: 1,
    published: 1,
    status: 1,
    contributorIds: 1,
    created: 1,
    modified: 1,
    ownerId: 1,
    owner: 1,
    contributors: 1,
    categories: 1,
    contractId: 1,
    contract: 1,
};

const ownerIdProjection = [
    {
        $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            pipeline: [
                {
                    $project: userProjection,
                },
            ],
            as: 'owner',
        },
    },
    {
        $unwind: {
            path: '$owner',
        },
    },
];

const contributorsProjection = [
    {
        $lookup: {
            from: 'users',
            localField: 'contributorIds',
            foreignField: '_id',
            pipeline: [
                {
                    $project: userProjection,
                },
            ],
            as: 'contributors',
        },
    },
];

const contractIdProjection = [
    {
        $lookup: {
            from: 'contracts',
            localField: 'contractId',
            foreignField: '_id',
            pipeline: [
                {
                    $project: contractProjection,
                },
            ],
            as: 'contract',
        },
    },
    {
        $unwind: {
            path: '$contract',
        },
    },
];

const baseProjectProjection = [
    {
        $project: projectProjection,
    },
];

export function projectProjectionFactory(
    includeOwner = true,
    includeContributors = true,
    includeContract = false,
): Array<MongoDict> {
    const query = [];

    if (includeOwner) {
        query.push(...ownerIdProjection);
    }
    if (includeContributors) {
        query.push(...contributorsProjection);
    }
    if (includeContract) {
        query.push(...contractIdProjection);
    }
    query.push(...baseProjectProjection);
    return query;
}
