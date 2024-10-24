import Document from "../models/documentSchema.js";
import mongoose from "mongoose";
export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDocument = async (req, res) => {
    const [driverId, name, type, url] = req.body;

    if (!driverId || !name || !type || !url) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    const newDocument = new Document({
        driver: driverId,
        name,
        type,
        url,
    });

    try {
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const document = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No document with id: ${id}`);
    const updatedDocument = await Document.findByIdAndUpdate(
        id,
        { ...document, id },
        { new: true }
    );
    res.json(updatedDocument);
};

export const deleteDocument = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No document with id: ${id}`);
    await Document.findByIdAndRemove(id);
    res.json({ message: "Document deleted successfully" });
};

export const getDocumentsByDriver = async (req, res) => {
    try {
        const documents = await Document.find({ driver: req.params.driverId });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDocumentsByType = async (req, res) => {
    try {
        const documents = await Document.find({ type: req.params.type });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
