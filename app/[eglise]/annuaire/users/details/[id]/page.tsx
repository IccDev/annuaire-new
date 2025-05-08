'use client';

import UserProfile from '@/components/shared/DetailsForm';
import { useParams } from 'next/navigation';

export default function UserDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    return <UserProfile user_id={id} />;
}