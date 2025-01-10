import { Organization } from '../models/organization';

/**
 * Groups organizations based on the first word of their name and manages database records.
 * @param orgList - List of organization names to process.
 */
export const groupOrganizationsFromInput = async (orgList: string[]): Promise<void> => {
    try {
        for (const orgName of orgList) {
            const lowerOrgName = orgName.toLowerCase().trim();

            // Try to find an existing organization containing the new entry
            let matchedOrg = await Organization.findOne({
                $or: [
                    { mainOrgName: { $regex: new RegExp(lowerOrgName, 'i') } },  // Match existing main name
                    { aliases: { $regex: new RegExp(lowerOrgName, 'i') } }       // Match existing alias
                ],
            });

            if (matchedOrg) {
                // Prevent duplication of aliases
                if (!matchedOrg.aliases.includes(orgName)) {
                    matchedOrg.aliases.push(orgName);
                    await matchedOrg.save();
                    console.log(`Added alias '${orgName}' to '${matchedOrg.mainOrgName}'.`);
                }
            } else {
                // Find if the mainOrgName can be grouped under an existing entry
                const similarOrg = await Organization.findOne({
                    mainOrgName: { $regex: new RegExp(`^${lowerOrgName.split(' ')[0]}`, 'i') }
                });

                if (similarOrg && !similarOrg.aliases.includes(orgName)) {
                    similarOrg.aliases.push(orgName);
                    await similarOrg.save();
                    console.log(`Added alias '${orgName}' to '${similarOrg.mainOrgName}'.`);
                } else {
                    // If no matches, create a new organization
                    await Organization.create({ mainOrgName: lowerOrgName, aliases: [orgName] });
                    console.log(`Created new organization '${lowerOrgName}' with alias '${orgName}'.`);
                }
            }
        }
    } catch (error) {
        console.error('Error processing organizations:', error);
    }
};

export default {
    groupOrganizationsFromInput
};