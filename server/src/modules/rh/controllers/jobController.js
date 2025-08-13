import Job from "../models/jobModel.js";
import Candidate from "../models/candidateModel.js";

export const search = async (req, res) => {
  try {
    const { location, query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (location) filter.location = new RegExp(location, "i");
    if (query) filter.title = new RegExp(query, "i");

    const jobs = await Job.find(filter, {
      title: 1,
      location: 1,
      salary: 1,
      tags: 1,
      updatedAt: 1,
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      jobs,
      currentPage: page,
      totalPages,
      totalJobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobDetails = async (req, res) => {
  try {
    const job = await Job.findOne(
      { _id: req.params.jobId, isActive: true },
      {
        title: 1,
        description: 1,
        location: 1,
        quantity: 1,
        salary: 1,
        period: 1,
        tags: 1,
        updatedAt: 1,
      }
    ).lean();

    if (!job) {
      return res
        .status(404)
        .json({ message: "Vaga não encontrada ou inativa" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const apply = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const candidateData = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Vaga não disponível" });
    }

    const existingCandidate = await Candidate.findOne({
      email: candidateData.email,
    });

    if (existingCandidate) {
      const alreadyApplied = job.candidates.some((c) =>
        c.candidate.equals(existingCandidate._id)
      );

      if (alreadyApplied) {
        return res
          .status(400)
          .json({ message: "Você já se candidatou a esta vaga" });
      }
    }

    let candidate;
    if (existingCandidate) {
      candidate = existingCandidate;
    } else {
      candidate = new Candidate({
        ...candidateData,
        apliedIn: {
          job: jobId,
          date: new Date(),
        },
      });
      await candidate.save();
    }

    job.candidates.push({
      candidate: candidate._id,
      recruitmentStage: job.recruitment[0] || "Triagem inicial",
      status: "pendente",
      apliedAt: new Date(),
    });

    await job.save();

    res.status(201).json({
      message: "Candidatura realizada com sucesso",
      candidateId: candidate._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;

    const jobs = await Job.find({ isActive: activeFilter })
      .select("-candidates")
      .sort({ createdAt: -1 })
      .lean();

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("candidates.candidate")
      .lean();

    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId).lean();
    if (!candidate) {
      return res.status(404).json({ message: "Candidato nao encontrado" });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const disableJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    res.json({ message: "Vaga desativada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enableJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    res.json({ message: "Vaga ativada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { candidateId, jobId } = req.params;
    const { ...updateData } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    const candidateIndex = job.candidates.findIndex((c) =>
      c.candidate.equals(candidateId)
    );

    if (candidateIndex === -1) {
      return res
        .status(404)
        .json({ message: "Candidato não encontrado nesta vaga" });
    }

    job.candidates[candidateIndex] = {
      ...job.candidates[candidateIndex].toObject(),
      ...updateData,
      updatedAt: new Date(),
    };

    await job.save();
    res.json({ message: "Candidatura atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    res.json({ message: "Vaga excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
