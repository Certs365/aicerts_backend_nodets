import { Request, Response } from 'express';
import { BadgeTemplate } from "../config/schema";

/**
 * API to get all certificate/credential templates.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getBadgeTemplates = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        // Find all templates associated with the provided email
        const templates = await BadgeTemplate.find({ email });

        // If no templates are found, return an appropriate response
        if (!templates || templates.length === 0) {
            return res.status(404).json({
                status: "FAILED",
                message: "No templates found for the provided email.",
            });
        }

        // Return the found templates
        res.json({
            status: "SUCCESS",
            message: "Templates fetched successfully.",
            data: templates,
        });

    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Error fetching templates.',
        });
    }
};

/**
 * API to get a certificate/credential template by ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */

const getBadgeTemplateById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // Find the template by its ID
        const template = await BadgeTemplate.findById(id);

        // If the template is not found, return an appropriate response
        if (!template) {
            return res.status(404).json({
                status: "FAILED",
                message: "Template not found for the provided ID.",
            });
        }

        // Return the found template
        res.json({
            status: "SUCCESS",
            message: "Template fetched successfully.",
            data: template,
        });

    } catch (error) {
        console.error("Error fetching template by ID:", error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Error fetching template by ID.',
        });
    }
};

/**
 * API to update certificate/credential template.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const updateBadgeTemplate = async (req: Request, res: Response): Promise<void> => {
    const { id, url, designFields, dimensions, title, subTitle, description, attributes } = req.body;

    try {
        // Find the template by its ID
        const template = await BadgeTemplate.findById(id);

        if (!template) {
            return res.status(404).json({
                status: "FAILED",
                message: "Template not found.",
            });
        }

        // Update the template fields
        template.url = url || template.url;
        template.designFields = designFields || template.designFields;
        template.dimensions = dimensions || template.dimensions; // Fixed typo from 'dimentions' to 'dimensions'
        template.title = title || template.title;
        template.subTitle = subTitle || template.subTitle;
        template.description = description || template.description;
        template.attributes = attributes || template.attributes;

        // Save the updated template
        const updatedTemplate = await template.save();

        // Respond with the updated template
        res.json({
            status: "SUCCESS",
            message: "Template updated successfully.",
            data: updatedTemplate,
        });

    } catch (error) {
        console.error("Error updating template:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error updating template.",
        });
    }
};

/**
 * API to delete certificate/credential templates by email.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const deleteBadgeTemplates = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        // Find and delete templates associated with the provided email
        const result = await BadgeTemplate.deleteMany({ email });

        // If no templates are found and deleted, return an appropriate response
        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "FAILED",
                message: "No templates found for the provided email.",
            });
        }

        // Return success response after deleting
        res.json({
            status: "SUCCESS",
            message: `${result.deletedCount} template(s) deleted successfully.`,
        });

    } catch (error) {
        console.error("Error deleting templates:", error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Error deleting templates.',
        });
    }
};

/**
 * API to delete a certificate/credential template by certificateId.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const deleteBadgeTemplateById = async (req: Request, res: Response): Promise<void> => {
    const { certificateId } = req.body;

    if (!certificateId) {
        return res.status(400).json({ status: "FAILED", message: "certificateId is required." });
    }

    try {
        // Find and delete the template by certificateId
        const result = await BadgeTemplate.findByIdAndDelete(certificateId);

        // If no template is found, return an appropriate response
        if (!result) {
            return res.status(404).json({
                status: "FAILED",
                message: "No template found for the provided certificateId.",
            });
        }

        // Return success response after deleting
        res.json({
            status: "SUCCESS",
            message: "Template deleted successfully.",
        });

    } catch (error) {
        console.error("Error deleting template:", error);
        res.status(500).json({
            status: 'FAILED',
            message: 'Error deleting template.',
        });
    }
};

export {
    getBadgeTemplates,
    getBadgeTemplateById,
    updateBadgeTemplate,
    deleteBadgeTemplates,
    deleteBadgeTemplateById,
};
