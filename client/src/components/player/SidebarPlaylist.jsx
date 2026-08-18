const SidebarPlaylist = ({
  sections,
  selectedLessonId,
  completedLessons,
  onSelectLesson,
}) => {
  return (
    <aside className="w-full lg:w-80 bg-white border-r border-gray-200 p-5 overflow-y-auto">
      <div className="mb-6 rounded-lg bg-gray-50 p-3 border border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <span className="font-semibold">Progress</span>
          <span>
            {completedLessons.length} /{" "}
            {sections.reduce(
              (acc, section) =>
                acc +
                (Array.isArray(section.lessons) ? section.lessons.length : 0),
              0,
            )}{" "}
            lessons
          </span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{
              width: `${
                sections.reduce(
                  (acc, section) =>
                    acc +
                    (Array.isArray(section.lessons)
                      ? section.lessons.length
                      : 0),
                  0,
                ) === 0
                  ? 0
                  : (completedLessons.length /
                      sections.reduce(
                        (acc, section) =>
                          acc +
                          (Array.isArray(section.lessons)
                            ? section.lessons.length
                            : 0),
                        0,
                      )) *
                    100
              }%`,
            }}
          />
        </div>
      </div>

      <h2 className="text-lg font-bold mb-5">Course Content</h2>

      {sections.length === 0 && (
        <div className="text-sm text-gray-500">
          This course does not have any sections yet.
        </div>
      )}

      {sections.map((section) => (
        <div key={section._id || section.title} className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            {section.title || "Untitled Section"}
          </h3>

          {Array.isArray(section.lessons) && section.lessons.length > 0 ? (
            <div className="space-y-1">
              {section.lessons.map((lesson) => {
                const completed = completedLessons.some(
                  (id) => String(id) === String(lesson._id),
                );

                return (
                  <button
                    key={lesson._id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg text-sm ${
                      String(selectedLessonId) === String(lesson._id)
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between gap-2">
                      <span className="truncate">
                        {lesson.title || "Untitled Lesson"}
                      </span>
                      {completed && (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No lessons in this section.</p>
          )}
        </div>
      ))}
    </aside>
  );
};

export default SidebarPlaylist;
