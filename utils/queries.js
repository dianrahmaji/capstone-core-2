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
    },
  },
];

export const populateTeams = async (query) => {
  // FIXME: this is necessary
  const customAggregations = aggregations(query).map((aggregation) =>
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
  const customAggregations = aggregations(query).map((aggregation) =>
    aggregation.hasOwnProperty("$addFields")
      ? {
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
      : aggregation.hasOwnProperty("$project")
      ? {
          $project: {
            ...aggregation.$project,
            isAdmin: 1,
          },
        }
      : aggregation,
  );

  const teams = await Team.aggregate(customAggregations);

  return teams;
};
