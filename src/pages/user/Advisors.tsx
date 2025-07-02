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
import {advisorData} from './types'


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
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    Our Advisors
                </h1>
                {loading ? (
                    <div className='flex justify-center items-center h-40'>
                        <Loading />
                    </div>
                ) : (
                    <>

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
                                            src={advisor.profilePic || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'}
                                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                                        />
                                        <h3 className="text-lg font-semibold mt-2">{advisor.username}</h3>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

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
