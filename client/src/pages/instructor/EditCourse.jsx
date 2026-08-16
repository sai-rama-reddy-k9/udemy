import { useEffect, useState } from "react";
import { getCourseById, editCourse } from "../../api/course.api";
import { useNavigate, useParams } from "react-router-dom";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const helper = async () => {
      const response = await getCourseById(id);
      console.log(response.data.course);
      setTitle(response.data.course.title);
      setDescription(response.data.course.description);
      setCategory(response.data.course.category);
      setPrice(response.data.course.price);
      setThumbnail(response.data.course.thumbnail);
      setIsPublished(response.data.course.isPublished);
    };
    helper();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await editCourse(id, {
      title,
      description,
      category,
      price,
      thumbnail,
      isPublished,
    });
    navigate("/instructor-dashboard");
  };
  const handlePublish = (e) => {
    e.preventDefault();
    setIsPublished((prev) => !prev);
  };

  const handleCancle = () => {
    navigate("/instructor-dashboard");
  };
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Course</h1>

        <p className="text-gray-500 mb-8">Update your course details below.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="Enter course category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter course price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL
            </label>

            <input
              type="text"
              name="thumbnail"
              placeholder="Enter thumbnail URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPublished"
              className="w-4 h-4"
              checked={isPublished}
              onChange={handlePublish}
            />

            <label className="text-sm font-medium text-gray-700">
              Publish this course
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Update Course
            </button>

            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              onClick={handleCancle}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
