const VideoPlayer = ({
  lesson,
  lessonDescription,
  videoUrl,
  isCompleted,
  onMarkComplete,
  onMarkIncomplete,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-black">
        {videoUrl ? (
          <video
            key={lesson?._id}
            src={videoUrl}
            controls
            className="w-full max-h-125 object-contain"
          />
        ) : (
          <div className="flex h-80 items-center justify-center text-gray-300 px-6 text-center">
            No video/content is available for this lesson yet.
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Lesson
            </p>
            <h2 className="text-2xl font-bold text-gray-800">
              {lesson?.title || "Untitled Lesson"}
            </h2>
          </div>

          {isCompleted && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Completed
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-6 whitespace-pre-line">
          {lessonDescription || "No lesson description is available."}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onPrevious}
            disabled={previousDisabled}
            className={`px-4 py-2 rounded-lg font-medium ${
              previousDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
          >
            Previous Lesson
          </button>

          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`px-4 py-2 rounded-lg font-medium ${
              nextDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next Lesson
          </button>

          {isCompleted ? (
            <button
              onClick={onMarkIncomplete}
              className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Mark Incomplete
            </button>
          ) : (
            <button
              onClick={onMarkComplete}
              className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
