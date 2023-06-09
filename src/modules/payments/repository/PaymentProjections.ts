import { userProjection } from '@/modules/users/repository/UserProjections';
import { MongoDict } from '@/config/databases/types';
import { transactionProjection } from '@/modules/payments/repository/TransactionProjections';

export const paymentProjection = {
    _id: 1,
    ownerId: 1,
    status: 1,
    failReason: 1,
    paymentProvider: 1,
    value: 1,
    transactionIds: 1,
    item: 1,
    timestamp: 1,
    owner: 1,
    transactions: 1,
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
            preserveNullAndEmptyArrays: true,
        },
    },
];

const transactionsProjection = [
    {
        $lookup: {
            from: 'transactions',
            localField: 'transactionIds',
            foreignField: '_id',
            pipeline: [
                {
                    $project: transactionProjection,
                },
            ],
            as: 'transactions',
        },
    },
];

const basePaymentProjection = [
    {
        $project: paymentProjection,
    },
];

export function paymentProjectionFactory(includeOwner = true, includeTransactions = true): Array<MongoDict> {
    const query = [];

    if (includeOwner) {
        query.push(...ownerIdProjection);
    }
    if (includeTransactions) {
        query.push(...transactionsProjection);
    }
    query.push(...basePaymentProjection);
    return query;
}
