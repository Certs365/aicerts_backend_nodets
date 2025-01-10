import { Request, Response } from "express";
import { User } from "../models/user";
import { Organization } from "../models/organization";
import { Issues } from "../models/issues";
import { BatchIssues } from "../models/batchIssues";
import { DynamicIssues } from "../models/dynamicIssues";
import { DynamicBatchIssues } from "../models/dynamicBatchIssues";


import { messageCodes } from "../common/codes";

import { groupOrganizationsFromInput } from "../services/fetch.service";

const cloudBucket = '.png';

export const getOrgs = async (req: Request, res: Response): Promise<void> => {
    try {
        const organizations = await User.find({}, 'organization'); // Only select the 'organization' field
        if (!organizations) {
            res.status(200).json({ code: 200, status: "SUCCESS", message: messageCodes.msgNoMatchFound });
        }
        const _organizations = organizations.map(user => user.organization);
        // Use Set to filter unique values
        const uniqueResponses = [...new Set(_organizations)];
        // Sort the array in alphabetical order
        const sortedUniqueResponses = uniqueResponses.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        res.status(200).json({ code: 200, status: "SUCCESS", message: messageCodes.msgMatchFound, data: sortedUniqueResponses });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ code: 500, status: "FAILED", message: messageCodes.msgInternalError });
    }
};

export const getGroupedOrgs = async (req: Request, res: Response): Promise<void> => {
    try {
        const organizations = await Organization.find({}); // Only select the 'organization' field

        console.log("Reached");
        if (!organizations) {
            res.status(400).json({ code: 400, status: "FAILED", message: messageCodes.msgNoMatchFound });
        }
        // Extract and capitalize mainOrgName into a list
        const mainOrgNamesList = organizations.map(org =>
            org.mainOrgName.charAt(0).toUpperCase() + org.mainOrgName.slice(1)
        );

        res.status(200).json({ code: 200, status: "SUCCESS", message: messageCodes.msgMatchFound, data: mainOrgNamesList });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ code: 500, status: "FAILED", message: messageCodes.msgInternalError });
    }
};

export const setGroupedOrgs = async (req: Request, res: Response): Promise<void> => {
    const orgList = req.body.list;
    try {
        await groupOrganizationsFromInput(orgList);

        const organizations = await Organization.find({}); // Only select the 'organization' field
        if (!organizations) {
            res.status(400).json({ code: 400, status: "FAILED", message: messageCodes.msgNoMatchFound });
        }
        // Transform the response into the desired format
        const transformedResponse = organizations.reduce((acc, org) => {
            const capitalizedMainOrgName = org.mainOrgName.charAt(0).toUpperCase() + org.mainOrgName.slice(1);
            acc[capitalizedMainOrgName] = org.aliases;
            return acc;
        }, {} as Record<string, string[]>);

        res.status(200).json({ code: 200, status: "SUCCESS", message: messageCodes.msgMatchFound, details: transformedResponse });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ code: 500, status: "FAILED", message: messageCodes.msgInternalError });
    }
};

export const getOrgIssues = async (req: Request, res: Response): Promise<void> => {
    const orgName = req.body.organization;
    const targetName = req.body.name;
    var fetchedIssues;
    try {
        const organizations = await Organization.find({ mainOrgName : orgName }); // Only select the 'organization' field
        if (!organizations) {
            res.status(400).json({ code: 400, status: "FAILED", message: messageCodes.msgNoMatchFound });
        }

        // const organizationsToMatch = organizations.alias;
        // const getIssuers = await User.find({
        //     organization: {
        //       $in: organizationsToMatch.map(name => new RegExp(`^${name}$`, 'i'))
        //     }
        //   });

        if (getIssuers && getIssuers.length > 0) {
            // Extract issuerIds
            var getIssuerIds = getIssuers.map(item => item.issuerId);
          } else {
            res.status(400).json({ code: 400, status: "FAILED", message: messageCode.msgNoMatchFound });
          }
      
          for (let i = 0; i < getIssuerIds.length; i++) {
            const currentIssuerId = getIssuerIds[i];
      
            // Query 1
            var query1Promise = Issues.find({
              issuerId: currentIssuerId,
              $expr: {
                $and: [
                  { $eq: [{ $toLower: "$name" }, targetName.toLowerCase()] }
                ]
              },
              url: { $exists: true, $ne: null, $ne: "", $regex: cloudBucket } // Filter to include documents where `url` exists
            });
      
            // Query 2
            var query2Promise = BatchIssues.find({
              issuerId: currentIssuerId,
              $expr: {
                $and: [
                  { $eq: [{ $toLower: "$name" }, targetName.toLowerCase()] }
                ]
              },
              url: { $exists: true, $ne: null, $ne: "", $regex: cloudBucket } // Filter to include documents where `url` exists
            });
      
            // Query 3
            var query3Promise = DynamicBatchIssues.find({
              issuerId: currentIssuerId,
              $expr: {
                $and: [
                  { $eq: [{ $toLower: "$name" }, targetName.toLowerCase()] }
                ]
              },
              url: { $exists: true, $ne: null, $ne: "", $regex: cloudBucket } // Filter to include documents where `url` exists
            });
      
            // Query 4
            var query4Promise = DynamicIssues.find({
              issuerId: currentIssuerId,
              $expr: {
                $and: [
                  { $eq: [{ $toLower: "$name" }, targetName.toLowerCase()] }
                ]
              },
              url: { $exists: true, $ne: null, $ne: "", $regex: cloudBucket } // Filter to include documents where `url` exists
            });
      
            // Await both promises
            var [query1Result, query2Result, query3Result, query4Result] = await Promise.all([query1Promise, query2Promise, query3Promise, query4Promise]);
            // Check if results are non-empty and push to finalResults
            if (query1Result.length > 0) {
              // fetchedIssues.push(query1Result);
              fetchedIssues = fetchedIssues.concat(query1Result);
            }
            if (query2Result.length > 0) {
              // fetchedIssues.push(query2Result);
              fetchedIssues = fetchedIssues.concat(query2Result);
            }
            // Check if results are non-empty and push to finalResults
            if (query3Result.length > 0) {
              // fetchedIssues.push(query1Result);
              fetchedIssues = fetchedIssues.concat(query3Result);
            }
            if (query4Result.length > 0) {
              // fetchedIssues.push(query2Result);
              fetchedIssues = fetchedIssues.concat(query4Result);
            }
          }
      
          if (fetchedIssues.length == 0) {
            res.status(400).json({ code: 400, status: "FAILED", message: messageCode.msgNoMatchFound });
          }

        res.status(200).json({ code: 200, status: "SUCCESS", message: messageCodes.msgMatchFound, details: organizations });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ code: 500, status: "FAILED", message: messageCodes.msgInternalError });
    }
};

