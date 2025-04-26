import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import ReviewsList from './ReviewsList';
import './AdvisorProfile.css'
import { AdvisorProfileProps } from './types'


const AdvisorProfile: React.FC<AdvisorProfileProps> = ({
  advisor,
  currentUserId,
  isOwnProfile
}) => {
  const navigate = useNavigate()
  if (!advisor || !advisor._id) {
    return <div className="text-center py-8">No advisor selected</div>;
  }
  return (
    <div className="advisor-profile-container w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Profile Header with gradient background */}
      <div className="advisor-profile-header relative mb-4 sm:mb-8">
        <div className="bg-gradient-to-r from-green-300 to-green-800 rounded-t-lg h-24 sm:h-32 md:h-40"></div>
        <div className="flex flex-col sm:flex-row px-4 sm:px-6 -mt-12 sm:-mt-16">
          {/* Advisor Photo */}
          <div className="flex justify-center sm:justify-start sm:mr-6">
            <img
              src={advisor.profilePic || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'}
              alt={advisor.username}
              className="advisor-photo w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>

          {/* Advisor Details */}
          <div className="advisor-details mt-3 sm:mt-6 md:mt-10 flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{advisor.username}</h1>

            <div className="flex items-center justify-center sm:justify-start mt-1 sm:mt-2 text-gray-600">
              <FaBriefcase className="mr-2" />
              <p className="experience font-medium">
                {advisor.experience} years of experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 pb-6">
        {/* Left Column - Bio and Specialties */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          {/* <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaStar className="mr-2 text-green-600" />
              Specialties
            </h3>
            <div className="specialties-list flex flex-wrap gap-2">
              {advisor.specialties.map((specialty, index) => (
                <span 
                  key={index} 
                  className="specialty-tag px-3 py-1 bg-blue-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div> */}

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm h-full">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-green-600" />
              Availability
            </h3>
            <div className="availability-info text-gray-700">
              <p className="mb-2">Monday - Friday</p>
              <p className="font-medium">9:00 AM - 5:00 PM</p>
              <button onClick={() => navigate("/slotBooking")}
                className="mt-3 sm:mt-4 w-full bg-emerald-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-200"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Bio and Reviews */}
        <div className="lg:col-span-2 order-1 lg:order-2 mb-4 lg:mb-0">
          {/* <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">About</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {advisor.bio}
            </p>
          </div> */}

          {/* Reviews Section with subtle card styling */}
          <div className="advisor-reviews-section bg-white rounded-lg p-4 sm:p-6 shadow-sm h-full">
            <ReviewsList
              advisorId={advisor._id}
              currentUserId={currentUserId}
              isAdvisor={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorProfile;