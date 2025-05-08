"use client";
import ContactPage from "@/components/shared/ContactForm";
import { useParams } from "next/navigation";

export default function Contact(){
    const params = useParams();
    const user_id = params.id as string;
    
    return(
        <ContactPage />
    )
}