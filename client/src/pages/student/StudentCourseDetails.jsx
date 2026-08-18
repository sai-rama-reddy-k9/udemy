import { getCourseById } from "../../api/course.api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { EnrollCourse, GetMyEnrollments } from "../../api/enrollment.api";

const StudentCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [instructor, setInstructor] = useState("");
  const [created, setCreated] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      const response = await getCourseById(id);

      setTitle(response.data.course.title);
      setDescription(response.data.course.description);
      setCategory(response.data.course.category);
      setPrice(response.data.course.price);
      setThumbnail(response.data.course.thumbnail);
      setInstructor(response.data.course.instructor.name);
      setCreated(response.data.course.createdAt);
    };

    const checkEnrollment = async () => {
      try {
        const response = await GetMyEnrollments();

        const alreadyEnrolled = response.data.enrollments.some((enrollment) => {
          const courseId =
            enrollment?.course?._id ??
            enrollment?.course ??
            enrollment?.courseId;
          return String(courseId) === String(id);
        });

        setIsEnrolled(alreadyEnrolled);
      } catch (error) {
        console.log(error);
      }
    };

    getCourse();
    checkEnrollment();
  }, [id]);

  const handleEnroll = async (id) => {
    if (isEnrolled) {
      navigate(`/student/learn/${id}`);
      return;
    }

    try {
      await EnrollCourse(id);
      navigate("/my-enrollments");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Course Image */}
        <div className="w-full h-64 bg-gray-200">
          <img
            src={thumbnail || "https://via.placeholder.com/1200x400"}
            alt="Course"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Details */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {title ? title : "Course Title"}
          </h1>
          <p className="text-gray-600 mb-6">
            {description
              ? description
              : "This is the course description. Here you can provide information about what students will learn from this course."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-gray-800">
                {category ? category : "Category"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold text-gray-800">
                ₹{price ? price : "Price"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="font-semibold text-gray-800">
                {instructor || "Instructor Name"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-semibold text-gray-800">
                {created || "01 Jan 2000"}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isEnrolled
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={() => handleEnroll(id)}
            >
              {isEnrolled ? "Continue Learning" : "Enroll Course"}
            </button>

            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
              onClick={() => navigate("/student-dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetails;
