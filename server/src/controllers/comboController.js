import Combo from "../models/Combo.js";

// Create a new combo
export const createCombo = async (req, res) => {
  try {
    const combo = new Combo(req.body);
    await combo.save();
    res.status(201).json(combo);
  } catch (error) {
    res.status(400).json({ error: "Failed to create combo" });
  }
};

// Update an existing combo
export const updateCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!combo) {
      return res.status(404).json({ error: "Combo not found" });
    }
    res.json(combo);
  } catch (error) {
    res.status(400).json({ error: "Failed to update combo" });
  }
};

// Delete a combo
export const deleteCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo) {
      return res.status(404).json({ error: "Combo not found" });
    }
    res.json({ message: "Combo deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete combo" });
  }
};

// Get all combos
export const getCombos = async (req, res) => {
  try {
    const combos = await Combo.find();
    res.json(combos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch combos" });
  }
};
