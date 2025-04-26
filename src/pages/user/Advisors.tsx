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
import { advisorData } from './types'


const Advisors: React.FC = () => {
    const [advisors, setAdvisors] = useState<advisorData[]>([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState<advisorData>({
        _id: '', username: '', profilePic: '', bio: '', specialties: [], experience: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await getAdvisors()
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
    if (loading) return <Loading />

    return (
        <Layout role="user">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                    Our Advisors
                </h1>
                {loading ? (
                    <div className='flex justify-center items-center h-40'>
                        <Loading />
                    </div>
                ) : (
                    <>

                        {/* Advisor Carousel */}
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            breakpoints={{
                                480: { slidesPerView: 2, spaceBetween: 15 },
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="mb-6 sm:mb-8 px-2"
                        >
                            {advisors.map((advisor) => (
                                <SwiperSlide key={advisor._id}>
                                    <div
                                        onClick={() => setSelectedAdvisor(advisor)}
                                        className={`cursor-pointer flex flex-col items-center bg-white shadow-lg rounded-xl p-3 sm:p-4 hover:shadow-xl transition duration-300 ${selectedAdvisor._id === advisor._id ? 'ring-2 ring-green-500' : ''
                                            }`}                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
                                            <img
                                                src={advisor.profilePic || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'}
                                                alt={advisor.username}
                                                className="w-full h-full object-cover border-2 border-gray-300"
                                            />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold mt-2 text-center line-clamp-1">{advisor.username}</h3>
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
                    </>
                )}
            </div>
        </Layout >
    );
};

export default Advisors;
