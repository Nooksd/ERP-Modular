// controllers/holidayController.js
import Holiday from "../models/holidayModel.js";

export const getAll = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;
    const holidays = await Holiday.find({ isActive: activeFilter }).sort({
      date: 1,
    });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.holidayId);
    if (!holiday)
      return res.status(404).json({ message: "Feriado não encontrado" });
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const newHoliday = new Holiday(req.body);
    await newHoliday.save();
    res.status(201).json(newHoliday);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updatedHoliday = await Holiday.findByIdAndUpdate(
      req.params.holidayId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedHoliday)
      return res.status(404).json({ message: "Feriado não encontrado" });
    res.json(updatedHoliday);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.holidayId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!holiday)
      return res.status(404).json({ message: "Feriado não encontrado" });
    res.json({ message: "Feriado desativado", holiday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.holidayId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );
    if (!holiday)
      return res.status(404).json({ message: "Feriado não encontrado" });
    res.json({ message: "Feriado ativado", holiday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const deleted = await Holiday.findByIdAndDelete(req.params.holidayId);
    if (!deleted)
      return res.status(404).json({ message: "Feriado não encontrado" });
    res.json({ message: "Feriado excluído" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcionalidades adicionais para feriados
export const getByDateRange = async (req, res) => {
  try {
    const { start, end, location, type } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Intervalo de datas é obrigatório" });
    }

    const filters = {
      date: { $gte: new Date(start), $lte: new Date(end) },
      isActive: true,
    };

    if (location) filters.locations = location;
    if (type) filters.type = type;

    const holidays = await Holiday.find(filters).sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkHoliday = async (req, res) => {
  try {
    const { date, location, department, state } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Data é obrigatória" });
    }

    const targetDate = new Date(date);
    const holiday = await Holiday.isHoliday(
      targetDate,
      location,
      department,
      state
    );

    res.json({
      isHoliday: !!holiday,
      holiday: holiday || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
