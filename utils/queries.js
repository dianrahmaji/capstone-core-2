import Team from "../models/teamModel.js";

export const populateTeams = async (query) => {
  const teams = await Team.aggregate([
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
        createdAt: 1,
        updatedAt: 1,
        repository: 1,
        administrators: 1,
        "members._id": 1,
        "members.email": 1,
        "members.fullName": 1,
        "members.faculty": 1,
        "members.accountType": 1,
        "members.isAdmin": 1,
      },
    },
  ]);

  return teams;
};
