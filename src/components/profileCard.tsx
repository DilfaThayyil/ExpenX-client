import { FaPhoneAlt } from "react-icons/fa";
import { FaLanguage, FaLocationDot } from "react-icons/fa6";
import { MdOutlineMailOutline, MdVerified } from "react-icons/md";

interface UserProps {
  profile: string;
  firstName: string;
  secondName: string;
  role: string;
  language: string;
  country: string;
  email: string;
  phone: string;
}

export const ProfileCard = ({ user }: { user: UserProps }) => (
  <article className="bg-white shadow rounded-lg p-6 mb-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold">Profile</h3>
    </div>
    <div className="flex flex-col items-center">
      <img
        src={
          user.profile ||
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
        }
        className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover"
      />
      <h3 className="text-lg mb-2">
        {user.firstName} {user.secondName}
      </h3>
      {/* <p className="flex items-center text-gray-700">
        <MdVerified className="mr-2" color="blue" />
        {user.role}
      </p> */}
    </div>
    <hr className="my-6 border-t border-gray-300" />
    <div className="flex items-center text-gray-700">
      <FaLanguage className="mr-3" />
      <p>{user.language || "English"}</p>
    </div>
    <div className="flex items-center text-gray-700 mt-3">
      <FaLocationDot className="mr-3" />
      <p>{user.country || "N/A"}</p>
    </div>
    <div className="flex items-center text-gray-700 mt-3">
      <MdOutlineMailOutline className="mr-3" />
      <p>{user.email}</p>
    </div>
    <div className="flex items-center text-gray-700 mt-3">
      <FaPhoneAlt className="mr-3" />
      <p>{user.phone || "N/A"}</p>
    </div>
  </article>
);
