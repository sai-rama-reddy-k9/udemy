const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in seconds
    order: { type: Number, required: true },
    isPreview: { type: Boolean, default: false },
  },

  { timestamps: true },
);

module.exports = mongoose.model("Lesson", lessonSchema);
