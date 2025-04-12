export interface AdvisorProfileProps {
    advisor: {
        _id: string;
        username: string;
        profilePic: string;
        bio: string;
        specialties: string[];
        experience: number;
    };
    currentUserId: string;
    isOwnProfile: boolean;
}

export interface ReplyFormProps {
    onSubmit: (text: string) => Promise<void>;
    onCancel: () => void;
}

export interface FeedbackReply {
    _id: string;
    advisorId: string;
    text: string;
    createdAt: string;
}

export interface ReplyItemProps {
    reply: FeedbackReply;
    isOwnReply: boolean;
}

export interface ReviewFormProps {
    advisorId: string;
    onReviewAdded: () => void;
}


export interface User {
    _id: string;
    name: string;
    avatar?: string;
}

export interface Reply {
    _id: string;
    advisorId: User;
    text: string;
    createdAt: string;
}

export interface Review {
    _id: string;
    userId: User;
    advisorId: string;
    rating: number;
    review: string;
    createdAt: string;
    replies: Reply[];
}

export interface ReviewItemProps {
    review: Review;
    currentUserId: string;
    isAdvisor: boolean;
    onReviewUpdated: () => void;
}

export interface ReviewsListProps {
    advisorId: string;
    currentUserId: string;
    isAdvisor: boolean
}

export interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
}
