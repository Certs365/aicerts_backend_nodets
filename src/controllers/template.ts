import { Request, Response } from "express";
import { BadgeTemplate } from "../models/badgeTemplate";
import { User } from "../models/user";
import { retryOperation } from "../utils/retryOperation";
import { messageCode } from "../common/codes";

/**
 * API to get all certificate/credential templates by email.
 */
const getBadgeTemplates = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    console.log(email, "email")
    try {
        const templates = await BadgeTemplate.find({ email });

        if (!templates || templates.length === 0) {
            res.status(404).json({
                status: "FAILED",
                message: "No templates found for the provided email.",
            });
            return;
        }

        res.json({
            status: "SUCCESS",
            message: "Templates fetched successfully.",
            data: templates,
        });
    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error fetching templates.",
        });
    }
};

/**
 * API to get a certificate/credential template by ID.
 */
const getBadgeTemplateById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const template = await BadgeTemplate.findById(id);

        if (!template) {
            res.status(404).json({
                status: "FAILED",
                message: "Template not found for the provided ID.",
            });
            return;
        }

        res.json({
            status: "SUCCESS",
            message: "Template fetched successfully.",
            data: template,
        });
    } catch (error) {
        console.error("Error fetching template by ID:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error fetching template by ID.",
        });
    }
};

/**
 * API to update certificate/credential template.
 */
const updateBadgeTemplate = async (req: Request, res: Response): Promise<void> => {
    const { id, url, designFields, dimentions, title, subTitle, description, attributes } = req.body;

    try {
        const template = await BadgeTemplate.findById(id);

        if (!template) {
            res.status(404).json({
                status: "FAILED",
                message: "Template not found.",
            });
            return;
        }

        // Update fields
        if (url) template.url = url;
        if (designFields) template.designFields = designFields;
        if (dimentions) template.dimentions = dimentions;
        if (title) template.title = title;
        if (subTitle) template.subTitle = subTitle;
        if (description) template.description = description;
        if (attributes) template.attributes = attributes;

        const updatedTemplate = await template.save();

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
 */
const deleteBadgeTemplates = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const result = await BadgeTemplate.deleteMany({ email });

        if (result.deletedCount === 0) {
            res.status(404).json({
                status: "FAILED",
                message: "No templates found for the provided email.",
            });
            return;
        }

        res.json({
            status: "SUCCESS",
            message: `${result.deletedCount} template(s) deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting templates:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error deleting templates.",
        });
    }
};

/**
 * API to delete a certificate/credential template by ID.
 */
const deleteBadgeTemplateById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await BadgeTemplate.findByIdAndDelete(id);

        if (!result) {
            res.status(404).json({
                status: "FAILED",
                message: "No template found for the provided ID.",
            });
            return;
        }

        res.json({
            status: "SUCCESS",
            message: "Template deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting template:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error deleting template.",
        });
    }
};

/**
 * API to add a new certificate/credential template.
 */
const addBadgeTemplate = async (req: Request, res: Response): Promise<void> => {
    const { url, email, designFields, dimensions, title, subTitle, description, attributes } = req.body;

    try {
        const user = await User.findOne({ email, status: 1 });

        if (!user) {
            res.status(400).json({
                status: "FAILED",
                message: messageCode.msgInvalidIssuer,
            });
            return;
        }

        const templateDetails = new BadgeTemplate({
            email,
            url,
            designFields,
            dimensions,
            title,
            subTitle,
            description,
            attributes,
        });

        const savedTemplate = await retryOperation(() => templateDetails.save(), 3);

        res.json({
            status: "SUCCESS",
            message: messageCode.msgOperationSuccess,
            data: savedTemplate,
        });
    } catch (error) {
        console.error(messageCode.msgInternalError, error);
        res.status(500).json({
            status: "FAILED",
            message: messageCode.msgInternalError,
        });
    }
};



export {
    getBadgeTemplates,
    getBadgeTemplateById,
    updateBadgeTemplate,
    deleteBadgeTemplates,
    deleteBadgeTemplateById,
    addBadgeTemplate,
};
