import Location from "../models/locationModel.js";

export const getAll = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;
    const locations = await Location.find({ isActive: activeFilter }).sort({
      name: 1,
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationId);
    if (!location)
      return res.status(404).json({ message: "Localização não encontrada" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.locationId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedLocation)
      return res.status(404).json({ message: "Localização não encontrada" });
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.locationId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!location)
      return res.status(404).json({ message: "Localização não encontrada" });
    res.json({ message: "Localização desativada", location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.locationId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );
    if (!location)
      return res.status(404).json({ message: "Localização não encontrada" });
    res.json({ message: "Localização ativada", location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.locationId);
    if (!deleted)
      return res.status(404).json({ message: "Localização não encontrada" });
    res.json({ message: "Localização excluída" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
