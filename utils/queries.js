/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
import Team from "../models/teamModel.js";

const aggregations = (query) => [
  { $match: query },
  {
    $lookup: {
      from: "repositories",
      foreignField: "_id",
      localField: "repository",
      as: "repository",
    },
  },
  { $unwind: "$repository" },
  {
    $lookup: {
      from: "users",
      let: { members: "$members" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$members"],
            },
          },
        },
        {
          $lookup: {
            from: "contributions",
            let: { author: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$author", "$$author"],
                  },
                },
              },
            ],
            as: "contributions",
          },
        },
      ],
      as: "members",
    },
  },
  {
    $addFields: {
      members: {
        $map: {
          input: "$members",
          as: "item",
          in: {
            $cond: [
              { $in: ["$$item._id", "$administrators"] },
              { $mergeObjects: ["$$item", { isAdmin: true }] },
              { $mergeObjects: ["$$item", { isAdmin: false }] },
            ],
          },
        },
      },
    },
  },
  {
    $addFields: {
      members: {
        $map: {
          input: "$members",
          as: "member",
          in: {
            $mergeObjects: [
              "$$member",
              {
                contributions: {
                  $filter: {
                    input: "$$member.contributions",
                    as: "contribution",
                    cond: {
                      $eq: ["$repository._id", "$$contribution.repository"],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $addFields: {
      members: {
        $map: {
          input: "$members",
          as: "member",
          in: {
            $mergeObjects: [
              "$$member",
              {
                contributions: {
                  $sum: "$$member.contributions.contribution",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      chat: 1,
      name: 1,
      status: 1,
      topics: 1,
      createdAt: 1,
      updatedAt: 1,
      repository: 1,
      description: 1,
      contributions: 1,
      review: 1,
      "members._id": 1,
      "members.email": 1,
      "members.fullName": 1,
      "members.faculty": 1,
      "members.accountType": 1,
      "members.isAdmin": 1,
      "members.contributions": 1,
    },
  },
];

const aggregationsSorted = (query) => [
  { $match: query },
  {
    $lookup: {
      from: "repositories",
      foreignField: "_id",
      localField: "repository",
      as: "repository",
    },
  },
  { $unwind: "$repository" },
  {
    $lookup: {
      from: "users",
      foreignField: "_id",
      localField: "members",
      as: "members",
    },
  },
  {
    $addFields: {
      members: {
        $map: {
          input: "$members",
          as: "item",
          in: {
            $cond: [
              { $in: ["$$item._id", "$administrators"] },
              { $mergeObjects: ["$$item", { isAdmin: true }] },
              { $mergeObjects: ["$$item", { isAdmin: false }] },
            ],
          },
        },
      },
      score: { $meta: "textScore" },
    },
  },
  {
    $addFields: {
      members: {
        $map: {
          input: "$members",
          as: "member",
          in: {
            $mergeObjects: [
              "$$member",
              {
                contributions: {
                  $filter: {
                    input: "$$member.contributions",
                    as: "contribution",
                    cond: {
                      $eq: ["$repository._id", "$$contribution.repository"],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $addFields: {
      members: {
        $map: {
          input: "$members",
          as: "member",
          in: {
            $mergeObjects: [
              "$$member",
              {
                contributions: {
                  $sum: "$$member.contributions.contribution",
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      chat: 1,
      name: 1,
      status: 1,
      topics: 1,
      createdAt: 1,
      updatedAt: 1,
      repository: 1,
      description: 1,
      "members._id": 1,
      "members.email": 1,
      "members.fullName": 1,
      "members.faculty": 1,
      "members.accountType": 1,
      "members.isAdmin": 1,
      "members.contributions": 1,
    },
  },
  { $sort: { score: { $meta: "textScore" } } },
];

export const populateTeams = async (query) => {
  // FIXME: this is necessary
  const customAggregations = aggregations(query).map((aggregation) =>
    aggregation.hasOwnProperty("$project")
      ? {
          $project: {
            ...aggregation.$project,
            administrators: 1,
            document: 1,
          },
        }
      : aggregation,
  );
  const teams = await Team.aggregate(customAggregations);

  return teams;
};

export const populateTeamsSorted = async (query) => {
  // FIXME: this is necessary
  const customAggregations = aggregationsSorted(query).map((aggregation) =>
    aggregation.hasOwnProperty("$project")
      ? {
          $project: {
            ...aggregation.$project,
            administrators: 1,
          },
        }
      : aggregation,
  );
  const teams = await Team.aggregate(customAggregations);

  return teams;
};

export const populateTeamsByUser = async (query, userId) => {
  const aggregationsWithQuery = aggregations(query);
  const aggregationsLength = aggregationsWithQuery.length;

  const aggregationsWithTotalContributions = [
    ...aggregationsWithQuery.slice(0, aggregationsLength - 1),
    {
      $lookup: {
        from: "contributions",
        let: {
          author: userId,
          repository: "$repository._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$author", "$$author"],
                  },
                  {
                    $eq: ["$repository", "$$repository"],
                  },
                ],
              },
            },
          },
        ],
        as: "contributions",
      },
    },
    {
      $addFields: {
        contributions: {
          $sum: "$contributions.contribution",
        },
      },
    },
    ...aggregationsWithQuery.slice(aggregationsLength - 1, aggregationsLength),
  ];
  const customAggregations = aggregationsWithTotalContributions.map(
    (aggregation) =>
      aggregation.hasOwnProperty("$addFields")
        ? aggregation.$addFields.hasOwnProperty("members")
          ? {
              ...aggregation,
              $addFields: {
                ...aggregation.$addFields,
                isAdmin: {
                  $cond: [
                    {
                      $in: [userId, "$administrators"],
                    },
                    true,
                    false,
                  ],
                },
              },
            }
          : aggregation
        : aggregation.hasOwnProperty("$project")
        ? {
            $project: {
              ...aggregation.$project,
              isAdmin: 1,
              contributions: 1,
              document: 1,
              review: 1,
            },
          }
        : aggregation,
  );

  const teams = await Team.aggregate(customAggregations);

  return teams;
};
