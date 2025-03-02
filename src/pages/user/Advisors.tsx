import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAdvisors } from '@/services/review/reviewServices'
import AdvisorProfile from "@/components/reviews/AdvisorProfile";
import Layout from "@/layout/Sidebar";
import Loading from "@/style/loading";

interface advisorData {
    _id: string
    username: string
    profilePic: string
    bio: string
    specialties: string[]
    experience: number
}



const Advisors: React.FC = () => {
    const [advisors, setAdvisors] = useState<advisorData[]>([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch advisors from the backend
    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await getAdvisors()
                console.log('response : ', response)
                setAdvisors(response.Advisors);
                setSelectedAdvisor(response.Advisors[0]);
            } catch (error) {
                console.error("Error fetching advisors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvisors();
    }, []);
    if (loading) return <Loading/>

    return (
        <Layout role="user">
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    Our Advisors
                </h1>

                {/* Advisor Carousel */}
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                    className="mb-8"
                >
                    {advisors.map((advisor) => (
                        <SwiperSlide key={advisor._id}>
                            <div
                                onClick={() => setSelectedAdvisor(advisor)}
                                className="cursor-pointer flex flex-col items-center bg-white shadow-lg rounded-xl p-4 hover:scale-105 transition"
                            >
                                <img
                                    src={advisor.profilePic}
                                    alt={advisor.username}
                                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                                />
                                <h3 className="text-lg font-semibold mt-2">{advisor.username}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Selected Advisor Profile */}
                <AdvisorProfile
                    advisor={selectedAdvisor}
                    currentUserId={""}
                    isOwnProfile={false}
                />
            </div>
        </Layout>
    );
};

export default Advisors;
